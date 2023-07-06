import numpy as np
import pandas as pd
import yfinance as yf
from prophet import Prophet
from datetime import datetime
import plotly.graph_objects as go
import json

def getData(tick,metric):
    brk = yf.Ticker(tick)
    df = brk.history(period="max",auto_adjust=True)
    df = df.reset_index()
    df["Date"] = df["Date"].map(lambda x: x.date())
    df = df[["Date","Close"]]
    df.rename(columns={"Date":"ds","Close":"y"},inplace=True)
    
    return df
    


def getForecast(tick,metric,CPS,DFO,HPS,MFO,QFO,SM,SPS,WFO,YFO):
    
    df = getData(tick,metric)
    print(df.head(5))
    
    model = Prophet(growth="linear",changepoint_prior_scale=int(CPS),
                    seasonality_prior_scale=int(SPS),
                    seasonality_mode=SM,
                    holidays_prior_scale=int(HPS), 
                    daily_seasonality=False,
                    weekly_seasonality=False,
                    yearly_seasonality=False)

    model.add_seasonality(name='daily', period=1, fourier_order=int(DFO))
    model.add_seasonality(name='weekly', period=7, fourier_order=int(WFO))
    model.add_seasonality(name='monthly', period=30.5, fourier_order=int(MFO))
    model.add_seasonality(name='yearly', period=365.25, fourier_order=int(YFO))
    model.add_seasonality(name='quarterly', period=365.25/4, fourier_order=int(QFO), prior_scale= 15)

    model.add_country_holidays(country_name='US')  
    
    model.fit(df)
    fut = model.make_future_dataframe(periods=int(92))
    forecast = model.predict(fut)
    
    df['ds']=df['ds'].astype('datetime64[ns]')
    data = pd.merge(forecast,df,on='ds',how='left')
    
    data = data [['ds','y','yhat','yhat_upper','yhat_lower']]
    data["ds"]=data["ds"].map(lambda x: str(datetime.strptime(str(x),"%Y-%m-%d %H:%M:%S").date()))
    
    data.replace(np.nan, '', regex=True)
    data = data.to_json()
    
    return data
    
    
    
