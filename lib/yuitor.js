/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen'),
    path = require('path');


/////////////////////////////////
// Helpers
/////////////////////////////////

// Executes visitor on the object and its children (recursively).
function traverse(object, visitor, master) {
    var key, child, parent, path;

    parent = (typeof master === 'undefined') ? [] : master;

    if (visitor.call(null, object, parent) === false) {
        return;
    }
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            path = [ object ];
            path.push(parent);
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor, path);
            }
        }
    }
}


function removeFromTree(node, ast) {
    var key, 
        child, 
        filterMethod = function(j){
            return j != node;
        };
    for (key in ast) {
        if (ast.hasOwnProperty(key)) {
            child = ast[key];
            if (child === node) {
                delete ast[key];
            }
            else if (Array.isArray(child)) {
                ast[key] = ast[key].filter(filterMethod);
            }
            else if (typeof child === 'object' && child !== null) {
                removeFromTree(node, child);
            }


        }
    }
}


function extend(destination, source) {
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k];
    }
  }
  return destination; 
}


/////////////////////////////////
// Transform
/////////////////////////////////


exports.transform = function(code) {

    // Code Parsing
    var tree = esprima.parse(code, { range: true, tokens: true, comment: true });
    
    // Attach comments to the tree
    tree = escodegen.attachComments(tree, tree.comments, tree.tokens);

    // Method handlers
    var methodHandlers = {};
    extend( methodHandlers, require(path.join(__dirname, '..', 'handlers' , 'yahoo.js')).handlers );
    extend( methodHandlers, require(path.join(__dirname, '..', 'handlers' , 'lang.js')).handlers );
    extend( methodHandlers, require(path.join(__dirname, '..', 'handlers' , 'dom.js')).handlers );
    extend( methodHandlers, require(path.join(__dirname, '..', 'handlers' , 'event.js')).handlers );
    extend( methodHandlers, require(path.join(__dirname, '..', 'handlers' , 'connect.js')).handlers );
    extend( methodHandlers, require(path.join(__dirname, '..', 'handlers' , 'env.js')).handlers );
    extend( methodHandlers, require(path.join(__dirname, '..', 'handlers' , 'cookie.js')).handlers );

    // Keep a list of YUI3 module dependencies
    var dependencies = [];

    traverse(tree, function (node, path) {
        
        // Methods handlers
        if (node.type == esprima.Syntax.CallExpression) {

            var method = escodegen.generate(node.callee);
            if(methodHandlers[method]) {

                var deps = methodHandlers[method].call(null, node, path);

                // Handle YUI3 dependencies
                if (!deps) {
                    console.log("Warning, method "+method+" defines no dependencies...");
                }
                else {
                    for (var i = 0; i < deps.length; i++) {
                        if (dependencies.indexOf(deps[i]) === -1) {
                            dependencies.push(deps[i]);
                        }
                    }
                }
                
            }


        }
        // Identifier renaming
        else if (node.type == esprima.Syntax.Identifier) {

            if (node.name === "inputEx") {
                node.name = "Y.inputEx";
            }

        }
        // Remove classic shortcuts
        else if (node.type == esprima.Syntax.VariableDeclaration) {
            node.declarations = node.declarations.filter(function(declaration){
                if (declaration.id.type == "Identifier" && declaration.id.name == "Event" && escodegen.generate(declaration.init) == "YAHOO.util.Event") {
                    return false;
                }
                if (declaration.id.type == "Identifier" && declaration.id.name == "lang" && escodegen.generate(declaration.init) == "YAHOO.lang") {
                    return false;
                }
                if (declaration.id.type == "Identifier" && declaration.id.name == "Dom" && escodegen.generate(declaration.init) == "YAHOO.util.Dom") {
                    return false;
                }
                if (declaration.id.type == "Identifier" && declaration.id.name == "DOM" && escodegen.generate(declaration.init) == "YAHOO.util.Dom") {
                    return false;
                }
                if (declaration.id.type == "Identifier" && declaration.id.name == "DOM" && escodegen.generate(declaration.init) == "util.Dom") {
                    return false;
                }
                if (declaration.id.type == "Identifier" && declaration.id.name == "util" && escodegen.generate(declaration.init) == "YAHOO.util") {
                    return false;
                }

                return true;
            });
            // if no more declaration, delete the var statement
            if (node.declarations.length === 0) {
                removeFromTree(node, path[1][0]);
            }
        }

    });


    // Code generation
    var output = escodegen.generate(tree, {
        comment: true,
        format: {
            safeConcatenation: true,
            quotes: "double" // make it easier to export to json
        }
    });

    return {
        code: output,
        dependencies: dependencies
    };

};


