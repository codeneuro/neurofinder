var mongoose = require('mongoose')

module.exports = mongoose.model('Answer', {
  name: String,
  contact: String,
  repository: String,
  algorithm: String,
  timestamp: Number,
  results: [
    {
      dataset: String,
      lab: String,
      scores: [
        {label: String, value: Number}
      ]
    }
  ],
  answers: [
    {
      dataset: String,
      regions: [{coordinates: []}]
    }
  ]
})