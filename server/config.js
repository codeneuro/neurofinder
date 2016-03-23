var format = require('util').format

var config = {
  s3: {
    access: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east'
  },
  db: {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    name: 'neurofinder'
  }
}

var baseuri = 'mongodb://%s:%s@ds013829-a0.mlab.com:13829,ds013829-a1.mlab.com:13829/%s?replicaSet=rs-ds013829'
config.db.uri = format(baseuri, config.db.user, config.db.password, config.db.name)

module.exports = config