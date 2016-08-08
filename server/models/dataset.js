var mongoose = require('mongoose')

module.exports = mongoose.model('Dataset', {
  name: {type: String, unique: true},
  contributors: [String],
  region: String,
  lab: String,
  animal: String,
  rate: String,
  duration: String,
  pixels: String,
  regions: [{id: String, coordinates: []}]
})