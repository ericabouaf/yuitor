/*jshint node:true*/
"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');

var calleeHandlers = {

    "YAHOO.widget.AutoComplete": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.AutoComplete"
        };
        return ['autocomplete'];
    },

    "YAHOO.widget.Menu": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Menu"
        };
        return ['menu'];
    },

    
    "YAHOO.widget.Button": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.Button"
        };
        return ['button'];
    },

    "YAHOO.widget.ButtonGroup": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.ButtonGroup"
        };
        return ['button-group'];
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
