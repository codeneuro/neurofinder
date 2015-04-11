'use strict';

var LeaderboardView = require('./views/leaderboard');
var Leaderboard = require('./models/leaderboard');
var leaderboard = new Leaderboard();

// get s3 data

leaderboard.fetch({
    success: function(collection) {

        new LeaderboardView({
            el: document.getElementById('leaderboard-container'),
            collection: collection
        });

    }

});

