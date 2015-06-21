'use strict';

var AmpersandView = require('ampersand-view');
var template = require('../../templates/views/leaderboard.jade');
var utils = require('../utils');
var _ = require('lodash');

var LeaderboardView = AmpersandView.extend({
    
    utils: utils,
    _: _,
    template: template,
    autoRender: true,

    events: {
        'click .subtable': 'toggleRowDetails',
        'mouseover .number': 'hoverDataset',
        'mouseout .number': 'hoverDatasetRemove'
    },

    toggleRowDetails: function(e) {

        var $target = $(e.target).find('tr.overview');

        if ($target.length == 0) {
            $target = $(e.target).closest('tr.overview');
        }

        if ($(e.target).hasClass('pull-request')) {
            return;
        }
        
        var $label = $target.find('.metric-label');//.toggle();
        var opacity = $label.css('opacity');
        if(opacity === '0') {
            $label.css({opacity: 1});
        } else {
            $label.css({opacity: 0});
        }
        $('tr.details[data-identifier="' + $target.data('identifier') + '"]').toggle();
    },

    hoverDatasetRemove: function(e) {
        console.log('starting timeout')
        this.timeout = setTimeout( function() {
            $('.dataset-name').replaceWith("<p class='dataset-name'>" + "" + "</p>")
            $('.dataset-contributors').replaceWith("<p class='dataset-contributors'>" + "" + "</p>")
        }, 100);
        
    },

    hoverDataset: function(e) {
        
        // find the current number
        var $target = $(e.target).closest('.number');

        // get the data set name (from the number) and submission identifier (from table body)
        var dataset = $target.attr('data-data')
        var identifier1 = $(e.target).parents('tr.overview').attr('data-identifier')
        var identifier2 = $(e.target).parents('tr.details').attr('data-identifier')

        // if both are defined, update the image
        if (identifier1 | identifier2) {
            if (dataset) {
                var identifier = identifier1 | identifier2
                var newimg = "https://s3.amazonaws.com/code.neuro/neurofinder/images/" + identifier + "/" + dataset + "/sources.png"
                var image = $(e.target).parents('tbody').find('.submission-image').find('img')
                image.attr("src", newimg)
            }
        } 
        if (dataset) {
            console.log('clearing timeout')
            clearTimeout(this.timeout)
            $('.dataset-name').replaceWith("<p class='dataset-name'>" + dataset + "</p>")
            $('.dataset-contributors').replaceWith("<p class='dataset-contributors'>" + dataset + "</p>")
        }

    }


});



module.exports = LeaderboardView;

