from apscheduler.schedulers.background import BackgroundScheduler

from datetime import datetime
from datetime import timedelta
import json
import os
import csv
from redditbot import reddit, subreddit_name, tickers, rankings, getAccnts
import logging
logging.basicConfig(filename='sample.log' , format='%(asctime)s | %(levelname)s: %(message)s', level=logging.NOTSET)


sched = BackgroundScheduler()


def startStream():
    sched = BackgroundScheduler()
    sched.add_job(streamTickers,'interval',id='stream_tickers', minutes=45, replace_existing=True)
    sched.start()
    logging.debug('Stream Started')
    
    

def streamTickers():
    all_stocks = []
    stock_prices = {}
    logging.debug('Stream is running')
    
    next=(datetime.now()+timedelta(minutes=45)).replace(second=0, microsecond=0)

    
    for comment in reddit.subreddit(subreddit_name).stream.comments():
        logging.debug('-----Here--------0')
        if((datetime.now().replace(second=0, microsecond=0))==next):
            all_stocks.clear()
            rankings.clear()
            stock_prices.clear()
            next=((datetime.now()+timedelta(minutes=45)).replace(second=0, microsecond=0))

        
        if len(set(comment.body.split()).intersection(set(tickers))):
            logging.debug('-----Here--------1')
            ticker = list(set(comment.body.split()).intersection(set(tickers)))[0]
            print(ticker)
            print(rankings)
            if len(ticker) > 6 or len(ticker) ==0:
                continue
            
            if ticker not in all_stocks:
                all_stocks.append(ticker)
                rankings[ticker] = 1
            
            elif ticker in all_stocks:
                rankings[ticker] += 1

            print(rankings)
            if(rankings[ticker]>=1):
                accnts = getAccnts()
                # print("here2")
                logging.debug('-----Here--------2')
                try:
                    print(accnts)
                    # yield no_dollar+","+str(stock_prices[no_dollar])
                    for accnt in accnts:
                        print(accnt)
                        sub=ticker+" mentioned a lot"
                        msg="occured "+str(rankings[ticker])+" times"
                        reddit.redditor(accnt).message(subject=sub,message=msg)
                except:
                    continue

# streamTickers()