from github import Github
from pymongo import MongoClient
import time
import os
from neurofinder import Job


class JobRunner(object):
    """
    Class for managing pull reuquests to a repository and running jobs

    Parameters
    ----------
    dbname : str, optional, default = 'codeneurohackathon'
        Name of mongo database

    repo_name : str, optional, default = 'CodeNeuro/neurofiner'
        Name of github repository
    """
    def __init__(self, dbname="codeneurohackathon", repo_name="CodeNeuro/neurofinder"):
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
        self.db = getattr(mongo, dbname)

        print("Connecting to Github as user '" + github_bot_username + "'")
        gitbot = Github(github_bot_username, github_bot_pass)
        self.repo = gitbot.get_repo(repo_name)

    def reset(self):
        """
        Set a timestamp in the database
        """
        last_checked = self.db.job_records.find_one({"type": "global_last_checked_record"})

        if not last_checked:
            timestamp = int(time.time())
            new_last_checked = {"type": "global_last_checked_record", "timestamp": timestamp}
            self.db.job_records.insert(new_last_checked)

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

        for pull_req in pull_requests:

            job = Job(pull_req, self.db.pull_requests)
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

                print(summary)

            job.update_last_checked()

if __name__ == '__main__':
    runner = JobRunner()
    runner.reset()
    runner.run(True, ["validate", "execute"])