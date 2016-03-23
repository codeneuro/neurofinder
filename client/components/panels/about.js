var hx = require('hxdx').hx

module.exports = function (state) {
  var style = {
    image: {
      width: '225px',
      marginRight: '15px'
    }
  }
  return hx`<div>
    <div>
      Calcium <a href='https://en.wikipedia.org/wiki/Calcium_imaging'>imaging</a> is a dominant technique in modern neuroscience for measuring the activity of large populations of neurons. Several challenges in how to best process and extract signals from these data.
    </div>
    <br>
    <img style=${style.image} src='./components/assets/movie.gif'>
    <img style=${style.image} src='./components/assets/zooming.gif'>
    <br>
    <br>
    <div>
      One is how to take time-varying images (left) and extracting "regions of interest" (right) that correspond to individual neurons. Despite many efforts to automate this process, most solutions still require significant manual inspection, and most algorithms have not been compared on ground truth data.
    </div>
    <br>
    <div>
      We have assembled a collection of datasets with ground truth, and are providing this web app for researchers to submit results and see algortihm performance.
    </div>
  </div>`
}