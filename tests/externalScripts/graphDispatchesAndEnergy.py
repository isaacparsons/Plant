import json
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from testFunctions import getDispatches, createXAxis, csvToJson

# inputs: startDate, endDate
startDate = datetime(2021, 6, 16, 0)
endDate = datetime(2021, 6, 17, 0)

assetIds = ["SH1"]

def getAdamsDispatchDispatches(data, assetId, startDate, endDate):
    dispatches = []
    for d in data:
        d1 = d["Dispatch Effective Date"]+ " " + d["Dispatch Effective Time"]
        d2 = datetime.strptime(d1, "%Y-%m-%d %H:%M:%S").replace(second=0, microsecond=0)
        if(d["Asset"] == assetId and d2 > startDate and d2 < endDate):
            dispatches.append(d)

    return dispatches

dispatchHistory = csvToJson('./data/DispatchHistory.csv')
xAxis=createXAxis(startDate, endDate)

for assetId in assetIds:
    dispatches = getAdamsDispatchDispatches(dispatchHistory, assetId, startDate, endDate)
    
    
    # plt.plot(x1, y1)
    # plt.plot(x2, y2)
    # plt.legend(["Compliance Tool", "ADaMS"], loc='upper right')
    # plt.ylabel('Energy (MW)')
    # plt.ylabel('Date')
    plt.show()  
    
