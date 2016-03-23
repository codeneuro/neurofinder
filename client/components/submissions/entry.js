var hx = require('hxdx').hx
var dx = require('hxdx').dx
var sortby = require('lodash.sortby')
var d3 = require('d3-scale')

module.exports = function (state) {
  var style = {
    box: {
      border: 'solid 3px rgb(136, 138, 140)',
      padding: '2%',
      marginTop: '2%',
      position: 'relative',
      cursor: 'pointer',
      paddingLeft: '6px',
      borderRadius: '2px'
    },
    info: {
      display: 'inline-block',
      textAlign: 'right',
      fontSize: '125%',
      width: '26%',
      color: 'rgb(81,82,84)'
    },
    detail: {
      display: 'inline-block',
      textAlign: 'right',
      width: '26%',
      verticalAlign: 'super',
      color: 'rgb(141,144,146)',
      display: state.detail ? 'inline-block' : 'none'
    },
    field: {
      color: 'rgb(141,144,146)',
      width: '13%',
      textAlign: 'left',
      marginLeft: '1%',
      marginTop: '2%'
    },
    number: {
      marginTop: '10px',
      marginLeft: '-15px',
      position: 'absolute',
      pointerEvents: 'none'
    },
    header: {
      marginLeft: '4%',
      width: '69%',
      display: 'inline-block',
      verticalAlign: 'bottom'
    },
    matrix: {
      marginTop: '40px',
      marginLeft: '4%',
      width: '69%',
      display: state.detail ? 'inline-block' : 'none',
    },
    row: {
      width: '100%',
      display: 'inline-flex',
      justifyContent: 'space-between',
      marginBottom: '5px'
    },
    cell: {
      width: (40 / state.results.length) + '%',
      height: '50px',
      paddingLeft: '5%',
      backgroundColor: 'rgb(100,100,100)',
      borderRadius: '2px'
    },
    link: {
      color: 'rgb(81,82,84)'
    }
  }

  var scale = d3.scaleLinear().domain([0, 1]).range(["rgb(80, 110, 90)", "rgb(100, 240, 160)"])

  function onclick () {
    if (state.detail) dx({type: 'HIDE_DETAIL', _id: state._id})
    else dx({type: 'SHOW_DETAIL', _id: state._id})
  }

  var fields = state.results[0].scores.map(function (score) {
    return score.label
  }).filter(function (label) {return label !== 'average'})

  function row (field) {
    var selected = state.results.map(function (result) {
      return result.scores.filter(function (score) {
        return score.label === field
      }).map(function (score) {return {value: score.value, field: field, lab: result.lab, dataset: result.dataset}})
    })
    selected = sortby(selected, function (item) {return item[0].dataset})
    return selected.map(function (item) {
      var value = item[0].value.toFixed(2)
      var cell = Object.assign({}, style.cell, {backgroundColor: scale(value)})
      return hx`<div data-info=${item[0]} style=${cell} onmouseover=${onmouseover} onmouseout=${onmouseout}>
        <span style=${style.number}>${value}</span>
      </div>`
    }).concat([hx`<span style=${style.field}>${state.detail ? field : ''}</span>`])
  }

  function header () {
    return hx`<div style=${style.row}>${row('average')}</div>`
  }

  function matrix () {
    return fields.map(function (field) {
      return hx`<div style=${style.row}>${row(field)}</div>`
    })
  }

  var timeout

  function onmouseover (e) {
    clearTimeout(timeout)
    var info = e.srcElement['data-info']
    dx({type: 'SET_INFO', _id: state._id, info: info})
  }

  function onmouseout (e) {
    timeout = setTimeout(function () {
      dx({type: 'REMOVE_INFO', _id: state._id})
    }, 50)
  }

  function onclicklink (e) {
    e.preventDefault()
    if (state.detail) {
      e.stopPropagation()
      window.open(e.srcElement.href)
    }
  }

  function onmouseoverlink (e) {
    if (state.detail) {
      e.srcElement.style.color = 'rgb(10,10,10)'
    }
  }

  function onmouseoutlink (e) {
    e.srcElement.style.color = 'rgb(81,82,84)'
  }

  function onclickrepository (e) {
    e.preventDefault()
    if (state.detail && state.repository !== '') {
      e.stopPropagation()
      window.open(e.srcElement.href)
    }
  }

  function onmouseoverrepository (e) {
    if (state.detail && state.repository !== '') {
      e.srcElement.style.color = 'rgb(10,10,10)'
    }
  }

  function detail () {
    if (state.info) return hx`<div><div>${state.info.dataset}</div><div>${state.info.lab}</div></div>`
    else return hx`<div><div>mouse over</div><div>for info</div></div>`
  }

  function contact (value) {
    if (value.indexOf('@') === 0) return 'https://github.com/' + value.replace('@', '')
    else if (value.indexOf('@') > 0) return 'mailto:' + value
    else return value
  }
  
  return hx`<div className='entry' style=${style.box} onclick=${onclick}>
    <div style=${style.info}>
      <span onclick=${onclicklink} onmouseover=${onmouseoverlink} onmouseout=${onmouseoutlink} href=${contact(state.contact)}>${state.name}</span><br><span onclick=${onclickrepository} onmouseover=${onmouseoverrepository} onmouseout=${onmouseoutlink} className='simple-link' href=${state.repository}>${state.algorithm}</span>
    </div>
    <div style=${style.header}>${header()}</div>
    <div style=${style.detail}>${detail()}</div>
    <div style=${style.matrix}>${matrix()}</div>
  </div>`
}