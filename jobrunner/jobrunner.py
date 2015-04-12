from github import Github
import pymongo
from pymongo import MongoClient
import boto
import time
import os


def execute_job(job):
    #TODO: implement job processing on Spark cluster, assuming this runs locally on same machine(s) as cluster
    pass

def run_job():
    print "Connecting to MongoDB at MongoLab as user 'codeneurobot'"
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
    codeneurohackathon = mongo_client.codeneurohackathon
    last_checked = codeneurohackathon.job_records.find_one({"type": "global_last_checked_record"})
    after = None
    if not last_checked:
        timestamp = int(time.time())
        new_last_checked = {"type": "global_last_checked_record", "timestamp": timestamp}
        codeneurohackathon.job_records.insert(new_last_checked)
        last_checked = codeneurohackathon.job_records.find_one({"type": "global_last_checked_record"})
    print "Connecting to Github as user " + github_bot_username
    gitbot = Github(github_bot_username, github_bot_pass)
    neurofinder = gitbot.get_repo('CodeNeuro/neurofinder')
    new_pull_requests = []
    repo_pull_requests = neurofinder.get_pulls()

    for pull_req in repo_pull_requests:
        #only counting never-before seen pull reqs for now
        pull_req_in_db = codeneurohackathon.pull_requests.find_one({"id": pull_req.id})
        if not pull_req_in_db:
            if pull_req.mergeable:
                merged_status = pull_req.merge()
                if merged_status.merged:
                    #WARNING: this is untested as of April 11, 2015. It is a hackathon after all...
                    pull_req_obj = {"id": pull_req.id, "evaluated": True, "directory": ""}
                    new_pull_requests.append(pull_req_obj)
                    codeneurohackathon.pull_requests.insert(pull_req)

    #this is still synchronous, but may need to be async on the cluster
    for new_pull_req in new_pull_requests:
        #execute_job is only a stub right now. it should package a job from the code
        execute_job(new_pull_req)


if __name__ == '__main__':
    run_job()