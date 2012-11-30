/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');

var calleeHandlers = {

    "YAHOO.util.Anim": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Anim"
        };

        return ['anim'];
    },

};

var memberHandlers = {

    "YAHOO.util.Easing.easeOut": function (node, path) {
        node.type = "Identifier";
        node.name = "Y.Anim.Easing.easeOut";
    },

    "YAHOO.util.Easing.easeIn": function (node, path) {
        node.type = "Identifier";
        node.name = "Y.Anim.Easing.easeIn";
    }

};

exports.memberHandlers = memberHandlers;
exports.calleeHandlers = calleeHandlers;
