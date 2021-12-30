import json
from datetime import datetime
from testFunctions import getDispatches, createXAxis, csvToJson

SH1_ID = 23563
SH2_ID = 23564

ASSET = "SH1"
TYPE = "threshold"


with open('./data/dispatchs.json') as f:
    dispatches = json.load(f)


dispatchHistory = csvToJson('./data/DispatchHistory.csv')

for i in dispatchHistory:
    if(i["Asset"] == ASSET):
        print(i)


