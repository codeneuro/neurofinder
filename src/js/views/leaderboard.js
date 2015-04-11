'use strict';

var AmpersandView = require('ampersand-view');
var template = require('../../templates/views/leaderboard.jade');

var LeaderboardView = AmpersandView.extend({
    
    template: template,
    autoRender: true


});



module.exports = LeaderboardView;

