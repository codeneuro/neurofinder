var fs = require('fs')
var tmp = require('tmp')
var path = require('path')
var exec = require('child_process').exec

module.exports = function (a, b, threshold, cb) {
  function write (dir, cb) {
    fs.writeFile(path.join(dir, 'a.json'), JSON.stringify(a), function (err) {
      if (err) return cb(err)
      else fs.writeFile(path.join(dir, 'b.json'), JSON.stringify(b), function (err) {
        if (err) return cb(err)
        else cb()
      })
    })
  }

  tmp.dir(function (err, dir) {
    write(dir, function () {
      var cmd = 'neurofinder evaluate ' + dir + '/a.json ' + dir + '/b.json --threshold=' + Math.round(threshold)
      exec(cmd, function (err, stdout, stderr) {
        if (err) return cb(err)
        else if (stderr) return cb(err)
        else return cb(null, JSON.parse(stdout))
      })
    })
  })
}