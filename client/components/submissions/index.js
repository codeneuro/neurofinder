var hx = require('hxdx').hx
var entry = require('./entry')

module.exports = function (state) {
  if (state.loading || state.entries.length < 1) {
    return hx`<div></div>`
  } else {
    function total (entry) {
      return entry.results.map(function (result) {
        return result.scores.filter(function (score) {
          return score.label === 'average'
        }).map(function (score) { return score.value })[0]
      }).reduce(function (x, y) {return x + y})
    }

    return state.entries.sort(function (a, b) {return total(b) - total(a)}).map(function (item) {
      return entry(item)
    })
  } 
}