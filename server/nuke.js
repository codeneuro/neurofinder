var s3 = require('s3')
var mongoose = require('mongoose')
var config = require('./config')
var Submission = require('./models/submission')
var Answer = require('./models/answer')

mongoose.connect(config.db.uri)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('connected to db')
})

function nukeSubmissions () {
  Submission.remove({}, function (err, data) {
    if (err) return console.error(err)
    console.log('db emptied')
  })
}

function nukeAnswers () {
  Answer.remove({}, function (err, data) {
    if (err) return console.error(err)
    console.log('db emptied')
  })
}

nukeSubmissions()
nukeAnswers()