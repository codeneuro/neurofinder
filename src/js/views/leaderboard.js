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
        'hover .number': 'hoverDataset'
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

    hoverDataset: function(e) {
        var $target = $(e.target).closest('.number');
        console.log($target.attr('class'));
    }


});



module.exports = LeaderboardView;

