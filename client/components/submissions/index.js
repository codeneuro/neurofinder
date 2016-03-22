var hx = require('hxdx').hx
var entry = require('./entry')

module.exports = function (state) {
  var style = {
    box: {
      border: 'solid 3px rgb(136, 138, 140)',
      padding: '2%',
      marginTop: '2%',
      marginLeft: '6px',
      borderRadius: '2px'
    }
  }

  if (state.loading || state.entries.length < 1) {
    return hx`<div style=${style.box}>loading</div>`
  } else {
    return state.entries.map(function (item) {
      return entry(item)
    })
  } 
}