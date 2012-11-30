var vows = require('vows'),
    assert = require('assert');

var yuitor = require('../lib/yuitor');

vows.describe('Test env translation').addBatch({

    'should simplify the config': {
        topic: function () {
            return yuitor.transform('YAHOO.util.Selector.query(selector, node);');
        },

        'conf2input results': function (ret) {
            assert.equal(ret.code, '\nY.one(node).all(selector);');
        }
    }

}).export(module);