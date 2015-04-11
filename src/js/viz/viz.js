'use strict';

var _ = require('lodash');
var utils = require('../utils');
var d3 = require('d3')

/*
 * View controller
 */
function Viz($el) {
    if (!(this instanceof Viz)) {
        return new Viz($el);
    }

    this.$el = $el;

    // do some cool vizualization here

}



Viz.prototype.destroy = function() {
    // destroy d3 object
};

module.exports = Viz;
