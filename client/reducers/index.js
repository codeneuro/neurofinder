var combine = require('redux').combineReducers
var actions = require('./actions')
var initial = require('./initial')
var assign = require('object-assign')
var o = actions.constants

var tab = function (state, action) {
  if (typeof state == 'undefined') state = initial.tab

  switch (action.type) {

    case o.SELECT_TAB:
      return action.value

    case o.DESELECT_TAB:
      return null

    default:
      return state
  }
}

var upload = function (state, action) {
  if (typeof state == 'undefined') state = initial.upload

  switch (action.type) {

    case o.UPLOAD_STARTED:
      return {submitting: true, error: false, completed: false, message: ''}

    case o.UPLOAD_ERROR:
      return {submitting: false, error: true, completed: false, message: action.message}

    case o.UPLOAD_SUCCESS:
      return {submitting: false, error: false, completed: true, message: ''}

    case o.UPLOAD_RESET:
      return {submitting: false, error: false, completed: false, message: ''}

    default:
      return state
  }
}

var submissions = function (state, action) {
  if (typeof state === 'undefined') state = initial.submissions

  console.log(state.entries)

  switch (action.type) {

    case o.FETCH_SUBMISSIONS:
      var entries = action.entries.map(function (entry) {return assign({}, entry, {detail: false})})
      if (action.success) return {loading: false, entries: entries}
      else return {loading: true}

    case o.SHOW_DETAIL:
      var entries = state.entries.map(function (entry) {
        return assign({}, entry, {detail: entry._id === action._id ? true : entry.detail})
      })
      return assign({}, state, {entries: entries})

    case o.HIDE_DETAIL:
      var entries = state.entries.map(function (entry) {
        return assign({}, entry, {detail: entry._id === action._id ? false : entry.detail})
      })
      return assign({}, state, {entries: entries})

    case o.SET_SEARCH:
      return assign({}, state, {search: action.value})

    case o.SET_INFO:
      var entries = state.entries.map(function (entry) {
        return assign({}, entry, {info: entry._id === action._id ? action.info : entry.info})
      })
      return assign({}, state, {entries: entries})

    case o.REMOVE_INFO:
      var entries = state.entries.map(function (entry) {
        return assign({}, entry, {info: entry._id === action._id ? null : entry.info})
      })
      return assign({}, state, {entries: entries})

    default:
      return state
  }
}

module.exports = combine({
  upload: upload,
  tab: tab,
  submissions: submissions
})