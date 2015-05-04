'use strict';

var AmpersandView = require('ampersand-view');
var template = require('../../templates/views/about.jade');
var utils = require('../utils');
var _ = require('lodash');

var AboutView = AmpersandView.extend({
    
    utils: utils,
    _: _,
    template: template,
    autoRender: true,

});



module.exports = AboutView;

