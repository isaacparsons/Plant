import json
from NRGTest import NRGStreamApi
import matplotlib.pyplot as plt
from datetime import datetime
from testFunctions import getAlerts, getDispatches, createXAxis

nrgStreamApi = NRGStreamApi("uricatmp", "urica4nrg")

startDate = datetime(2021, 5, 16, 0)
endDate = datetime(2021, 5, 17, 0)

nrgStartDate = '05/16/2021'
nrgEndDate = '05/17/2021'

def addThreshold(value, threshold):
    if(value!=None):
        return value + threshold

def getNrgDataPoint(data, date):
    for d in data:
        if datetime.strptime(d[0], "%b %d %Y %H:%M") == date:
            if d[1]:
                return float(d[1])
            else:
                return None
        
def parseNrgDataPoints(data, xAxis):
    x = []
    y = []
    for date in xAxis:
        x.append(date)
        dp = getNrgDataPoint(data, date)
        y.append(dp)

    return [x,y]


with open('./data/alertconditions.json') as f:
  thresholdConditions = list(filter(lambda x: x["type"] == 'threshold', json.load(f)))

with open('./data/alerts.json') as f:
    a = json.load(f)

with open('./data/assetfollowers.json') as f:
    assetFollowers = json.load(f)
    
with open('./data/dispatchs.json') as f:
    dispatches = json.load(f)

with open('./data/assets.json') as f:
    assets = json.load(f)

xAxis=createXAxis(startDate, endDate)
# get alerts using alertConditionId
for thresholdCondition in thresholdConditions:
    # get asset follower -> assetId
    asset = filter(lambda x: x["_id"]["$oid"] == thresholdCondition["assetFollowerId"]["$oid"], assetFollowers)
    assetId = next(asset)["assetId"]
    # get assetId
    nrgId = next(filter(lambda x: x["assetId"] == assetId, assets))["nrgId"]
    d = nrgStreamApi.GetStreamDataByStreamId([nrgId], nrgStartDate, nrgEndDate, 'json', '') 
    nrgData = json.loads(d)["data"]
    # get dispatches for asset
    dispatchs = list(filter(lambda x: x["assetId"] == assetId,dispatches))

    # get alerts
    alerts = list(filter(lambda x: x["alertConditionId"]["$oid"] == thresholdCondition["_id"]["$oid"], a))

    [x1,y1] = parseNrgDataPoints(nrgData, xAxis)
    [x2,y2] = getDispatches(dispatchs, assetId, xAxis)

    upperThreshold = list(map(lambda x: addThreshold(x, thresholdCondition["value"]), y2))
    lowerThreshold = list(map(lambda x: addThreshold(x, -1*thresholdCondition["value"]), y2))
    [x3,y3] = getAlerts(alerts, assetId, xAxis)
    
    plt.figure()
    plt.plot(x1, y1)
    plt.plot(x2, y2)
    plt.plot(x2, upperThreshold)
    plt.plot(x2, lowerThreshold)
    plt.plot(x3, y3)

    plt.legend(["NRG", "Dispatches", "Upper Threshold", "Lower Threshold", "Alerts"], loc='upper right')
    plt.ylabel('Energy (MW)')
    plt.ylabel('Date')
    plt.show()  

    

