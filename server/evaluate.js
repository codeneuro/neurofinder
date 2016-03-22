function score (answer, truth) {
  if (answer.length == 1) {
    return [
      {label: 'recall', value: Math.random()},
      {label: 'precision', value: Math.random()},
      {label: 'overlap', value: Math.random()},
      {label: 'exactness', value: Math.random()}
    ]
  } else {
    return [
      {label: 'recall', value: Math.random()},
      {label: 'precision', value: Math.random()},
      {label: 'overlap', value: Math.random()},
      {label: 'exactness', value: Math.random()}
    ]
  }
}

function average (results) {
  var results = results.map(function (result) {
    var accumulated = result.scores.map(function (score) {return score.value})
    var mean = accumulated.reduce(function (x, y) {return x + y}) / result.scores.length
    return {
      dataset: result.dataset,
      lab: result.lab,
      scores: result.scores.concat({label: 'average', value: mean})
    }
  })

  return results
}

module.exports = {
  score: score,
  average: average
}