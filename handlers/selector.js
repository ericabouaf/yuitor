/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');


var calleeHandlers = {

    // YAHOO.util.Selector.query(selector, node)
    // =>
    // Y.one(node).all(selector)
    "YAHOO.util.Selector.query": function (node, path) {

        var nodeArg = node.arguments.pop();

        node.callee = {
            "type": "Identifier",
            "name": "Y.one(" + escodegen.generate(nodeArg) + ").all"
        };

        return ['node'];
    }

};


// Gestion des alias
for (var k in calleeHandlers) {
    var domMethod = k.substr(15);
    calleeHandlers["Selector."+domMethod] = calleeHandlers[k];
}


exports.calleeHandlers = calleeHandlers;

