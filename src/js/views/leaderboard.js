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
        'click tr.overview': 'toggleRowDetails'
    },

    toggleRowDetails: function(e) {

        var $target = $(e.target).closest('tr.overview');

        if($target.hasClass('pull-request')) {
            return;
        }
        console.log($target);

        var $label = $target.find('.metric-label');//.toggle();
        var opacity = $label.css('opacity');
        if(opacity === '0') {
            $label.css({opacity: 1});
        } else {
            $label.css({opacity: 0});
        }
        $('tr.details[data-identifier="' + $target.data('identifier') + '"]').toggle();
    }


});



module.exports = LeaderboardView;

