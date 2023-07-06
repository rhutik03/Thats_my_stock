from dotenv import load_dotenv
from dotenv import dotenv_values
from yahoo_finance import Share

from datetime import datetime
from datetime import timedelta
import json
import praw
import os
import csv
from pandas.core.common import flatten

load_dotenv()
# print(os.environ.get("REDDIT_USERNAME"))
# print(os.listdir())

file = open("tickers.csv", "r")
tickers = list(csv.reader(file, delimiter=","))
file.close()

tickers =list(flatten(tickers))
rankings = {}
accnts = ["STRANGE-111"]


# print(tickers)

reddit = praw.Reddit(
    client_id=os.environ.get("REDDIT_CLIENT_ID"),
    client_secret=os.environ.get("REDDIT_CLIENT_SECRET"),
    user_agent="trial",
    username=os.environ.get("REDDIT_USERNAME"),
    password=os.environ.get("REDDIT_PASS"),
    check_for_async=False
)

subreddit_name = "wallstreetbets+stocks+personalfinance+trading+stockmarket+investing+stocktrader+smallstreetbets+pennystocks+Wallstreetbetsnew+RichTogether"
subreddit = reddit.subreddit(subreddit_name)

def getAccnts():
    return accnts

def addAccnts(accnt):
    accnts.append(accnt)
    
def removeAccnt(accnt):
    accnts.remove(accnt)
    

def getSubmissionAllSubs(time_period="day"):
    res=[]
    top_posts = subreddit.top(time_filter=time_period, limit=5)
    top_posts=list(top_posts)
    for post in top_posts:
        if not any(d['Title'] == post.title for d in res):
            ob = {}
            ob['Permalink']="https://www.reddit.com"+reddit.submission(post.id).permalink
            ob["Title"]=post.title
            ob["Sub"]="r/"+str(post.subreddit)
            res.append(ob)
          
    return res

def getWatchlistSubmissions(tics,time_period="day",sortby="top",limit=10):
    
    res=[]
    for tic in tics:
        resp = subreddit.search(query=tic,sort=sortby, time_filter=time_period,limit=5)
        resp=[re for re in resp]
        resp.sort(key=lambda sub: sub.score, reverse=True)
        for submission in resp:
            # print(type(submission))
            ob = {}
            ob['Permalink']="https://www.reddit.com"+reddit.submission(submission.id).permalink
            ob["Title"]=submission.title
            ob["Sub"]="r/"+str(submission.subreddit)
            res.append(ob)

        
    return res
        
    
# print(getSubmissionAllSubs("day"))
# print(getWatchlistSubmissions("day","day","day"))
# streamTickers()
# for accnt in accnts:
    # print(accnt)
    # reddit.redditor(accnt).message(subject=("GME"+" mentioned a lot"),message=str(56.87))    