# /usr/bin/pyhon

name = sys.argv[1]
os.system('s4cmd.py get -r s3://neuro.datasets/challenges/neurofinder/%s' % name)
os.system('cp README.md %s/' % name)
os.system('cp example.py %s/' % name)
os.system('cp example.m %s/' % name)
os.system('mv %s neurofinder.training.%s' % name)
os.system('zip -r neurofinder.training.%s.zip neurofinder.training.%s' % (name, name))
os.system('s4cmd.py put neurofinder.training.%s.zip s3://neuro.datasets/challenges/neurofinder/%s/ ' % (name, name))