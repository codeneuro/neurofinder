var _ = require('lodash')
var async = require('async')
var config = require('./config')
var mongoose = require('mongoose')
var evaluate = require('./evaluate')
var debug = require('debug')('neurofinder')
var Submission = require('./models/submission')
var Dataset = require('./models/dataset')
var Answer = require('./models/answer')

mongoose.connect(config.db.uri)

function runAll () {
  function getDatasets (next) {
    debug('fetching datasets')
    Dataset.find({}, function (err, data) {
      if (err) return next({stage: 'getting datasets', error: err})
      return next(null, data)
    })
  }

  function getEntries (datasets, next) {
    debug('fetching entries')
    Answer.find({}, function (err, data) {
      if (err) return next({stage: 'getting entries', error: err})
      return next(null, datasets, data)
    })
  }

  function getResults (datasets, entries, next) {
    async.map(entries, function (entry, next) {
      async.map(entry.answers, function (answer, next) {
        datasets.forEach(function (dataset) {
          if (answer.dataset === dataset.name) {
            var threshold = parseFloat(dataset.pixels) * 5
            evaluate(dataset.regions, answer.regions, threshold, function (err, scores) {
              var reformatted = []
              _.forEach(scores, function (value, label) {
                reformatted.push({label: label, value: value})
              })
              var result = {
                dataset: dataset.name,
                lab: dataset.lab,
                duration: dataset.duration,
                rate: dataset.rate,
                region: dataset.region,
                scores: reformatted
              }
              return next(null, result)
            })
          }
        })
      }, function (err, results) {
        if (err) return next(err)
        var summary = {}
        summary.name = entry.name
        summary.contact = entry.contact
        summary.repository = entry.repository
        summary.algorithm = entry.algorithm
        summary.timestamp = entry.timestamp
        summary.results = results
        return next(null, summary)
      })
    }, function (err, results) {
      if (err) return next(err)
      return next(null, results)
    })
  }

  function saveResults (results, next) {
    async.each(results, function (result) {
      var submission = new Submission(result)
      submission.save(function (err, data) {
        if (err) console.log(err)
        debug('wrote results for ' + result.name + ':' + result.algorithm)
      })
    }, function (err) {
      if (err) return next(err)
      return next(null)
    })
  }

  async.waterfall([
    getDatasets, getEntries, getResults, saveResults
  ], function (err) {
    if (err) {
      debug('failed to run evaulation')
      console.log(err)
    } else {
      debug('success')
    }
  })
}

Submission.remove({}, function (err, data) {
  if (err) return console.error(err)
  debug('submissions emptied')
  runAll()
})