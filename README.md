# NeuroFinder

[![Join the chat at https://gitter.im/CodeNeuro/neurofinder](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/CodeNeuro/neurofinder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Benchmarking platform and competition for source extraction from imaging data

Includes a suite for validating and executing pull requests, storing the status of pull requests in a Mongo database, and outputting the results to a leaderboard

To run the unit tests
- Install the requirements with `pip install -r /path/to/neurofinder/requirements.txt`
- Call `py.test` inside the base neurofinder directory


View example analysis notebooks:
- Loading images and sources for [comparison](http://nbviewer.ipython.org/github/codeneuro/neurofinder/blob/master/notebooks/creating-images-and-sources.ipynb)
- Creating images and sources for [testing](http://nbviewer.ipython.org/github/codeneuro/neurofinder/blob/master/notebooks/loading-images-and-sources.ipynb)
