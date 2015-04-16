# NeuroFinder

[![Join the chat at https://gitter.im/CodeNeuro/neurofinder](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/CodeNeuro/neurofinder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Benchmarking platform and competition for source extraction from imaging data

## submit an algorithm (currently in beta testing)
1. Sign up for an account on github (if you don't already have one)
2. Fork this repository
3. Create a branch
4. Add a folder inside `neurofinder/submissions` with the following structure:
```
neurofinder/submissions/your-user-name/info.json
neurofinder/submissions/your-user-name/requirements.txt
neurofinder/submissions/your-user-name/run/run.py
neurofinder/submissions/your-user-name/run/__init__.py
```
The file `info.json` should contain the following fields
```
{
    "algorithm": "name of your algorithm",
    "description": "description of your algorithm"
}
```
The file `run.py` should contain a function `run` that accepts as input a Thunder `Images` object and returns a `SourceModel`
The file `requirements.txt` can contain any neccessary dependencies, which will be installed using
```
pip install -r requirements.txt
```
See the existing folder `neurofinder/submissions/example-user/` for an example submission

5. Submit your branch as a pull request and wait for your algorithm to be validated and run!

## examples
View these analysis notebooks for examples of running source extraction algorithms:
- Loading images and sources for [comparison](http://nbviewer.ipython.org/github/codeneuro/neurofinder/blob/master/notebooks/creating-images-and-sources.ipynb)
- Creating images and sources for [testing](http://nbviewer.ipython.org/github/codeneuro/neurofinder/blob/master/notebooks/loading-images-and-sources.ipynb)

## job runner unit tests
This repo includes a suite for validating and executing pull requests, storing the status of pull requests in a Mongo database, and outputting the results to a leaderboard. To run the unit tests for this suite:
- Install the requirements with `pip install -r /path/to/neurofinder/requirements.txt`
- Call `py.test` inside the base neurofinder directory

