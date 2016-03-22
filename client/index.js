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

//actions.submit(sample1)(hxdx.dx)
//actions.submit(sample2)(hxdx.dx)
actions.fetch()(hxdx.dx)