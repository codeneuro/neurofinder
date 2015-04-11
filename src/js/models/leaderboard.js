'use strict';

var Collection = require('ampersand-rest-collection');
var Submission = require('./submission');


module.exports = Collection.extend({
    model: Submission,
    url: '/data/leaderboard.json'
});
