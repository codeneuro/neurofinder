# neurofinder [![Join the chat at https://gitter.im/CodeNeuro/neurofinder](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/CodeNeuro/neurofinder?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> Benchmarking challenge for finding neurons in [calcium imaging](https://en.wikipedia.org/wiki/Calcium_imaging) data. 

Calcium imaging is a widely used techniqe in modern neuroscience for measuring the activity of large populations of neurons. Identifying individual neurons in these images remains a challenge, and most approaches still rely on manual inspection or annotation. We have assembled a collection of datasets with ground truth labels, and a web app for researchers to submit results and compare algorithms.

This document describes how to download the data, develop algoritms in your favorite computing environment, and submit your results for evaluation!

## download the data
1. Browse the list of datasets below
2. Download one or more of them
3. Use the example scripts to load data in your language of choice (currently includes `python` and `matlab`)
4. Develop and refine your algorithm.

## submit an algorithm
1. Run your algorithm on all the testing datasets
1. Go to [neurofinder](http://neurofinder.codeneuro.org)
2. Click the `submit` tab and upload your results file!

#### submission format

Your results should be formatted as a single JSON file with the coordinates of all identified neurons for all testing datasets, in the following format:

```
[
  {
    "dataset": "00.00.test",
    "sources": [{"coordinates": [[x, y], [x, y], ...]}, ...]
  },
  {
    "dataset": "00.01.test",
    "sources": [{"coordinates": [[x, y], [x, y], ...]}, ...]
  },
  ...
]
```

If you are in Python, you can generate this file by storing your results in a dictionary and writing it to a JSON string:

```python
import json
results = [{'dataset': '00.00.test', 'sources': [{'coordinates': [[0, 1], [2, 3]]}]}]
with open('results.json', 'w') as f:
  f.write(json.dumps(results))
```

If you are working in Matlab, checkout the [jsonlab](http://www.mathworks.com/matlabcentral/fileexchange/33381-jsonlab--a-toolbox-to-encode-decode-json-files-in-matlab-octave) package to achieve a similar result. Or, switch to Python.

## datasets

Datasets have been generously provided by the following individuals and labs:
- Simon Peron, Nicholas Sofroniew, & Karel Svoboda / Janelia Research Campus : `00`, `02`
- Adam Packer, Lloyd Russell & Michael H&auml;usser / UCL : `01`
- Jeff Zaremba, Patrick Kaifosh & Attila Losonczy / Columbia : `03`

All datasets are hosted on Amazon S3, and direct links to zipped downloads are below.

Each dataset includes raw image data in a standardized binary format, as well as simple example scripts for loading data in both `python` and `MATLAB`. The training data additionally includes the coordinates of identified neurons (the "ground truth"). Depending on the dataset, these ground truth labels are based on a separate anatomical nuclear marker and/or hand annotations from the dataset providers.

#### training data

[`neurofinder.00.00`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.00.zip) 
[`neurofinder.00.01`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.01.zip)
[`neurofinder.00.02`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.02.zip)
[`neurofinder.00.03`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.03.zip)
[`neurofinder.00.04`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.04.zip)
[`neurofinder.00.05`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.05.zip)
[`neurofinder.00.06`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.06.zip)
[`neurofinder.00.07`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.07.zip)
[`neurofinder.00.08`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.08.zip)
[`neurofinder.00.09`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.09.zip)
[`neurofinder.00.10`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.10.zip)
[`neurofinder.00.11`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.11.zip)
[`neurofinder.01.00`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.01.00.zip)
[`neurofinder.01.01`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.01.01.zip)
[`neurofinder.01.02`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.01.02.zip)
[`neurofinder.01.03`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.01.03.zip)
[`neurofinder.01.04`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.01.04.zip)
[`neurofinder.02.00`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.02.00.zip)
[`neurofinder.02.01`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.02.01.zip)
[`neurofinder.03.00`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.03.00.zip)

#### testing data

[`neurofinder.00.00.test`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.00.test.zip) 
[`neurofinder.00.01.test`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.00.01.test.zip)
[`neurofinder.01.00.test`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.01.00.test.zip) 
[`neurofinder.01.01.test`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.01.01.test.zip)
[`neurofinder.02.00.test`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.02.00.test.zip) 
[`neurofinder.02.01.test`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.02.01.test.zip)
[`neurofinder.03.00.test`](https://s3.amazonaws.com/neuro.datasets/challenges/neurofinder/neurofinder.03.00.test.zip) 

