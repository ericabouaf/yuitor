/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen'),
    fs = require('fs'),
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
    var handlers = {};
    var handlersPath = path.join(__dirname, '..', 'handlers');
    fs.readdirSync(handlersPath).forEach(function(handler) {
        var req = require(path.join(handlersPath , handler));
        for(var k in req) {
            if (req.hasOwnProperty(k)) {
                if(!handlers[k]) { handlers[k] = {}; }
                //
                extend( handlers[k], req[k] );
            }
        }
    });

    // Keep a list of YUI3 module dependencies
    var dependencies = [];

    traverse(tree, function (node, path) {
        
        // Methods handlers
        if (node.type == esprima.Syntax.CallExpression || node.type == esprima.Syntax.NewExpression) {

            var method = escodegen.generate(node.callee);
            if(handlers.calleeHandlers[method]) {

                var deps = handlers.calleeHandlers[method].call(null, node, path);

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

        // MemberExpression renaming
        else if (node.type == "MemberExpression") {

            var fullMemberExpression = escodegen.generate(node);

            if (handlers.memberHandlers[fullMemberExpression]) {
                handlers.memberHandlers[fullMemberExpression].call(null, node, path);
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
                if (declaration.id.type == "Identifier" && declaration.id.name == "Selector" && escodegen.generate(declaration.init) == "YAHOO.util.Selector") {
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


