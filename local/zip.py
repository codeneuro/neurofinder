# /usr/bin/pyhon

name = sys.argv[1]

print('downloading data\n')
os.system('s4cmd.py get -r s3://neuro.datasets/challenges/neurofinder/%s' % name)

print('packaging data')
os.system('cp neurofinder/local/README.md %s/' % name)
os.system('cp neurofinder/local/example.py %s/' % name)
os.system('cp neurofinder/local/example.m %s/' % name)
os.system('mv %s neurofinder.training.%s' % name)

print('creating zip')
os.system('zip -r neurofinder.training.%s.zip neurofinder.training.%s' % (name, name))

print('copying zip to s3')
os.system('s4cmd.py put neurofinder.training.%s.zip s3://neuro.datasets/challenges/neurofinder/%s/ ' % (name, name))