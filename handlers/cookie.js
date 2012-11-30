/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');

var handlers = {

    "YAHOO.util.Cookie.remove": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Cookie.remove"
        };

        return ['cookie'];
    },

    "YAHOO.util.Cookie.get": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Cookie.get"
        };

        return ['cookie'];
    },

    "YAHOO.util.Cookie.set": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Cookie.set"
        };

        return ['cookie'];
    }


};



exports.handlers = handlers;
