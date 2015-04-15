import pytest
from jobrunner.jobrunner import JobRunner, Job
from pymongo.database import Database
from github.Repository import Repository
from github.PullRequest import PullRequest


class TestJobRunner:

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


class TestJob:

    @pytest.fixture
    def job(self):
        runner = JobRunner()
        return Job(runner.repo.get_pulls()[0], runner.db.pull_requests)

    def test_attributes(self, job):
        assert(isinstance(job, Job))
        assert(isinstance(job.pull_req, PullRequest))

    def test_properties(self, job):
        assert(isinstance(job.id, int))
        assert(isinstance(job.url, basestring))
        assert(isinstance(job.login, basestring))
