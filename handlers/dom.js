/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');


var yui2nodeId = function (node) {
    if (node.type == esprima.Syntax.Literal) {
        node.value = '#'+node.value;
    }
};


var handlers = {

    // TODO: YAHOO.util.Dom.getChildrenBy
    // TODO: YAHOO.util.Dom.getElementsBy
    // TODO: YAHOO.util.Dom.getAncestorByClassName

    // TODO: YAHOO.util.Dom.getRegion
    
    // TODO: YAHOO.util.Dom.setAttribute
    // TODO: YAHOO.util.Dom.setY

    "YAHOO.util.Dom.getViewportHeight": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": 'Y.one("body").get'
        };

        node.arguments = [{
            "type": "Literal",
            "value": "winHeight"
        }];

        return ['node'];
    },



    "YAHOO.util.Dom.insertAfter": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": escodegen.generate(node.arguments[1])+".insertAfter"
        };

        node.arguments[1] = {
            "type": "Literal",
            "value": "after"
        };

        return ['node'];
    },

    "YAHOO.util.Dom.insertBefore": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": escodegen.generate(node.arguments[1])+".insertBefore"
        };

        node.arguments[1] = {
            "type": "Literal",
            "value": "before"
        };

        return ['node'];
    },

    "YAHOO.util.Event.onDOMReady": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "// TODO: remove the call to YAHOO.util.Event.onDOMReady\nYAHOO.util.Event.onDOMReady"
        };
        return ['node'];
    },

    "YAHOO.util.Dom.hasClass": function(node, path) {

        var firstArg = node.arguments.shift();
        yui2nodeId(firstArg);
        
        node.callee = {
            "type": "Identifier",
            "name": "Y.one("+escodegen.generate(firstArg)+").hasClass"
        };

        return ['node'];
    },

    "YAHOO.util.Dom.addClass": function(node, path) {

        var firstArg = node.arguments.shift();
        yui2nodeId(firstArg);
        
        node.callee = {
            "type": "Identifier",
            "name": "Y.one("+escodegen.generate(firstArg)+").addClass"
        };

        return ['node'];
    },

    "YAHOO.util.Dom.removeClass": function(node, path) {

        var firstArg = node.arguments.shift();
        yui2nodeId(firstArg);
        
        node.callee = {
            "type": "Identifier",
            "name": "Y.one("+escodegen.generate(firstArg)+").removeClass"
        };

        return ['node'];
    },

    "YAHOO.util.Dom.setStyle": function(node, path) {

        var firstArg = node.arguments.shift();
        yui2nodeId(firstArg);
        
        node.callee = {
            "type": "Identifier",
            "name": "Y.one("+escodegen.generate(firstArg)+").removeClass"
        };

        return ['node'];
    },


    "YAHOO.util.Dom.getElementsByClassName": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": "Y.all"
        };

        var firstArg = node.arguments[0];
        if (firstArg.type == esprima.Syntax.Literal) {
            firstArg.value = '.'+firstArg.value;
        }

        return ['node'];
    },

    "YAHOO.util.Dom.get": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.one"
        };
        var firstArg = node.arguments[0];
        yui2nodeId(firstArg);
        
        return ['node'];
    }

};

// Gestion des alias
for (var k in handlers) {
    var domMethod = k.substr(15);
    handlers["Dom."+domMethod] = handlers[k];
    handlers["DOM."+domMethod] = handlers[k];
}



exports.handlers = handlers;