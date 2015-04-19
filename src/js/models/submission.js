'use strict';

var AmpersandModel = require('ampersand-model');
var _ = require('lodash');

var Submission = AmpersandModel.extend({
    props: {
        'id': 'number',
        'source_url': 'string',
        'avatar': 'string',
        'description': 'string',
        'algorithm': 'string',
        'pull_request': 'string',
        'metrics': 'object'
    },


    getMetricValueForDataset: function(metric, dataset) {
        console.log('getting metric ' + metric + ' for dataset ' + dataset);
        console.log(this);
        var results = this.metrics[metric];
        console.log(_.findWhere(results, {dataset: dataset}).value);
        return _.findWhere(results, {dataset: dataset}).value;
    }
});


module.exports = Submission;
