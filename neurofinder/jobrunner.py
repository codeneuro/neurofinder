import time
import os
import json
import boto
from boto.s3.key import Key
from github import Github
from pymongo import MongoClient

from neurofinder import Job
from neurofinder.utils import printer


class JobRunner(object):
    """
    Class for managing pull reuquests to a repository, running jobs,
    and posting results to S3

    Parameters
    ----------
    db_name : str, optional, default = 'codeneurohackathon'
        Name of mongo database

    repo_name : str, optional, default = 'CodeNeuro/neurofinder'
        Name of github repository

    s3_name : str, optional, defult = 'code.neuro/neurofinder'
        Location to post results to on S3
    """
    def __init__(self,
                 db_name="codeneurohackathon",
                 repo_name="CodeNeuro/neurofinder",
                 s3_name='code.neuro/neurofinder',
                 dry=False):

        mongo_connect_url = os.environ['MONGO_CONNECT_URL']
        if not mongo_connect_url:
            raise Exception("Mongo connect environment variable not set")
        github_bot_username = os.environ['GITHUB_BOT_USERNAME']
        if not github_bot_username:
            raise Exception("Github bot username environment variable not set")
        github_bot_pass = os.environ['GITHUB_BOT_PASS']
        if not github_bot_pass:
            raise Exception("Github bot password environment variable not set")

        mongo = MongoClient(mongo_connect_url)
        self.db = getattr(mongo, db_name)

        gitbot = Github(github_bot_username, github_bot_pass)
        self.repo = gitbot.get_repo(repo_name)

        conn = boto.connect_s3()
        bucket_name, folder = s3_name.split('/')
        bucket = conn.get_bucket(bucket_name)
        self.bucket = bucket
        self.folder = folder

        self.dry = dry

        print("\nConnected to databases and repo, starting evaluation...\n")

    def reset(self):
        """
        Set a timestamp in the database
        """
        last_checked = self.db.job_records.find_one({"type": "global_last_checked_record"})

        if not last_checked:
            timestamp = int(time.time())
            new_last_checked = {"type": "global_last_checked_record", "timestamp": timestamp}
            self.db.job_records.insert(new_last_checked)

    def post(self, blob):
        """
        Send results as a JSON file to S3
        """
        printer.status("Sending results to S3")
        k = Key(self.bucket)
        k.key = self.folder + '/results.json'
        k.set_contents_from_string(json.dumps(blob))
        printer.success()

    def run(self, force=False, action=None):
        """
        Run a set of pull requests.

        Will loop over all pull requests and validate or execute them
        based on the sected action, and only run actions if the pull request
        has been updated since the last time it was checked

        Parameters
        ----------
        force : boolean, optional, default = False
            Force actions even if pull requests are not new

        action : str or list, optional, default="validate"
            Which action to perform on each pull request (options are "execute" and "validate")
        """
        if isinstance(action, basestring):
            action = [action]

        pull_requests = self.repo.get_pulls()

        results = []

        for pull_req in pull_requests:

            job = Job(pull_req, self.db.pull_requests, dry=self.dry)
            job.ismergeable()
            job.isentry()

            if job.isrecent() or force:
                job.clear_status("validated")
                job.clear_status("executed")

            if "validate" in action and not job.check_status("validated"):
                job.validate()

            if "execute" in action and job.check_status("validated") and not job.check_status("executed"):
                metrics, info = job.execute()
                summary = job.summarize()
                summary['metrics'] = metrics
                summary['algorithm'] = info['algorithm']
                summary['description'] = info['description']
                summary['timestamp'] = int(time.mktime(time.gmtime()))
                results.append(summary)

            job.update_last_checked()
            
        if not self.dry:
            self.post(results)
        else:
            import pprint
            pp = pprint.PrettyPrinter(indent=4)
            pp.pprint(results)


if __name__ == '__main__':
    runner = JobRunner(dry=True)
    runner.reset()
    runner.run(True, ["validate", "execute"])