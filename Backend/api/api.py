from flask import Flask,request
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from apscheduler.schedulers.background import BackgroundScheduler
import redditbot
import stream
import json
import os
import forecast
    

# def create_app():
#     app = Flask(__name__)
    
#     return app

app = Flask(__name__)
CORS(app)
api = Api(app)

# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve(path):
#     if path != "" and os.path.exists(app.static_folder+'/'+path):
#         return send_from_directory(app.static_folder,path)
#     else:
#         return send_from_directory(app.static_folder,'index.html')
parser = reqparse.RequestParser()
parser.add_argument('ticker')
parser.add_argument('metric')
parser.add_argument('changePointPriorScale')
parser.add_argument('holidaysPriorScale')
parser.add_argument('seasonalityMode')
parser.add_argument('seasonalityPriorScale')
parser.add_argument('dailySeasonalityFourierOrder')
parser.add_argument('weeklySeasonalityFourierOrder')
parser.add_argument('monthlySeasonalityFourierOrder')
parser.add_argument('yearlySeasonalityFourierOrder')
parser.add_argument('quaterlySeasonalityFourierOrder')



class watchlist(Resource):
    
    def get(self):
        # q = list(request.args.to_dict().values())
        q=list(request.args.values())
        # q = list(q.values())
        # print(q[0].split(","))
        q=q[0].split(",")
        return redditbot.getWatchlistSubmissions(q)
        # return "hello"

class topSubs(Resource):
    
    def get(self,time):
        # subs=json.dumps(redditbot.getSubmissionAllSubs(time))
        subs=redditbot.getSubmissionAllSubs(time)
        print(subs)
        return subs
    
class accnts(Resource):
    
    def put(self):
        
        data = request.json
        print(data)
        if(data['option']==1):
            redditbot.addAccnts(data['accnt'])
        else:
            redditbot.removeAccnt(data['accnt'])
        print(redditbot.accnts)

class predict(Resource):
    def post(self):
        args = parser.parse_args()
        tick = args['ticker']
        metric = args['metric']
        CPS = args['changePointPriorScale']
        DFO = args['dailySeasonalityFourierOrder']
        HPS = args['holidaysPriorScale']
        MFO = args['monthlySeasonalityFourierOrder']
        QFO = args['quaterlySeasonalityFourierOrder']
        SM  = args['seasonalityMode']
        SPS = args['seasonalityPriorScale']
        WFO = args['weeklySeasonalityFourierOrder']
        YFO = args['yearlySeasonalityFourierOrder']
        # data=forecast.getForecast(q)
        print(tick,metric,CPS,DFO,HPS,MFO,QFO,SM,SPS,WFO,YFO)
        return forecast.getForecast(tick,metric,CPS,DFO,HPS,MFO,QFO,SM,SPS,WFO,YFO)
        
        # return data
        
    
# changePointPriorScale
# dailySeasonalityFourierOrder
# holidaysPriorScale
# monthlySeasonalityFourierOrder
# quaterlySeasonalityFourierOrder
# seasonalityMode
# seasonalityPriorScale
# weeklySeasonalityFourierOrder
# yearlySeasonalityFourierOrder

# @app.route('/health')
# def health_check():
    # print(redditbot.getAccnts())
    # return 'App is running.'
    
api.add_resource(watchlist,'/watchlist')
api.add_resource(topSubs,'/topsubs/<string:time>')
api.add_resource(accnts,'/accnt')
api.add_resource(predict,'/forecast')

if __name__ == '__main__':
    app.run()
    # stream.startStream()
    
    # Serve the React app's static files
    
    
    # scheduler = BackgroundScheduler(daemon=True)
    # scheduler.add_job(stream.streamTickers, 'interval', minutes=60,replace_existing=True,id="streamer")
    # scheduler.shutdown()
    # scheduler.start()
    # print(scheduler.get_jobs())
    # scheduler.remove_job('streamer')
    # scheduler.shutdown()