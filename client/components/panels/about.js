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
      Calcium <a href='https://en.wikipedia.org/wiki/Calcium_imaging'>imaging</a> is a dominant technique in modern neuroscience for measuring the activity of large populations of neurons. Several challenges remain in how to best process and extract signals from these data.
    </div>
    <br>
    <img style=${style.image} src='./components/assets/movie.gif'>
    <img style=${style.image} src='./components/assets/zooming.gif'>
    <br>
    <br>
    <div>
      One challenge is how to take time-varying images (the movie on the left) and extract "regions of interest" (the pink regions on the right) that correspond to individual neurons. Despite many efforts to automate this process, most solutions still require significant manual inspection, and most algorithms have not been compared on ground truth data.
    </div>
    <br>
    <div>
      We have assembled a collection of datasets with ground truth for benchmarking algorithms. You can download the data, develop your algorithm in the language of your choice, and submit a file to this website with your results. The leaderboard will rank algorithm performance across datasets. See the 'download' and 'submit' tabs to get started. If you have any problems you can open an issue on <a href='https://github.com/codeneuro/neurofinder'>github</a> or come talk to us in the <a href='https://gitter.im/codeneuro/neurofinder'>chatroom</a>!
    </div>
  </div>`
}