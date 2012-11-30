/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');


var handlers = {

    "YAHOO.lang.augmentObject": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.mix"
        };
    },

    "YAHOO.lang.merge": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.merge"
        };
    },

    "YAHOO.lang.later": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.later"
        };
    },

    "YAHOO.lang.extend": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.extend"
        };

        return [];
    },

    "YAHOO.lang.isUndefined": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Lang.isUndefined"
        };
        
        return [];
    },

    "YAHOO.lang.isValue": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Lang.isValue"
        };
        
        return [];
    },

    "YAHOO.lang.isArray": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Lang.isArray"
        };
        
        return [];
    },

    "YAHOO.lang.isNull": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Lang.isNull"
        };
        
        return [];
    },

    "YAHOO.lang.isFunction": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Lang.isFunction"
        };
        
        return [];
    },


    "YAHOO.lang.isString": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Lang.isString"
        };
        
        return [];
    },

    "YAHOO.lang.isObject": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Lang.isObject"
        };
        
        return [];
    },

    "YAHOO.lang.JSON.parse": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.JSON.parse"
        };

        return ['json-parse'];
    },

    "YAHOO.lang.JSON.stringify": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.JSON.stringify"
        };

        return ['json-stringify'];
    }


};



// Gestion des alias
for (var k in handlers) {
    var langMethod = k.substr(11);
    handlers["lang."+langMethod] = handlers[k];
}



exports.handlers = handlers;