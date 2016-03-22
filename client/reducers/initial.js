module.exports = {
  tab: null,
  upload: {
    submitting: false,
    error: false,
    completed: false,
    message: ''
  },
  submissions: {
    loading: true,
    entries: [
      {
        detail: false,
        info: null,
        name: '',
        email: '',
        repository: '',
        handle: '',
        scores: [
          {
            dataset: '',
            recall: '',
            precision: '',
            overlap: '',
            exactness: ''
          }
        ]
      }
    ]
  }
}