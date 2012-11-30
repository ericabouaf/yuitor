/*jshint node:true*/
"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');

var calleeHandlers = {

    // TODO: YAHOO.widget.Button
    // TODO: YAHOO.widget.ButtonGroup
    // TODO: YAHOO.widget.AutoComplete
    // TODO: YAHOO.widget.Menu

    "YAHOO.widget.Menu": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Menu"
        };
        return ['menu'];
    },

    "YAHOO.widget.Calendar": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Calendar"
        };
        return ['calendar'];
    },

    "YAHOO.widget.Panel": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Panel"
        };
        return ['panel'];
    },

    "YAHOO.widget.TabView": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.TabView"
        };
        return ['tabview'];
    }

};

exports.calleeHandlers = calleeHandlers;
