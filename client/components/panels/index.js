var hx = require('hxdx').hx
var about = require('./about')
var submit = require('./submit')
var download = require('./download')

module.exports = function (state) {
  var style = {
    box: {
      border: 'solid 3px rgb(86, 171, 114)',
      padding: '4%',
      marginTop: '2%',
      borderRadius: '2px'
    }
  }

  if (state === 'download-tab') return hx`<div style=${style.box}>${download()}</div>`
  if (state === 'submit-tab') return hx`<div style=${style.box}>${submit()}</div>`
  if (state === 'about-tab') return hx`<div style=${style.box}>${about()}</div>`
}