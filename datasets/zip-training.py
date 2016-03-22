# /usr/bin/pyhon

import sys
import os

name = sys.argv[1]

print('downloading data\n')
os.system('s4cmd.py get -r s3://neuro.datasets/challenges/neurofinder/%s' % name)

print('packaging data\n\n')
os.system('cp neurofinder/datasets/README.md %s/' % name)
os.system('cp neurofinder/datasets/example.py %s/' % name)
os.system('cp neurofinder/datasets/example.m %s/' % name)
os.system('mv %s neurofinder.%s' % (name, name))

print('creating zip\n\n')
os.system('zip -r neurofinder.%s.zip neurofinder.%s' % (name, name))

print('copying zip to s3\n\n')
os.system('s4cmd.py put -f neurofinder.%s.zip s3://neuro.datasets/challenges/neurofinder/ ' % name)