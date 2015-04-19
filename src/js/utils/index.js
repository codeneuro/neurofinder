'use strict';
var _ = require('lodash');
var d3 = require('d3');
var colorbrewer = require('colorbrewer');

module.exports = {



    sortByKey: function(list, key) {
        return _.sortBy(list, key);
    },

    getRandomArbitrary: function(min, max) {
        var val = Math.random() * (max - min) + min;
        return val;
    },

    getColorFromScore: function(score) {
        var color = d3.scale.quantile()
            .domain([0, 1])
            .range(colorbrewer.Blues[9]);
        
        return color(score);

    },

    preciseRound: function(num, decimals) {
        var t=Math.pow(10, decimals);   
        return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
    }


};
