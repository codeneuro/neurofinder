var hx = require('hxdx').hx
var dx = require('hxdx').dx
var ax = require('../../reducers/actions')
var connect = require('hxdx').connect

function submit (state) {
  var style = {
    form: {
      width: '50%',
      display: 'inline-block',
      textAlign: 'right'
    },
    input: {
      fontFamily: 'Abel',
      fontSize: '18px',
      border: 'none',
      borderBottom: 'solid 1px black',
      marginBottom: '8px',
      marginLeft: '5px',
      width: '60%'
    },
    label: {
      color: 'rgb(130,130,130)'
    },
    dropzone: {
      marginLeft: '20%',
      width: '120px',
      height: '120px',
      border: 'dotted 4px rgb(86, 171, 114)',
      display: 'inline-block',
      verticalAlign: 'bottom',
      textAlign: 'center',
      padding: '30px'
    },
    droptext: {
      fontSize: '150%',
      color: 'rgb(86, 171, 114)',
      pointerEvents: 'none'
    },
    code: {
      color: 'rgb(120,120,120)',
      fontSize: '16px'
    },
    message: {
      marginTop: '20px',
      pointerEvents: 'none'
    }
  }

  function status () {
    if (state.upload.submitting) return hx`<div style=${style.message}>submitting...</div>`
    else if (state.upload.error) return hx`<div style=${style.message}>${state.upload.message}</div>`
    else if (state.upload.completed) return hx`<div style=${style.message}>completed!</div>`
    else return hx`<div style=${style.message}></div>`
  }

  function ondrop (event, data) {
    event.stopPropagation()
    event.preventDefault()

    dx({ type: 'UPLOAD_STARTED' })

    var failed = false
    var message = ''

    try {
      var reader = new FileReader()
      reader.onloadend = function () {
        try {
          var answers = JSON.parse(this.result)
        } catch (e) {
          failed = true
          message = 'error parsing file!'
        }
        var payload = {
          name: document.querySelector('#name').value,
          email: document.querySelector('#email').value,
          repository: document.querySelector('#repository').value,
          user: document.querySelector('#user').value,
          algorithm: document.querySelector('#algorithm').value,
          answers: answers
        }

        Array('name', 'email', 'repository', 'user', 'algorithm').forEach(function (field) {
          if (!payload[field] || payload[field] == '') {
            failed = true
            message = 'fill in the forms?'
          }
        })
        if (!failed) {
          ax.submit(payload)(dx)
        } else {
          dx({ type: 'UPLOAD_ERROR', message: message })
        }
      }
      reader.readAsText(event.dataTransfer.files[0])
    } catch (err) {
      dx({ type: 'UPLOAD_ERROR', message: 'error reading file!' })
    }
    document.querySelector('#dropzone').style.border = 'dotted 4px rgb(86, 171, 114)'
  }

  function ondragover (event) {
    event.stopPropagation()    
    event.preventDefault()
  }

  function ondragenter (event) {
    document.querySelector('#dropzone').style.border = 'solid 4px rgb(86, 171, 114)'
  }

  function ondragleave (event) {
    document.querySelector('#dropzone').style.border = 'dotted 4px rgb(86, 171, 114)'
  }

  return hx`
  <div>
  <div>
    To submit your algorithm, run it on the test data and generate a JSON file with the results. The format should be an array of result objects, one per test dataset, each with a list of coordinate objects.
  </div>
  <code><pre style=${style.code}>
    [{
      "dataset": "00.00.test",
      "sources": [{"coordinates": [[x, y], ...]}, ...]
    }, ...]
  </pre></code>
  <div>
    Then fill out the form below and drag your JSON file into the well.
  </div>
  <br>

  <div style=${style.form}>
    <div>
    <span style=${style.label}>name</span> <input id='name' style=${style.input}>
    </div>
    <div>
    <span style=${style.label}>email</span> <input id='email' style=${style.input}>
    </div>
    <div>
    <span style=${style.label}>github repository</span> <input id='repository' style=${style.input}>
    </div>
    <div>
    <span style=${style.label}>github user</span> <input id='user' style=${style.input}>
    </div>
    <div>
    <span style=${style.label}>algorithm name</span> <input id='algorithm' style=${style.input}>
    </div>
  </div>

  <div id='dropzone' ondrop=${ondrop} ondragover=${ondragover} ondragenter=${ondragenter} ondragleave=${ondragleave} style=${style.dropzone}>
    <span style=${style.droptext}>drop result file here</span>
    ${status()}
  </div>

  </div>
  `
}

module.exports = connect({ upload: 'upload' }, submit)