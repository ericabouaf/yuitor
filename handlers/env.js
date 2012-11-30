/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');


var handlers = {


    "YAHOO.env.ua.ie": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Env.ua.ie"
        };

        return [];
    },

    "YAHOO.env.ua.gecko": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Env.ua.gecko"
        };

        return [];
    }


};



exports.handlers = handlers;

// TODO 