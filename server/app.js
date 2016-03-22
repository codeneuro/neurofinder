var path = require('path')
var express = require('express')
var parser = require('body-parser')
var mongoose = require('mongoose')
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
  app.use(parser.json())

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

    var results = []
    var datasets = Dataset.find({}, function (err, data) {
      data.forEach(function (dataset) {
        answers.forEach(function (answer) {
          if (answer.dataset === dataset.name) {
            results.push({
              dataset: dataset.name,
              lab: dataset.lab,
              scores: evaluate.score(answer.data, dataset.data)
            })
          }
        })
      })

      if (results.length != data.length) {
        return res.status(500).end('too few datasets')
      }

      results = evaluate.average(results)
      req.body.results = results

      return res.status(200).end('submission succeeeded')

      // var submission = new Submission(req.body)
      // submission.save(function (err, data) {
      //   if (err) return console.error(err)
      //   console.log('submission saved to db from user: ' + data.name)
      // })
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
