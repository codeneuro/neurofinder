var hx = require('hxdx').hx
var dx = require('hxdx').dx

var panels = require('./panels')
var submissions = require('./submissions')

module.exports = function (state) {
  var style = {
    main: {
      width: (window.innerWidth > 1200) ? '60%' : '70%',
      marginLeft: (window.innerWidth > 1200) ? '20%' : '15%',
      marginRight: (window.innerWidth > 1200) ? '20%' : '15%',
      marginBottom: '100px'
    },
    header: {
      width: '80%',
      marginLeft: '10%',
      marginRight: '10%',
      textAlign: 'center',
      marginBottom: '7%',
      paddingTop: '7%'
    },
    tabs: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    tab: {
      display: 'inline-block',
      border: 'solid 3px rgb(86, 171, 114)',
      color: 'rgb(86, 171, 114)',
      width: '30%',
      fontSize: '175%',
      textAlign: 'center',
      cursor: 'pointer',
      paddingLeft: '0.5%',
      paddingRight: '0.5%',
      paddingLeft: '6px',
      paddingTop: '8px',
      paddingBottom: '10px',
      borderRadius: '2px'
    },
    logo: {
      width: '450px'
    },
    footer: {
      marginTop: '50px',
      color: 'rgb(100,100,100)',
      fontSize: '150%',
      textAlign: 'center'
    }
  }

  Array('download-tab', 'submit-tab', 'about-tab').forEach(function (item) {
    style[item] = Object.assign({}, style.tab, {
      backgroundColor: backgroundColor(item),
      color: color(item)
    })
  })

  function color (name) {
    if (name === state.tab) return 'white'
    else return 'rgb(86, 171, 114)'
  }

  function backgroundColor (name) {
    if (name === state.tab) return 'rgb(86, 171, 114)'
    else return 'white'
  }

  function onclick (e) {
    if (state.tab === e.target.id) dx({ type: 'DESELECT_TAB' })
    else dx({ type: 'SELECT_TAB', value: e.target.id })
  }

  var logo = hx`
  <div style=${style.header}>
    <img style=${style.logo} src='./components/assets/images/logo-long.svg'></img>
  </div>`

  var tabs = hx`
  <div style=${style.tabs}>
    <div id='about-tab' className='tab' style=${style['about-tab']} onclick=${onclick}>about</div>
    <div id='download-tab' className='tab' style=${style['download-tab']} onclick=${onclick}>download data</div>
    <div id='submit-tab' className='tab' style=${style['submit-tab']} onclick=${onclick}>submit results</div>
  </div>`

  return hx`
    <div style=${style.main}>
      ${logo}
      ${tabs}
      ${panels(state.tab)}
      ${submissions(state.submissions)}
      <div style=${style.footer}>need help? join the <a href='https://gitter.im/codeneuro/neurofinder'>chat</a></div>
    </div>`
}