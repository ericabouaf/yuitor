/*jshint node:true*/

"use strict";

var fs = require('fs'),
    path = require('path'),
    esprima = require('esprima'),
    escodegen = require('escodegen');


/////////////////////////////////
// filenames
/////////////////////////////////
// TODO: use argv instead
var filename = 'test.js';
// Calculate destination file name
var ext = path.extname(filename); // '.js'
var basename = filename.slice(0, filename.length - ext.length);
var destfilename = basename+'_yui3.js';
var code = fs.readFileSync(filename).toString();


/////////////////////////////////
// Code Parsing
/////////////////////////////////

var tree = esprima.parse(code, { range: true, tokens: true, comment: true });
tree = escodegen.attachComments(tree, tree.comments, tree.tokens);


/////////////////////////////////
// Code Manipulation
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
    var key, child;
    for (key in ast) {
        if (ast.hasOwnProperty(key)) {
            child = ast[key];
            if (child === node) {
                delete ast[key];
            }
            else if (Array.isArray(child)) {
                ast[key] = ast[key].filter(function(j){
                    return j != node;
                });
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


var methodHandlers = {};

extend( methodHandlers, require('./handlers/yahoo').handlers );
extend( methodHandlers, require('./handlers/lang').handlers );
extend( methodHandlers, require('./handlers/dom').handlers );
extend( methodHandlers, require('./handlers/event').handlers );
extend( methodHandlers, require('./handlers/connect').handlers );

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
            return true;
        });
        // if no more declaration, delete the var statement
        if (node.declarations.length === 0) {
            removeFromTree(node, path[1][0]);
        }
    }

});


/////////////////////////////////
// DEBUG
/////////////////////////////////

var ast = esprima.parse(code);
fs.writeFileSync(basename+'.json', JSON.stringify(ast, null, 3));

fs.writeFileSync(basename+'_yui3.json', JSON.stringify(tree, null, 3));



/////////////////////////////////
// Re-generation
/////////////////////////////////


var output = escodegen.generate(tree, {
    comment: true,
    format: {
        safeConcatenation: true,
        quotes: "double" // make it easier to export to json
    }
});


var pre = "/**\n * @module "+basename+"\n */\nYUI.add(" + JSON.stringify(basename) + ", function (Y) {\n";
var post = "\n\n}, '3.0.0a',{\n   requires: " + JSON.stringify(dependencies) + "\n});";

output = pre + output + post;

fs.writeFileSync(destfilename, output);




