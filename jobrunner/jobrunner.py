from github import Github
from pymongo import MongoClient
import boto
import time
import os


def validate_job(pull_req):

    # clone from the pull request
    # pull_req.head.repo.clone_url

    # check for a directory ("/submissions/username/")
    # check for a info.json file
    # check for a run.py file
    # if any of this fails, return False, otherwise return True

    # clean up

    return False


def execute_job(pull_req):

    # clone from the pull request
    # pull_req.head.repo.clone_url

    # cd into the cloned directory
    # execute the run.py for each test data set, return results

    # dump collected results to a JSON file
    # clean up

    return False


def check_pull_req(pull_req, db, field, func, success_msg, failure_msg):

    id = pull_req.id
    login = pull_req.user.login
    entry = db.pull_requests.find_one({"id": id})

    if entry:
        state = entry[field]
        if not state:
            result = func(pull_req)
            if result:
                timestamp = int(time.mktime(time.gmtime()))
                db.pull_requests.update_one({"id": id}, {"$set": {field: True}})
                db.pull_requests.update_one({"id": id}, {"$set": {field + "_at": timestamp}})
                # pull_req.create_issue_comment(success_msg)
                print("Sending msg to github: %s" % success_msg)
            else:
                # pull_req.create_issue_comment(failure_msg)
                print("Sending msg to github: %s" % failure_msg)
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

    # TODO: check for duplicates

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

            if repo_last_checked < updated_at:

                print("Validating pull request %s from user %s" % (id, login))
                db.pull_requests.update_one({'id': id}, {'$set': {'validated': False}})
                check_pull_req(pull_req, db, "validated", validate_job,
                               "Validation succeeded", "Validation failed")

                print("Executing pull request %s from user %s" % (id, login))
                db.pull_requests.update_one({'id': id}, {'$set': {'executed': False}})
                check_pull_req(pull_req, db, "executed", execute_job,
                               "Execution succeeded", "Execution failed")

            else:
                print("Skipping pull request %s from user %s" % (id, login))

        else:
            print("Adding entry for pull request %s from user %s" % (id, login))
            payload = {'id': id, 'login': login, 'validated': False, 'executed': False,
                       'last_checked': 0, 'validated_at': 0, 'executed_at': 0}
            db.pull_requests.insert_one(payload)

if __name__ == '__main__':
    run_job()