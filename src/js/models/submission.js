'use strict';

var AmpersandModel = require('ampersand-model');

var Submission = AmpersandModel.extend({
    props: {
        'source_url': 'string'
    }
});


module.exports = Submission;
