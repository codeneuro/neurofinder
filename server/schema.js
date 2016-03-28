// schema for results

module.exports = {
  'type': 'array', 
  'required': true,
  'items': {
    'type': 'object', 
    'required': true,
    'properties': {
      'dataset': {
        'type': 'string', 
        'required': true
      },
      'regions': {
        'type': 'array', 
        'required': true,
        'items': {
          'type': 'object',
          'required': true,
          'properties': {
            'coordinates' : {
              'type': 'array',
              'required': true
            }
          }
        }
      }
    }
  }
} 