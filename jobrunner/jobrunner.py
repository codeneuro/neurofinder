from github import Github
from pymongo import MongoClient
import tempfile
import time
import subprocess
import os
import sys


def validate_job(pull_req):

    login = pull_req.user.login
    d = tempfile.mkdtemp()
    url = pull_req.head.repo.clone_url

    subprocess.call(["git", "clone", url, d])

    base = d + '/submissions/%s/' % login

    validated = True
    errors = ""

    if not os.path.isdir(base):
        validated = False
        errors += "Missing directory submissions/%s\n" % login
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


def execute_job(pull_req):

    login = pull_req.user.login
    d = tempfile.mkdtemp()
    url = pull_req.head.repo.clone_url

    subprocess.call(["git", "clone", url, d])
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
    foo = data.values().first()

    if executed:
        msg = "Executed successful"
    else:
        msg = "Execution failed"

    return executed, msg


def check_pull_req(pull_req, db, field, func):

    id = pull_req.id
    login = pull_req.user.login
    entry = db.pull_requests.find_one({"id": id})

    if entry:
        state = entry[field]
        if not state:
            result, msg = func(pull_req)
            if result:
                timestamp = int(time.mktime(time.gmtime()))
                db.pull_requests.update_one({"id": id}, {"$set": {field: True}})
                db.pull_requests.update_one({"id": id}, {"$set": {field + "_at": timestamp}})
            # pull_req.create_issue_comment(msg)
            print("Sending msg to github: %s" % msg)
            timestamp = int(time.mktime(time.gmtime()))
            db.pull_requests.update_one({"id": id}, {"$set": {"last_checked": timestamp}})
        else:
            print("Already %s pull request %s from user %s" % (field, id, login))
    else:
        raise Exception("Cannot find entry in database")


def run_job():

    print("Connecting to MongoDB at MongoLab as user 'codeneurobot'")
    mongo_connect_url = os.environ['MONGO_CONNECT_URL']
    if not mongo_connect_url:
        raise Exception("Mongo connect environment variable not set")

    github_bot_username = os.environ['GITHUB_BOT_USERNAME']
    if not github_bot_username:
        raise Exception("Github bot username environment variable not set")

    github_bot_pass = os.environ['GITHUB_BOT_PASS']
    if not github_bot_pass:
        raise Exception("Github bot password environment variable not set")

    mongo_client = MongoClient(mongo_connect_url)
    db = mongo_client.codeneurohackathon
    last_checked = db.job_records.find_one({"type": "global_last_checked_record"})

    if not last_checked:
        timestamp = int(time.time())
        new_last_checked = {"type": "global_last_checked_record", "timestamp": timestamp}
        db.job_records.insert(new_last_checked)
        last_checked = db.job_records.find_one({"type": "global_last_checked_record"})

    print("Connecting to Github as user '" + github_bot_username + "'")
    gitbot = Github(github_bot_username, github_bot_pass)
    neurofinder = gitbot.get_repo('CodeNeuro/neurofinder')
    repo_pull_requests = neurofinder.get_pulls()

    force = True

    # loop over all pull requests and update database
    print("Updating database")
    for pull_req in repo_pull_requests:

        if not pull_req.mergeable:
            pull_req.create_issue_comment("Cannot be merged, validation failed")

        login = pull_req.user.login
        id = pull_req.id
        pull_req_in_db = db.pull_requests.find_one({"id": id})

        if pull_req_in_db:
            updated_at = int(time.mktime(pull_req.updated_at.utctimetuple()))
            repo_last_checked = pull_req_in_db['last_checked']

            if repo_last_checked < updated_at or force:

                print("Validating pull request %s from user %s" % (id, login))
                db.pull_requests.update_one({'id': id}, {'$set': {'validated': False}})
                check_pull_req(pull_req, db, "validated", validate_job)

                print("Executing pull request %s from user %s" % (id, login))
                db.pull_requests.update_one({'id': id}, {'$set': {'executed': False}})
                check_pull_req(pull_req, db, "executed", execute_job)

            else:
                print("Skipping pull request %s from user %s" % (id, login))

        else:
            print("Adding entry for pull request %s from user %s" % (id, login))
            payload = {'id': id, 'login': login, 'validated': False, 'executed': False,
                       'last_checked': 0, 'validated_at': 0, 'executed_at': 0}
            db.pull_requests.insert_one(payload)

if __name__ == '__main__':
    run_job()