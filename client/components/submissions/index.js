var hx = require('hxdx').hx
var entry = require('./entry')
var search = require('./search')
var _ = require('lodash')

module.exports = function (state) {
  if (state.loading) {
    return hx`<div className='loader loader-gray' style=${{marginTop: '25px', marginBottom: '75px'}}></div>`
  } else if (state.entries.length < 1) {
    return hx`<div></div>`
  } else {
    function total (entry) {
      return entry.results.map(function (result) {
        return result.scores.filter(function (score) {
          return score.label === 'average'
        }).map(function (score) { return score.value })[0]
      }).reduce(function (x, y) {return x + y})
    }

    var entries = state.entries

    if (state.search && state.search !== '') {
      entries = entries.filter(function (entry) {
        return (entry.name.indexOf(state.search) > -1) || (entry.algorithm.indexOf(state.search) > -1)
      })
    }

    var subfields = entries.map(function (entry) {
      return {name: entry.name, algorithm: entry.algorithm}
    })

    var unique = _.uniqWith(subfields, _.isEqual)

    var filtered = []
    var selected
    unique.forEach(function (entry) {
      selected = _.find(_.sortBy(entries, 'timestamp').reverse(), 
        { name: entry.name, algorithm: entry.algorithm })
      filtered.push(selected)
    })

    var list = filtered.sort(function (a, b) {
      return total(b) - total(a)}).map(function (item) {
        return entry(item)
      })

    return hx`
    <div>
      ${search(state)}
      ${list}
    </div>
    `
  } 
}