'use strict';

var AmpersandView = require('ampersand-view');
var template = require('../../templates/views/submit.jade');
var utils = require('../utils');
var _ = require('lodash');

var SubmitView = AmpersandView.extend({
    
    utils: utils,
    _: _,
    template: template,
    autoRender: true,

});



module.exports = SubmitView;

