var vows = require('vows'),
    assert = require('assert');

var yuitor = require('../lib/yuitor');

vows.describe('Test env translation').addBatch({

    'should simplify the config': {
        topic: function () {
            return yuitor.transform('YAHOO.util.Connect.abort(a);');
        },

        'conf2input results': function (ret) {
            assert.equal(ret.code, '\na.abort();');
        }
    }

}).export(module);