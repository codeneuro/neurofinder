'use strict';
var _ = require('lodash');
var d3 = require('d3');
var colorbrewer = require('colorbrewer');

Math.sign = Math.sign || function(x) {
  x = +x;
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
}

module.exports = {

    linspace: function(a, b, n) {
        var every = (b-a)/(n-1)
        var ranged = _.range(a, b, every);
        return ranged.length == n ? ranged : ranged.concat(b);
    },

    sortByKey: function(list, key) {
        return _.sortBy(list, key);
    },

    getRandomArbitrary: function(min, max) {
        var val = Math.random() * (max - min) + min;
        return val;
    },

    getRangeFromName: function(name) {
        switch (name) {
            case 'accuracy':
                var range = [0, 1]
                break;
            case 'overlap':
                var range = [0, 1]
                break;
            case 'count':
                var range = [0, 20]
                break;
            case 'distance':
                var range = [0, 5]
                break;
            case 'area':
                var range = [50, 100]
                break;
            default:
                var range = [0, 1]
                break;
        }
        return range
    },

    getColorFromScore: function(score, name) {

        var range = this.getRangeFromName(name)

        var domain = this.linspace(range[0], range[1], 9)
        var color = d3.scale.linear()
            .domain(domain)
            .range(colorbrewer.YlOrRd[9]);

        return color(score);

    },

    preciseRound: function(num, decimals) {
        var t=Math.pow(10, decimals);   
        return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
    },

    makeSafeForCSS: function (name) {
        return name.replace(/[^a-z0-9]/g, function(s) {
            var c = s.charCodeAt(0);
            if (c == 32) return '-';
            if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
            return '__' + ('000' + c.toString(16)).slice(-4);
        });
    }

};
