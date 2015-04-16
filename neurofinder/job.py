import tempfile
import time
import subprocess
import os
import sys
import json
import importlib


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

    @property
    def branch(self):
        """
        Pull request branch name
        """
        return self.pull_req.head.ref

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
        Update the status for this job as successful
        """
        timestamp = int(time.mktime(time.gmtime()))
        self.collection.update_one({"id": self.id}, {"$set": {status: True}})
        self.collection.update_one({"id": self.id}, {"$set": {status + "_at": timestamp}})

    def send_message(self, msg):
        """
        Send a message to the github comment
        """
        #self.pull_req.create_issue_comment(msg)
        print("Sending msg to github: %s" % msg)

    def update_last_checked(self):
        """
        Update the time this pull request was last checked
        """
        timestamp = int(time.mktime(time.gmtime()))
        self.collection.update_one({"id": self.id}, {"$set": {"last_checked": timestamp}})

    def summarize(self):
        """
        Summarize the submission by parsing various fields
        """
        timestamp = int(time.mktime(time.gmtime()))

        d = dict()
        d['login'] = self.login
        d['source_url'] = self.url
        d['pull_request'] = self.pull_req.html_url
        d['avatar'] = self.pull_req.user.avatar_url
        d['email'] = self.pull_req.user.email
        d['timestamp'] = timestamp

        return d

    def clone(self):
        """
        Clone the repository given for this pull request
        """
        d = tempfile.mkdtemp()

        subprocess.call(["git", "clone", self.url, d])
        os.chdir(d)
        subprocess.call(["git", "checkout", "-b", self.branch, "origin/%s" % self.branch])

        base = d + '/submissions/%s/' % self.login
        module = base + 'run/'

        return base, module

    def execute(self):
        """
        Execute this pull request
        """
        print("Executing pull request %s from user %s" % (self.id, self.login))

        base, module = self.clone()

        f = open(base + 'info.json', 'r')
        info = json.loads(f.read())

        sys.path.append(module)
        run = importlib.import_module('run')

        spark = os.getenv('SPARK_HOME')
        if spark is None or spark == '':
            raise Exception('must assign the environmental variable SPARK_HOME with the location of Spark')
        sys.path.append(os.path.join(spark, 'python'))
        sys.path.append(os.path.join(spark, 'python/lib/py4j-0.8.2.1-src.zip'))

        from thunder import ThunderContext
        tsc = ThunderContext.start(master="local", appName="neurofinder")
        data, ts, truth = tsc.makeExample('sources', centers=10, noise=1.0, returnParams=True)

        try:
            sources = run.run(data)
            result = truth.similarity(sources)
            msg = "Execution successful"
            self.update_status("executed")
        except:
            result = None
            msg = "Execution failed"

        self.send_message(msg)

        return result, info

    def validate(self):
        """
        Validate this pull request
        """
        print("Validating pull request %s from user %s" % (self.id, self.login))

        base, module = self.clone()

        validated = True
        errors = ""

        if not os.path.isdir(base):
            validated = False
            errors += "Missing directory submissions/%s\n" % self.login
        if not os.path.isfile(base + 'info.json'):
            validated = False
            errors += "Missing info.json\n"
        else:
            try:
                f = open(base + 'info.json', 'r')
                json.loads(f.read())
            except:
                validated = False
                errors += "Cannot read info.json file\n"
        if not os.path.isfile(module + 'run.py'):
            validated = False
            errors += "Missing run.py\n"
        if not os.path.isfile(module + '__init__.py'):
            validated = False
            errors += "Missing __init__.py\n"
        else:
            try:
                sys.path.append(module)
                importlib.import_module('run')
            except:
                validated = False
                errors += "Cannot import run from run.py"

        if validated:
            msg = "Validation successful"
            self.update_status("validated")
        else:
            msg = "Validation failed:\n" + errors

        self.send_message(msg)