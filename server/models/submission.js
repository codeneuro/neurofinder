var mongoose = require('mongoose')

module.exports = mongoose.model('Submission', {
  name: String,
  contact: String,
  repository: String,
  algorithm: String,
  timestamp: Number,
  results: [
    {
      dataset: String,
      lab: String,
      duration: String,
      rate: String,
      region: String,
      scores: [
        {label: String, value: Number}
      ]
    }
  ]
})