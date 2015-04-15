import pytest
from jobrunner.jobrunner import JobRunner, Job
from github.PullRequest import PullRequest


class TestJob(object):

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