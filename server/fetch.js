var s3 = require('s3')
var mongoose = require('mongoose')
var config = require('./config')
var Dataset = require('./models/dataset')

mongoose.connect(config.db.uri)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('connected to db')
})

var client = s3.createClient({
  s3Options: {
    accessKeyId: config.s3.access,
    secretAccessKey: config.s3.secret
  }
})

function download (name, cb) {
  client.downloadBuffer({
    Bucket: 'neuro.datasets.private',
    Key: 'challenges/neurofinder.test/' + name + '/info.json'
  }).on('end', function (data) {
    var info = JSON.parse(data)
    client.downloadBuffer({
      Bucket: 'neuro.datasets.private',
      Key: 'challenges/neurofinder.test/' + name + '/sources/sources.json'
    }).on('end', function (data) {
      var regions = JSON.parse(data)
      cb({info: info, regions: regions})
    })
  })
}

function populate (datasets) {
  datasets.forEach(function (name) {
    download(name, function (data) {
      var dataset = new Dataset({
        name: name,
        contributors: data.info.contributors,
        region: data.info.region,
        lab: data.info.lab,
        animal: data.info.animal,
        regions: data.regions
      })
      dataset.save(function (err, data) {
        if (err) return console.error(err)
        console.log('dataset saved to db')
      })
    })
  })
}

function refresh (datasets) {
  Dataset.remove({}, function (err, data) {
    if (err) return console.error(err)
    console.log('db emptied')
    populate(datasets)
  })
}

var datasets = [
  '00.00.test', '00.01.test', '01.00.test', '01.01.test',
  '02.00.test', '02.01.test', '03.00.test', '04.00.test', '04.01.test'
]
refresh(datasets)