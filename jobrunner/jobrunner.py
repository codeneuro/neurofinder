from github import Github
from pymongo import MongoClient
import tempfile
import time
import subprocess
import os
import sys


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

            pr = PullRequest(pull_req, self.db.pull_requests)
            pr.ismergeable()
            pr.isentry()

            if pr.isrecent() or force:

                if "validate" in action:
                    print("Validating pull request %s from user %s" % (pr.id, pr.login))
                    pr.clear_status("validated")
                    pr.update_status("validated")
                if "execute" in action:
                    print("Executing pull request %s from user %s" % (pr.id, pr.login))
                    pr.clear_status("executed")
                    pr.update_status("executed")

            else:
                print("Skipping pull request %s from user %s" % (pr.id, pr.login))


class PullRequest(object):

    def __init__(self, pull_req, collection):
        self.pull_req = pull_req
        self.collection = collection

    @property
    def id(self):
        """
        Pull request id
        """
        return self.pull_req.id

    @property
    def login(self):
        """
        Pull request user login
        """
        return self.pull_req.user.login

    @property
    def url(self):
        """
        Pull request repo url for cloning
        """
        return self.pull_req.head.repo.clone_url

    def ismergeable(self):
        """
        Check if the pull request is mergeable and post a comment if not
        """
        if not self.pull_req.mergeable:
            self.pull_req.create_issue_comment("Cannot be merged, validation failed")

    def isrecent(self):
        """
        Check if the pull request has been updated since it was last checked
        """
        entry = self.collection.find_one({"id": self.id})
        t0 = entry['last_checked']
        t = self.pull_req.updated_at.utctimetuple()
        updated_at = int(time.mktime(t))
        if t0 < updated_at:
            return True
        else:
            return False

    def isentry(self):
        """
        Check if the pull request is in the collection, otherwise add it
        """
        entry = self.collection.find_one({"id": self.id})
        if not entry:
            print("Adding entry for pull request %s from user %s" % (self.id, self.login))
            payload = {'id': self.id, 'login': self.login, 'validated': False, 'executed': False,
                       'last_checked': 0, 'validated_at': 0, 'executed_at': 0}
            self.collection.insert_one(payload)

    def clear_status(self, status):
        """
        Set status to false for this pull request in the collection
        """
        self.collection.update_one({'id': self.id}, {'$set': {status: False}})

    def check_status(self, status):
        """
        Check status for this pull request in the collection
        """
        entry = self.collection.find_one({"id": self.id})
        return entry[status]

    def update_status(self, status):
        """
        Run appropriate action for this status and update the collection
        """
        check = self.check_status(status)

        ACTIONS = {
            "executed": self.execute,
            "validated": self.validate
        }

        if not check:
            func = ACTIONS[status]
            result, msg = func()

            timestamp = int(time.mktime(time.gmtime()))
            self.collection.update_one({"id": self.id}, {"$set": {"last_checked": timestamp}})

            if result:

                self.collection.update_one({"id": self.id}, {"$set": {status: True}})
                self.collection.update_one({"id": self.id}, {"$set": {status + "_at": timestamp}})

            # pull_req.create_issue_comment(msg)
            print("Sending msg to github: %s" % msg)

        else:
            print("Already %s pull request %s from user %s" % (status, self.id, self.login))

    def execute(self):
        d = tempfile.mkdtemp()

        subprocess.call(["git", "clone", self.url, d])
        sys.path.append(d)

        spark = os.getenv('SPARK_HOME')
        if spark is None or spark == '':
            raise Exception('must assign the environmental variable SPARK_HOME with the location of Spark')
        sys.path.append(os.path.join(spark, 'python'))
        sys.path.append(os.path.join(spark, 'python/lib/py4j-0.8.2.1-src.zip'))

        executed = False
        errors = ""

        from thunder import ThunderContext
        tsc = ThunderContext.start(master="local", appName="neurofinder")
        data = tsc.loadExample('mouse-images')

        if executed:
            msg = "Executed successful"
        else:
            msg = "Execution failed"

        return executed, msg

    def validate(self):
        d = tempfile.mkdtemp()

        subprocess.call(["git", "clone", self.url, d])

        base = d + '/submissions/%s/' % self.login

        validated = True
        errors = ""

        if not os.path.isdir(base):
            validated = False
            errors += "Missing directory submissions/%s\n" % self.login
        if not os.path.isfile(base + 'info.json'):
            validated = False
            errors += "Missing info.json\n"
        if not os.path.isfile(base + 'run.py'):
            validated = False
            errors += "Missing run.py\n"

        if validated:
            msg = "Validation successful"
        else:
            msg = "Validation failed:\n" + errors

        return validated, msg

if __name__ == '__main__':
    job = JobRunner()
    job.reset()
    job.run(True, ["validate", "execute"])