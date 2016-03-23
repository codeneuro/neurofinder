var mongoose = require('mongoose')

module.exports = mongoose.model('Submission', {
  name: String,
  contact: String,
  repository: String,
  algorithm: String,
  timestamp: Number,
  answers: [
    {
      dataset: String,
      regions: [{coordinates: []}]
    }
  ],
  results: [
    {
      dataset: String,
      lab: String,
      scores: [
        {label: String, value: Number}
      ]
    }
  ]
})