var fs = require('fs')
var _ = require('lodash')
var path = require('path')
var async = require('async')
var express = require('express')
var mongoose = require('mongoose')
var parser = require('body-parser')
var timestamp = require('timestamp')
var jsonschema = require('jsonschema')
var spawn = require('child_process').spawn
var debug = require('debug')('neurofinder')
var evaluate = require('./evaluate')
var config = require('./config')
var schema = require('./schema')
var Dataset = require('./models/dataset')
var Answer = require('./models/answer')
var Submission = require('./models/submission')

mongoose.connect(config.db.uri)

var start = function (opts) {
  opts = opts || {}
  var port = opts.port || 8080
  var app = express()
  app.use(express.static(path.join(__dirname, '../client')))
  app.use(parser.urlencoded({ extended: false }))
  app.use(parser.json({limit: '50mb'}))

  app.get('/api/datasets/', function (req, res) {
    Dataset.find({}, function (err, data) {
      return res.json(data)
    })
  })

  app.get('/api/submissions/', function (req, res) {
    Submission.find({}, function (err, data) {
      return res.json(data)
    })
  })

  app.post('/api/submit/', function(req, res){ 
    var answers = req.body.answers

    var v = new jsonschema.Validator()

    console.log('')
    debug('processing submission from ' + req.body.name)

    function checkSchema (next) {
      debug('checking schema')
      var result = v.validate(answers, schema)
      if (result.errors.length > 0) return next({stage: 'checking answers', error: 'invalid result format'})
      return next(null)
    }

    function getDatasets (next) {
      debug('fetching datasets')
      Dataset.find({}, function (err, data) {
        if (err) return next({stage: 'getting datasets', error: err})
        return next(null, data)
      })
    }

    function checkAnswers (datasets, next) {
      debug('checking answers')
      if (datasets.length !== answers.length) {
        return next({stage: 'checking answers', error: 'too few datasets in submission'})
      }
      var names = answers.map(function (answer) {return answer.dataset})
      var missing = false
      datasets.forEach(function (dataset) {
        if (names.indexOf(dataset.name) === -1) missing = true
      })
      if (missing) return next({stage: 'checking answers', error: 'some dataset labels are missing'})
      return next(null, datasets)
    }

    function computeResults (datasets, next) {
      debug('computing results')
      async.map(datasets, function (dataset, next) {
        answers.forEach(function (answer) {
          if (answer.dataset === dataset.name) {
            evaluate(dataset.regions, answer.regions, function (err, scores) {
              if (err) return next({stage: 'computing results', error: err})
              var reformatted = []
              _.forEach(scores, function (value, label) {
                reformatted.push({label: label, value: value})
              })
              var result = {
                dataset: dataset.name,
                lab: dataset.lab,
                scores: reformatted
              }
              return next(null, result)
            })
          }
        })
      }, function (err, results) {
        if (err) return next(err)
        return next(null, results)
      })
    }

    function sendAnswers (results, next) {
      debug('sending answers')
      req.body.results = results
      req.body.timestamp = timestamp()
      var answer = new Answer(req.body)
      answer.save(function (err, data) {
        if (err) return next({stage: 'sending results', error: err})
        return next(null)
      })
    }

    function sendResults (next) {
      debug('sending results')
      delete req.body.answers 
      var submission = new Submission(req.body)
      submission.save(function (err, data) {
        if (err) return next({stage: 'sending results', error: err})
        return next(null)
      })
    }

    async.waterfall([
      checkSchema, getDatasets, checkAnswers, computeResults, sendAnswers, sendResults
    ], function (err) {
      if (err) {
        debug('failed and sending error message')
        if (err.stage === 'getting datasets') return res.status(500).end('error fetching')
        else if (err.stage === 'checking answers') return res.status(500).end(err.error)
        else if (err.stage === 'computing results') return res.status(500).end('failure evaulating, check your file!')
        else if (err.stage === 'sending results') return res.status(500).end('error posting')
        else return res.status(500).end('error parsing results')
      } else {
        debug('wrote result to db for ' + req.body.name + ' at time ' + req.body.timestamp)
        return res.status(200).end('submission succeeeded')
      }
    })
  })

  app.listen(port, function () {
    console.log('serving neurofinder on port: ', port)
  })
}

if (require.main === module) {
  start()
} else {
  module.exports = start
}
