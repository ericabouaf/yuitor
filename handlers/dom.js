/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');


var yui2nodeId = function (node) {
    if (node.type == esprima.Syntax.Literal) {
        node.value = '#'+node.value;
    }
};


function firstArgAsInstance(methodName) {
    return function (node, path) {

        var firstArg = node.arguments.shift();
        yui2nodeId(firstArg);

        node.callee = {
            "type": "Identifier",
            "name": "Y.one("+escodegen.generate(firstArg)+")."+methodName
        };

        return ['node'];
    };
}

var calleeHandlers = {

    // TODO: YAHOO.util.Dom.setAttribute


    "YAHOO.util.Dom.getY": firstArgAsInstance("getY"),
    "YAHOO.util.Dom.setY": firstArgAsInstance("setY"),
    "YAHOO.util.Dom.getX": firstArgAsInstance("getX"),
    "YAHOO.util.Dom.setX": firstArgAsInstance("setX"),
    "YAHOO.util.Dom.getXY": firstArgAsInstance("getXY"),
    "YAHOO.util.Dom.setXY": firstArgAsInstance("setXY"),
    
    "YAHOO.util.Dom.hasClass": firstArgAsInstance("hasClass"),
    "YAHOO.util.Dom.addClass": firstArgAsInstance("addClass"),
    "YAHOO.util.Dom.removeClass": firstArgAsInstance("removeClass"),
    "YAHOO.util.Dom.replaceClass": firstArgAsInstance("replaceClass"),
    "YAHOO.util.Dom.setStyle": firstArgAsInstance("setStyle"),
    "YAHOO.util.Dom.getStyle": firstArgAsInstance("getStyle"),

    "YAHOO.util.Dom.getNextSibling": firstArgAsInstance("next"),
    "YAHOO.util.Dom.getPreviousSibling": firstArgAsInstance("previous"),
    "YAHOO.util.Dom.inDocument": firstArgAsInstance("inDoc"),


    "YAHOO.util.Dom.generateId": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": "Y.guid"
        };

        return ['node'];
    },


    "YAHOO.util.Dom.getElementsBy": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": "/*TODO myNode.all('selectorString');*/YAHOO.util.Dom.getElementsBy"
        };

        return ['node'];
    },

    "YAHOO.util.Dom.getChildrenBy": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": "/*TODO myNode.all('selectorString');*/YAHOO.util.Dom.getChildrenBy"
        };

        return ['node'];
    },


    "YAHOO.util.Dom.getLastChild": function (node, path) {
        
        var firstArg = node.arguments.shift();

        node.callee = {
            "type": "Identifier",
            "name": "Y.one("+escodegen.generate(firstArg)+").get('childre').slice(-1).item"
        };

        node.arguments.push({
            "type": "Literal",
            "value": 0
        });

        return ['node'];
    },




    "YAHOO.util.Dom.getDocumentScrollTop": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": "Y.config.doc.get"
        };

        if (!node.arguments) {
            node.arguments = [];
        }

        node.arguments.push({
            "type": "Literal",
            "value": "docScrollY"
        });

        return ['node'];
    },

    "YAHOO.util.Dom.getDocumentScrollLeft": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": "Y.config.doc.get"
        };

        if (!node.arguments) {
            node.arguments = [];
        }

        node.arguments.push({
            "type": "Literal",
            "value": "docScrollX"
        });

        return ['node'];
    },


    "YAHOO.util.Dom.getRegion": function (node, path) {

        var firstArg = node.arguments.shift();

        node.callee = {
            "type": "Identifier",
            "name": "Y.one("+escodegen.generate(firstArg)+").get"
        };

        node.arguments.push({
            "type": "Literal",
            "value": "region"
        });

        return ['node'];
    },


    "YAHOO.util.Dom.getAncestorByClassName": function (node, path) {

        var firstArg = node.arguments.shift();

        node.arguments[0].value = "'.'+"+node.arguments[0].value;

        node.callee = {
            "type": "Identifier",
            "name": "Y.one("+escodegen.generate(firstArg)+").ancestor"
        };

        return ['node'];
    },

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

    "YAHOO.util.Dom.getViewportWidth": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": 'Y.one("body").get'
        };

        node.arguments = [{
            "type": "Literal",
            "value": "winWidth"
        }];

        return ['node'];
    },


    "YAHOO.util.Element": function (node, path) {
        
        node.callee = {
            "type": "Identifier",
            "name": "Y.one"
        };

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

// Deprecated :
calleeHandlers["YAHOO.util.Dom.getClientHeight"] = calleeHandlers["YAHOO.util.Dom.getViewportHeight"];
calleeHandlers["YAHOO.util.Dom.getClientWidth"] = calleeHandlers["YAHOO.util.Dom.getViewportWidth"];


// Gestion des alias
for (var k in calleeHandlers) {
    var domMethod = k.substr(15);
    calleeHandlers["Dom."+domMethod] = calleeHandlers[k];
    calleeHandlers["DOM."+domMethod] = calleeHandlers[k];
}



exports.calleeHandlers = calleeHandlers;