# NeuroFinder

[![Join the chat at https://gitter.im/CodeNeuro/neurofinder](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/CodeNeuro/neurofinder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Benchmarking platform and challenge for source extraction from imaging data. 

Develop algorithms interactively in standard environments using Docker and Jupyter notebooks. Have your algorithms automatically deployed and tested in the cloud using Spark. 

## explore the data and algorithms
1. Go to [codeneuro notebooks](http://notebooks.codeneuro.org)
2. Launch a notebook session and click on the neurofinder section
3. Explore the notebooks to learn about data format, run example algorithms, and see walk-throughs for writing custom algorithms.

## submit an algorithm
1. Sign up for an account on github (if you don't already have one)
2. Fork this repository
3. Create a branch
4. Add a folder inside `neurofinder/submissions` with the structure described below
5. Submit your branch as a pull request and wait for your algorithm to be validated and run!

Submission structure:
```
neurofinder/submissions/user-name-alogirthm-name/info.json
neurofinder/submissions/user-name-alogirthm-name/run/run.py
neurofinder/submissions/user-name-alogirthm-name/run/__init__.py
```
The file `info.json` should contain the following fields
```
{
    "algorithm": "name of your algorithm",
    "description": "description of your algorithm"
}
```
The file `run.py` should contain a function `run` that accepts as input an `Images` object and an `info` dictionary, and returns a `SourceModel` (these classes are from [Thunder](http://thunder-project.org)'s Source Extraction API). See the existing folder `neurofinder/submissions/example-user-example-algorithm/` for an example submission.

Jobs will be automatically run every few days on a dynamically-deployed Spark cluster, so be patient with your submissions. You will be notified of job status via comments on your pull request.

## data sets
Data sets for evaluating algorithms have been generously provided by the following individuals and labs:
- Simon Peron & Karel Svoboda / Janelia Research Campus
- Adam Packer, Lloyd Russell & Michael H&auml;usser / UCL
- Jeff Zaremba, Patrick Kaifosh & Attila Losonczy / Columbia
- Nicholas Sofroniew & Karel Svoboda / Janelia Research Campus
- Philipp Bethge and Fritjof Helmchen / University of Zurich (in preparation)

All data hosted on Amazon S3 and training data availiable through the CodeNeuro [data portal](http://datasets.codeneuro.org).

## environment
All jobs will be run on an Amazon EC2 cluster in a standardized environment. Our notebooks service uses Docker containers to deploy an interactive version of this same environment running in Jupyter notebooks. This is useful for testing and developing algorithms, but is currently limited to only one node.

The environment has following specs and included libraries:

- Python v2.7.6
- Spark v1.3.0
- Numpy v1.9.2
- Scipy v0.15.1
- Scikit Learn v0.16.1
- Scikit Image v0.10.1
- Matplotlib v1.4.3

as well as several additional libraries included with Anaconda. You can develop and test your code in a full cluster deployment by following [these instructions](http://thunder-project.org/thunder/docs/install_ec2.html) to launch a cluster on EC2.

## about the job runner
This repo includes a suite for validating and executing pull requests, storing the status of pull requests in a Mongo database, and outputting the results to S3. To run its unit tests:
- Install the requirements with `pip install -r /path/to/neurofinder/requirements.txt`
- Call `py.test` inside the base neurofinder directory

