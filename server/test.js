var jsonschema = require('jsonschema')
var v = new jsonschema.Validator()
var schema = require('./schema')

var instance = [
  {
    "dataset": "00.00.test",
    "regions": [{"coordinates": [[0, 0], [0, 1]]}]
  },
  {
    "dataset": "00.01.test",
    "regions": [{"coordinates": [[0, 0], [0, 1]]}]
  },
  {
    "dataset": "01.00.test",
    "regions": [{"coordinates": [[0, 0], [0, 1]]}]
  },
  {
    "dataset": "01.01.test",
    "regions": [{"coordinates": [[0, 0], [0, 1]]}]
  },
  {
    "dataset": "02.00.test",
    "regions": [{"coordinates": [[0, 0], [0, 1]]}]
  },
  {
    "dataset": "02.01.test",
    "regions": [{"coordinates": [[0, 0], [0, 1]]}]
  },
  {
    "dataset": "03.00.test",
    "regions": [{"coordinates": [[0, 0], [0, 1]]}]
  },
  {
    "dataset": "04.00.test",
    "regions": [{"coordinates": [[0, 0], [0, 1]]}]
  },
  {
    "dataset": "04.01.test",
    "regions": [{"coordinates": [[0, 0], [0, 1]]}]
  }
]

console.log(v.validate(instance, schema).errors)