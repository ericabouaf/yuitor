/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');


var handlers = {


    "YAHOO.log": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.log"
        };

        return [];
    }


};



exports.handlers = handlers;