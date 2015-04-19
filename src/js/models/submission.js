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
        var results = this.metrics[metric];
        return _.findWhere(results, {dataset: dataset}).value;
    },

    getDatasets: function() {
        var datasets = [];
        _.each(this.metrics, function(results) {
            _.each(results, function(result) {
                if(result.dataset !== 'overall' && datasets.indexOf(result.dataset) === -1) {
                    datasets.push(result.dataset);
                }    
            });
        });
        return datasets;
    }
});


module.exports = Submission;
