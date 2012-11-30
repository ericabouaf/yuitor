/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');


var calleeHandlers = {


    "YAHOO.log": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.log"
        };

        return [];
    }


};



exports.calleeHandlers = calleeHandlers;