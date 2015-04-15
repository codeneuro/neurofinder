import tempfile
import time
import subprocess
import os
import sys


class Job(object):
    """
    Class for representing a pull request to validate and execute

    Parameters
    ----------
    pull_req : github.PullRequest.PullRequest
        The pull request to evaluate

    collection : pymongo.collection.Collection
        A mongo collection for storing pull request status
    """
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