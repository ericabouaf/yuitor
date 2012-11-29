/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');

var handlers = {

    // TODO: YAHOO.util.Connect.initHeader => à intégrer à l'appel de YAHOO.util.Connect.asyncRequest
    // TODO: YAHOO.util.Connect.setDefaultPostHeader

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

exports.handlers = handlers;
