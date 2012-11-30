/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');

var calleeHandlers = {

    // TODO: YAHOO.util.Connect.abort

    "YAHOO.util.Connect.abort": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": escodegen.generate(node.arguments[0]) + ".abort"
        };

        node.arguments.shift();

        return [];
    },


    "YAHOO.util.Connect.setDefaultPostHeader": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "// TODO: YAHOO.util.Connect.setDefaultPostHeader"
        };
        return [];
    },

    "YAHOO.util.Connect.initHeader": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "// TODO: replace this call by the headers in next Y.ui call: YAHOO.util.Connect.initHeader"
        };
        return [];
    },

    "YAHOO.util.Connect.asyncRequest": function(node, path) {

        // TODO: si les methods success et failure sont définies ici, ajouter le paramètre 'id'
        // TODO: dernier arguments params à passer dans l'objet en tant que 'data'

        var methodArg = node.arguments.shift();

        node.callee = {
            "type": "Identifier",
            "name": "Y.io"
        };

        var onArg = node.arguments[1];

        node.arguments[1] = {
            "type": "ObjectExpression",
            "properties": [
                {
                    "type": "Property",
                    "key": {
                        "type": "Identifier",
                        "name": "method"
                    },
                    "value": methodArg
                },
                {
                    "type": "Property",
                    "key": {
                        "type": "Identifier",
                        "name": "on"
                    },
                    "value": onArg
                }
            ]
        };

        return ['io'];
    }

};

exports.calleeHandlers = calleeHandlers;

