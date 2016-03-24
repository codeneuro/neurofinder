var fs = require('fs')
var _ = require('lodash')
var path = require('path')
var async = require('async')
var express = require('express')
var mongoose = require('mongoose')
var parser = require('body-parser')
var timestamp = require('timestamp')
var spawn = require('child_process').spawn
var evaluate = require('./evaluate')
var config = require('./config')
var Dataset = require('./models/dataset')
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

    function getDatasets (next) {
      Dataset.find({}, function (err, data) {
        if (err) return next({stage: 'getting datasets', error: err})
        return next(null, data)
      })
    }

    function checkAnswers (datasets, next) {
      if (datasets.length !== answers.length) return next({stage: 'checking answers', error: 'missing datasets'})
      return next(null, datasets)
    }

    function computeResults (datasets, next) {
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

    function sendResults (results, next) {
      req.body.results = results
      req.body.timestamp = timestamp()
      var submission = new Submission(req.body)
      submission.save(function (err, data) {
        if (err) return next({stage: 'sending results', error: err})
        return next(null)
      })
    }

    async.waterfall([
      getDatasets, checkAnswers, computeResults, sendResults
    ], function (err) {
      if (err) {
        console.error(err)
        if (err.stage === 'getting datasets') return res.status(500).end('error fetching')
        else if (err.stage === 'checking answers') return res.status(500).end(err.error)
        else if (err.stage === 'computing results') return res.status(500).end('failure evaulating, check your file!')
        else if (err.stage === 'sending results') return res.status(500).end('error posting')
        else return res.status(500).end('error parsing results')
      } else {
        console.log('wrote result to db for name: ' + req.body.name)
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
