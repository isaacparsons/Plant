import json
from datetime import datetime
from testFunctions import  createXAxis, utcToMdt, getNrgDataPoint
from NRGTest import NRGStreamApi

SH1_ID = 23563
SH2_ID = 23564

NRG_START_DATE = "05/15/2021"
NRG_END_DATE = "05/16/2021"

NRG_ID = SH2_ID
ASSET = "SH2"
TYPE = "threshold"

nrgStreamApi = NRGStreamApi("uricatmp", "urica4nrg")

with open('./data/dispatchs.json') as f:
    dispatches = json.load(f)

with open('./data/checkalertlogs.json') as f:
    logs = json.load(f)

def getDispatchById(dispatches, id):
    d = list(filter(lambda x: x["_id"]["$oid"] == id, dispatches))
    if(len(d) > 0):
        return d[0]
    else:
        return None

dispatchs = list(filter(lambda x: x["assetId"] == ASSET, dispatches))
nrgData = json.loads(nrgStreamApi.GetStreamDataByStreamId([NRG_ID], NRG_START_DATE, NRG_END_DATE, 'json', ''))['data']
# go through each date 
for log in logs: 
    if(log["type"] == TYPE and log["assetId"] == ASSET):
        print("#############################")
        # get actual energy
        actualEnergy = log["energy"]["value"]
        date =utcToMdt(log["createdAt"]["$date"]).replace(second=0, microsecond=0)
        print("actual energy: " + str(actualEnergy))
        print("actual energy NRG: " + str(getNrgDataPoint(nrgData, date)))
        # get dispatch
        dispatch = getDispatchById(dispatches, log["dispatchId"]["$oid"])
        if dispatch:
            print("dispatch date: " + str(utcToMdt(dispatch["date"]["$date"])))
            print("dispatch value: " + str(dispatch["value"]))
            # get created date
            
            print("date: " + str(date))
            # get condition value
            conditionValue = log["conditionValue"]
            print("condition value: " + str(conditionValue))
            print("#############################")
            print("")
