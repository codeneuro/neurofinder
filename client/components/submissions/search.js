var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) { 
  function oninput (event) {
    dx({ type: 'SET_SEARCH', value: event.target.value })
  }

  var style = {
    container: {
      width: '90%',
      height: '50px',
      textAlign: 'left',
      paddingTop: '25px',
      paddingBottom: '6px'
    },
    input: {
      fontFamily: 'Abel',
      border: 'none',
      fontSize: '22px',
      height: '60%',
      width: '85%',
      paddingLeft: '12px',
      color: 'rgb(170,170,170)'
    },
    icon: {
      width: '30px',
      verticalAlign: 'middle'
    }
  }

  return hx`
  <div style=${style.container}>
    <img style=${style.icon} src='./components/assets/images/search.svg'>
    <input placeholder='search leaderboard' style=${style.input} oninput=${oninput}>
  </div>`
}