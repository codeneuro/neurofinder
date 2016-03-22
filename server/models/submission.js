var mongoose = require('mongoose')

module.exports = mongoose.model('Submission', {
  name: { type: String, unique: true },
  email: String,
  repository: String,
  handle: String,
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