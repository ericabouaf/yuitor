var vows = require('vows'),
    assert = require('assert');

var yuitor = require('../lib/yuitor');

vows.describe('Test env translation').addBatch({

    'should simplify the config': {
        topic: function () {
            return yuitor.transform('var isIE = YAHOO.env.ua.ie;');
        },

        'conf2input results': function (ret) {
            assert.equal(ret.code, '\nvar isIE = Y.Env.ua.ie;');
        }
    }

}).export(module);