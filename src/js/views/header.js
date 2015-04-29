'use strict';

var AmpersandView = require('ampersand-view');
var template = require('../../templates/views/topbar.jade');
var utils = require('../utils');
var _ = require('lodash');

var HeaderView = AmpersandView.extend({
    
    utils: utils,
    _: _,
    template: template,
    autoRender: true,

});



module.exports = HeaderView;

