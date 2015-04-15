from jobrunner.jobrunner import JobRunner
from pymongo.database import Database
from github.Repository import Repository


class TestJobRunner(object):

    def test_default(self):
        job = JobRunner()
        assert(isinstance(job, JobRunner))
        assert(isinstance(job.db, Database))
        assert(isinstance(job.repo, Repository))

    def test_args(self):
        job = JobRunner(dbname="codeneurohackathon", repo_name="CodeNeuro/neurofinder")
        assert(isinstance(job, JobRunner))
        assert(isinstance(job.db, Database))
        assert(isinstance(job.repo, Repository))
