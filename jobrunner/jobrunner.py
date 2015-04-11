from github import Github
import pymongo
from pymongo import MongoClient
import boto
import time


def run_job():
    print "Connecting to MongoDB at MongoLab as user 'codeneurobot'"
    mongo_client = MongoClient('mongodb://codeneurobot:synapsevectorodyssey2001@ds061711.mongolab.com:61711/codeneurohackathon')
    print mongo_client
    codeneurohackathon = mongo_client.codeneurohackathon
    last_checked = codeneurohackathon.job_records.find_one({"type": "global_last_checked_record"})
    after = None
    if not last_checked:
        timestamp = int(time.time())
        new_last_checked = {"type": "global_last_checked_record", "timestamp": timestamp}
        codeneurohackathon.job_records.insert(new_last_checked)
        last_checked = codeneurohackathon.job_records.find_one({"type": "global_last_checked_record"})
    print "Last checked is now:"
    print last_checked
    print "Connecting to Github as user 'codeneurobot'"
    gitbot = Github("codeneurobot", "synapsevectorodyssey2001")
    neurofinder = gitbot.get_repo('CodeNeuro/neurofinder')
    new_pull_requests = []
    repo_pull_requests = neurofinder.get_pulls()
    print "Pull requests:", repo_pull_requests

    for pull_req in repo_pull_requests:
        codeneurohackathon.pull_requests.insert(pull_req)


if __name__ == '__main__':
    print "Running job"
    run_job()