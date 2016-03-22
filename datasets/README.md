# datasets

This README describes the datasets for the [NeuroFinder](http://neurofinder.codeneuro.org) analysis benchmarking system. 

Training datasets are provided with ground truth neurons, and testing datasets are provided without ground truth. Each downloadable dataset includes metadata (as `.json`), images (as `.bin`), and coordinates of identified neuronal sources aka ROIs (as `.json`). Datasets are around 1 GB zipped and a few GBs unzipped. Browse the [list](https://github.com/codeneuro/neurofinder/blob/master/datasets.md) of datasets on GitHub for download links.

Along with the data itself, each download includes example loading scripts in `python` and `MATLAB`, the source code of which are in this [reposistory](https://github.com/codeneuro/neurofinder). 

To contribute example loading scripts for other languages, just submit a pull request! If there are problems with the loading scripts, submit an issue on GitHub.