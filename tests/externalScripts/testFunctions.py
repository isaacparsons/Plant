from datetime import datetime, timedelta
import json
import csv

def csvToJson(csvFileName):
    data = []
    with open(csvFileName, newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',')
        header = True
        for row in spamreader:
            if header:
                header = False
            else:
                data.append({
                    "Dispatch Effective Date": row[1],
                    "Dispatch Effective Time": row[2],
                    "Asset": row[3],
                    "Energy":  row[5]
                })
    return data

def utcToMdt(date):
    hour_offset = timedelta(hours = 6)
    try:
        d = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
    except: 
        d = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ")
    
    return d - hour_offset

def getDispatch(dispatches, assetId, date):
    res = None
    dateInd = date
    pastDispatches = list(filter(lambda x: utcToMdt(x["date"]["$date"]) < dateInd and x["assetId"]  == assetId,dispatches))
    if(len(pastDispatches) > 0):
        res = max(pastDispatches, key = lambda x: utcToMdt(x["date"]["$date"]))
    return res

def getDispatches(dispatches, assetId, axis):
    x = []
    y = []
    for d in axis:
        x.append(d)
        dispatch = getDispatch(dispatches, assetId, d)
        if dispatch:
            y.append(dispatch["value"])
        else:
            y.append(dispatch)
    return [x,y]

def getAlert(alerts, assetId, date):
    for a in alerts:
        if utcToMdt(a["date"]["$date"]).replace(second=0, microsecond=0) == date and a["assetId"] == assetId:
            return 1

def getAlerts(alerts, assetId, axis):
    x = []
    y = []
    for d in axis:
        alert = getAlert(alerts, assetId, d)
        if(alert):
            x.append(d)
            x.append(d)
            y.append(0)
            y.append(300)
        else:
            x.append(d)
            y.append(0)

    return [x,y]

def createXAxis(startDate, endDate):
    xAxis = []
    interval = timedelta(minutes = 1)
    dateInd = startDate
    while dateInd < endDate:
        xAxis.append(dateInd)
        dateInd += interval

    return xAxis

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