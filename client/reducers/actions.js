var request = require('browser-request')

var constants = {
  SELECT_TAB: 'SELECT_TAB',
  DESELECT_TAB: 'DESELECT_TAB',
  FETCH_SUBMISSIONS: 'FETCH_SUBMISSIONS',
  SHOW_DETAIL: 'SHOW_DETAIL',
  HIDE_DETAIL: 'HIDE_DETAIL',
  SET_INFO: 'SET_INFO',
  SET_SEARCH: 'SET_SEARCH',
  REMOVE_INFO: 'REMOVE_INFO',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  UPLOAD_STARTED: 'UPLOAD_STARTED',
  UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
  UPLOAD_RESET: 'UPLOAD_RESET'
}

var host = 'http://localhost:8080'

function fetch () {
  return function (dx) {
    request({
      method: 'GET', 
      url: host + '/api/submissions', 
      json: true
    }, function (err, res, body) {
      if (err) {
        return dx({
          type: constants.FETCH_SUBMISSIONS, 
          success: false
        })
      }
      return dx({
        type: constants.FETCH_SUBMISSIONS, 
        success: true,
        entries: body
      })
    })
  }
}

function submit (data) {
  return function (dx) {
    request({
      method: 'POST', 
      url: host + '/api/submit', 
      body: JSON.stringify(data), 
      json: true
    }, function (req, res, body) {
      if (res.statusCode == 200) {
        fetch()(dx)
        dx({ type: 'UPLOAD_SUCCESS' })
        setTimeout(function () {
          dx({ type: 'UPLOAD_RESET' })
        }, 2000)
      }
      else dx({ type: 'UPLOAD_ERROR', message: res.response || 'failed to upload' })
    })
  }
}

module.exports = {
  constants: constants,
  fetch: fetch,
  submit: submit
}