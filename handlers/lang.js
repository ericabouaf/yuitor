/*jshint node:true*/

"use strict";

var esprima = require('esprima'),
    escodegen = require('escodegen');

function simple_rename(destFn) {
    return function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": destFn
        };
        return [];
    }
};

var calleeHandlers = {

    "YAHOO.lang.augmentObject": simple_rename("Y.mix"),
    "YAHOO.lang.merge": simple_rename("Y.merge"),
    "YAHOO.lang.later": simple_rename("Y.later"),
    "YAHOO.lang.extend": simple_rename("Y.extend"),
    "YAHOO.extend": simple_rename("Y.extend"),

    "YAHOO.lang.isUndefined": simple_rename("Y.Lang.isUndefined"),
    "YAHOO.lang.isValue": simple_rename("Y.Lang.isValue"),
    "YAHOO.lang.isArray": simple_rename("Y.Lang.isArray"),
    "YAHOO.lang.isNull": simple_rename("Y.Lang.isNull"),
    "YAHOO.lang.isFunction": simple_rename("Y.Lang.isFunction"),
    "YAHOO.lang.isString": simple_rename("Y.Lang.isString"),
    "YAHOO.lang.isObject": simple_rename("Y.Lang.isObject"),
    "YAHOO.lang.isNumber": simple_rename("Y.Lang.isNumber"),
    "YAHOO.lang.isBoolean": simple_rename("Y.Lang.isBoolean"),

    "YAHOO.lang.JSON.parse": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.JSON.parse"
        };
        return ['json-parse'];
    },

    "YAHOO.lang.JSON.stringify": function (node, path) {
        node.callee = {
            "type": "Identifier",
            "name": "Y.JSON.stringify"
        };
        return ['json-stringify'];
    }


};



var memberHandlers = {
    "YAHOO.lang.JSON.useNativeStringify": function (node, path) {
        node.type = "Identifier";
        node.name = "// TODO: YAHOO.lang.JSON.useNativeStringify";
    }
};
exports.memberHandlers = memberHandlers;



// Alias handling
for (var k in calleeHandlers) {
    var langMethod = k.substr(11);
    calleeHandlers["lang."+langMethod] = calleeHandlers[k];
}

exports.calleeHandlers = calleeHandlers;