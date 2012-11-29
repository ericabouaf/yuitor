/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');


var handlers = {

    /* TODO: "YAHOO.lang.later": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.extend"
        };
    },*/

    "YAHOO.lang.extend": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.extend"
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