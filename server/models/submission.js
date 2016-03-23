var mongoose = require('mongoose')

module.exports = mongoose.model('Submission', {
  name: String,
  contact: String,
  repository: String,
  algorithm: String,
  answers: [
    {
      dataset: String,
      sources: [{coordinates: []}]
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