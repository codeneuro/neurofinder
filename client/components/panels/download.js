var hx = require('hxdx').hx

module.exports = function (state) {

  var style = {
    list: {
      width: '60%'
    },
    dataset: {
      backgroundColor: 'rgb(235,235,235)',
      paddingLeft: '5px',
      paddingRight: '5px',
      marginLeft: '5px',
      marginRight: '5px',
      marginBottom: '5px',
      display: 'inline-block'
    }
  }

  function training () {
    var ids = ['00.00', '00.01', '00.02', '00.03', '00.04', '00.05', '00.06', '00.07', '00.08', '00.09', '00.10', '00.11',
    '01.00', '01.01', '02.00', '02.01', '03.00', '04.00', '04.01']
    return ids.map(function (id) {
      return hx`<span style=${style.dataset}><a href=${'https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.' + id + '.zip'}>${id}</a></span>`
    })
  }

  function testing () {
    var ids = ['00.00.test', '00.01.test','01.00.test', '01.01.test','02.00.test', '02.01.test', '03.00.test', '04.00.test', '04.01.test', 'all.test']
    return ids.map(function (id) {
      return hx`<span style=${style.dataset}><a href=${'https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.' + id + '.zip'}>${id}</a></span>`
    })
  }

  return hx`<div>
    <div>
      Data has been generously provided by the Svoboda, Hausser, Losonczy, and Harvey labs.
    </div>
    <br>
    <div>
      Each dataset is available as a zip file, and includes images (as TIFF), ground truth neuron regions (as JSON), metadata, and code for loading the data in python, javascript, and matlab. The code examples are also on <a href='https://github.com/codeneuro/neurofinder-datasets'>github</a>. Each dataset is around 1 GB zipped, and represents a single imaging plane varying over time. Labels are provided only for training data.
    </div>
    <br>
    <div>
      The source of labels differs across the datasets, to reflect some amibiguity as how to best define "ground truth" for this problem. For the <span style=${style.dataset}>00</span> data, labels are derived from an anatomical marker that indicates the precise location of each neuron, and includes neurons with no activity. For the <span style=${style.dataset}>01</span> <span style=${style.dataset}>02</span> <span style=${style.dataset}>03</span> <span style=${style.dataset}>04</span> data labels were hand drawn or manually curated, using the raw data and various summary statistics, some of which are biased torwards active neurons. As a result, an algorithm's performance may vary across datasets depending on how sensitive it is to levels of activity. That is why we show all evaluation metrics for all datasets!
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