'use strict';

var LeaderboardView = require('./views/leaderboard');
var HeaderView = require('./views/header');
var Leaderboard = require('./models/leaderboard');
var AboutView = require('./views/about');
var SubmitView = require('./views/submit');
var leaderboard = new Leaderboard();
var ViewSwitcher = require('ampersand-view-switcher');

// get s3 data

var switcher = new ViewSwitcher(document.getElementById('leaderboard-container'));
var leaderboardView;

var submitView = new SubmitView();
var aboutView = new AboutView();


leaderboard.fetch({
    success: function(collection) {

        leaderboardView = new LeaderboardView({
            collection: collection
        });

        switcher.set(leaderboardView);

        new HeaderView({
            el: document.getElementById('topbar'),
            collection: collection
        });

    }

});


$('#about').click(function() {
    switcher.set(aboutView);
})
$('#submit').click(function() {
    switcher.set(submitView);
})
$('#current').click(function() {
    switcher.set(leaderboardView);
})
