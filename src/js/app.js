'use strict';

var LeaderboardView = require('./views/leaderboard');
var HeaderView = require('./views/header');
var Leaderboard = require('./models/leaderboard');
var leaderboard = new Leaderboard();

// get s3 data

leaderboard.fetch({
    success: function(collection) {

        new LeaderboardView({
            el: document.getElementById('leaderboard-container'),
            collection: collection
        });

        new HeaderView({
            el: document.getElementById('topbar'),
            collection: collection
        });

    }

});

