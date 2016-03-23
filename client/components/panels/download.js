var hx = require('hxdx').hx

module.exports = function (state) {

  var style = {
    list: {
      width: '50%'
    }
  }

  function training () {
    var ids = ['00.00', '00.01', '00.02', '00.03', '00.04', '00.05', '00.06', '00.07', '00.08', '00.09', '00.10', '00.11',
    '01.00', '01.01', '01.02', '01.03', '01.04', '02.00', '02.01', '03.00']
    return ids.map(function (id) {
      return hx`<span><a href=${'https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.' + id + '.zip'}>${id}</a><span> - </span></span>`
    })
  }

  function testing () {
    var ids = ['00.00.test', '00.01.test','01.00.test', '01.01.test','02.00.test', '02.01.test', '03.00.test']
    return ids.map(function (id) {
      return hx`<span><a href=${'https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.' + id + '.zip'}>${id}</a><span> - </span></span>`
    })
  }

  return hx`<div>
    <div>
      Data has been generously provided by the Svoboda, Hausser, and Losonczy labs.
    </div>
    <br>
    <div>
      Each dataset is available as a zip file, and includes code for loading the data and the ground truth annotations in Python and Matlab. There are 20 training datasets and 7 test datasets. Each dataset is around 1 GB zipped. Ground truth is derived from red nuclear labeling and/or hand annotation.
    </div>
    <br>
    <div>
      Training datasets (including labels)
    </div>
    <br>
    <div style=${style.list}>${training()}</div>
    <br>
    <div>
      Testing datasets (no labels)
    </div>
    <br>
    <div style=${style.list}>${testing()}</div>
    <br>
    <div>
      Email <a href='mailto:info@codeneuro.org'>info@codeneuro.org</a> if you have a dataset to contribute!
    </div>
  </div>`
}