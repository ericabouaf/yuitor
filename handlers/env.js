/*jshint node:true*/

"use strict";

/*var esprima = require('esprima'),
    escodegen = require('escodegen');*/

var memberHandlers = {


    "YAHOO.env.ua.ie": function (node, path) {
        node.type = "Identifier";
        node.name = "Y.Env.ua.ie";
    },

    "YAHOO.env.ua.webkit": function (node, path) {
        node.type = "Identifier";
        node.name = "Y.Env.ua.webkit";
    },

    "YAHOO.env.ua.gecko": function (node, path) {
        node.type = "Identifier";
        node.name = "Y.Env.ua.gecko";
    }

};



exports.memberHandlers = memberHandlers;
