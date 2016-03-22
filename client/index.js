var hxdx = require('hxdx')
var createStore = require('redux').createStore
var reducer = require('./reducers')
var initial = require('./reducers/initial')
var actions = require('./reducers/actions')
var components = require('./components')
var sample1 = require('./sample1')
var sample2 = require('./sample2')

var store = createStore(reducer, initial)
hxdx.render(components, store)

actions.fetch()(hxdx.dx)