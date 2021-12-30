import json
from NRGTest import NRGStreamApi
import matplotlib.pyplot as plt
from datetime import datetime
from testFunctions import  getAlerts, getDispatches, createXAxis

startDate = datetime(2021, 5, 15, 0)
endDate = datetime(2021, 5, 16, 0)

# get pre dispatch conditions
with open('./data/alertconditions.json') as f:
  preDispatchConditions = list(filter(lambda x: x["type"] == 'pre-dispatch', json.load(f)))

with open('./data/alerts.json') as f:
    a = json.load(f)

with open('./data/assetfollowers.json') as f:
    assetFollowers = json.load(f)
    
with open('./data/dispatchs.json') as f:
    dispatches = json.load(f)

with open('./data/assets.json') as f:
    assets = json.load(f)


for preDispatchCondition in preDispatchConditions:
    dispatchData=[]
    alertsData = []
    xAxis=createXAxis(startDate, endDate)
    # get asset follower -> assetId
    asset = filter(lambda x: x["_id"]["$oid"] == preDispatchCondition["assetFollowerId"]["$oid"], assetFollowers)
    assetId = next(asset)["assetId"]

    # get dispatches for asset
    dispatchs = list(filter(lambda x: x["assetId"] == assetId,dispatches))

    alerts = list(filter(lambda x: x["alertConditionId"]["$oid"] == preDispatchCondition["_id"]["$oid"], a))

    [x1, y1] = getAlerts(alerts, assetId, xAxis)
    [x2, y2] = getDispatches(dispatchs, assetId, xAxis)

    plt.figure()
    plt.plot(x1, y1)
    plt.plot(x2, y2)
    # plt.plot(xAxis, alertsData)
    plt.legend(["NRG", "Dispatches", "Upper Threshold", "Lower Threshold", "Alerts"], loc='upper right')
    plt.ylabel('Energy (MW)')
    plt.ylabel('Date')
    plt.show()  