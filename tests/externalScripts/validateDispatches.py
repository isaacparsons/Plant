import json
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from testFunctions import getDispatches, createXAxis, csvToJson

# inputs: startDate, endDate
startDate = datetime(2021, 5, 15, 0)
endDate = datetime(2021, 5, 16, 0)

def getAdamsDispatchDataPoint(data, assetId, date):
    for d in data:
        t = timedelta(hours=6)
        d1 = d["Dispatch Effective Date"]+ " " + d["Dispatch Effective Time"]
        d2 = datetime.strptime(d1, "%Y-%m-%d %H:%M:%S").replace(second=0, microsecond=0)
        if(d["Asset"] == assetId and d2 == date):
            return d

def parseAdamsDispatchData(data, assetId, xAxis):
    currentDispatch = None
    x=[]
    y=[]
    for date in xAxis:
        x.append(date)
        dp = getAdamsDispatchDataPoint(data, assetId, date)
        if not dp == None:
            currentDispatch = float(dp["Energy"])
        y.append(currentDispatch)
    return [x,y]

with open('./data/dispatchs.json') as f:
    dispatches = json.load(f)

with open('./data/assetfollowers.json') as f:
    assetFollowers = json.load(f)

dispatchHistory = csvToJson('./data/DispatchHistory.csv')

assetIds = []
for assetFollower in assetFollowers:
    assetIds.append(assetFollower["assetId"])

xAxis=createXAxis(startDate, endDate)
for assetId in assetIds:
    dispatchs = list(filter(lambda x: x["assetId"] == assetId, dispatches))
    [x1,y1] = getDispatches(dispatchs, assetId, xAxis)
    # parse adams account data
    [x2,y2] = parseAdamsDispatchData(dispatchHistory, assetId, xAxis)
    plt.plot(x1, y1)
    plt.plot(x2, y2)
    plt.legend(["Compliance Tool", "ADaMS"], loc='upper right')    
    # plt.ylabel('Energy (MW)')
    # plt.ylabel('Date')
    plt.show()  
    
