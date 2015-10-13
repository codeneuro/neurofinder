# example python script for loading neurofinder data
#
# for more info see:
# - http://neurofinder.codeneuro.org
# - https://github.com/codeneuro/neurofinder

import json
import matplotlib.pyplot as plt
from numpy import array, zeros, frombuffer
from glob import glob

# load the images
with open('images/conf.json') as f:
    dims = json.load(f)['dims']

files = glob('images/*/*.bin')
def toarray(f):
    with open(f) as fid:
        return frombuffer(fid.read(),'uint16').reshape(dims, order='F')

imgs = array([toarray(f) for f in files])

# load the sources
with open('sources/sources.json') as f:
    sources = json.load(f)

def tomask(coords):
    mask = zeros(dims)
    mask[zip(*coords)] = 1
    return mask

masks = array([tomask(s['coordinates']) for s in sources])

# show the outputs
plt.figure()
plt.subplot(1, 2, 1)
plt.imshow(imgs.sum(axis=0))
plt.subplot(1, 2, 2)
plt.imshow(masks.sum(axis=0))
plt.show()