import http.client
import json
import time
import csv
from datetime import datetime
from datetime import timedelta
import re


class NRGStreamApi:    
    
    def __init__(self,username=None,password=None):
        self.username = username
        self.password = password
        self.server = 'api.nrgstream.com'        
        self.tokenPath = '/api/security/token'
        self.releasePath = '/api/ReleaseToken'
        self.tokenPayload = f'grant_type=password&username={self.username}&password={self.password}'
        self.tokenExpiry = datetime.now() - timedelta(seconds=60)
        self.accessToken = ""        
        
    def getToken(self):
        try:
            if self.isTokenValid() == False:                             
                headers = { }        
                # Connect to API server to get a token
                conn = http.client.HTTPSConnection(self.server)
                conn.request('POST', self.tokenPath, self.tokenPayload, headers)
                res = conn.getresponse()                
                res_code = res.code
                # Check if the response is good
                
                if res_code == 200:
                    res_data = res.read()
                    # Decode the token into an object
                    jsonData = json.loads(res_data.decode('utf-8'))
                    self.accessToken = jsonData['access_token']                         
                    # Calculate new expiry date
                    self.tokenExpiry = datetime.now() + timedelta(seconds=jsonData['expires_in'])                        
                    #print('token obtained')
                    #print(self.accessToken)
                else:
                    res_data = res.read()
                    print(res_data.decode('utf-8'))
                conn.close()                          
        except Exception as e:
            print("getToken: " + str(e))
            # Release token if an error occured
            self.releaseToken()      

    def releaseToken(self):
        try:            
            headers = {}
            headers['Authorization'] = f'Bearer {self.accessToken}'            
            conn = http.client.HTTPSConnection(self.server)
            conn.request('DELETE', self.releasePath, None, headers)  
            res = conn.getresponse()
            res_code = res.code
            if res_code == 200:   
                # Set expiration date back to guarantee isTokenValid() returns false                
                self.tokenExpiry = datetime.now() - timedelta(seconds=60)
                #print('token released')            
        except Exception as e:
            print("releaseToken: " + str(e))
                    
    def isTokenValid(self):
        if self.tokenExpiry==None:
            return False
        elif datetime.now() >= self.tokenExpiry:            
            return False
        else:
            return True            
    
    def GetStreamDataByStreamId(self,streamIds, fromDate, toDate, dataFormat='csv', dataOption=''):
        stream_data = "" 
        # Set file format to csv or json            
        DataFormats = {}
        DataFormats['csv'] = 'text/csv'
        DataFormats['json'] = 'Application/json'
        
        try:                            
            for streamId in streamIds:            
                # Get an access token            
                self.getToken()    
                if self.isTokenValid():
                    # Setup the path for data request. Pass dates in via function call
                    path = f'/api/StreamData/{streamId}'
                    if fromDate != '' and toDate != '':
                        path += f'?fromDate={fromDate.replace(" ", "%20")}&toDate={toDate.replace(" ", "%20")}'
                    if dataOption != '':
                        if fromDate != '' and toDate != '':
                            path += f'&dataOption={dataOption}'        
                        else:
                            path += f'?dataOption={dataOption}'        
                    
                    # Create request header
                    headers = {}            
                    headers['Accept'] = DataFormats[dataFormat]
                    headers['Authorization']= f'Bearer {self.accessToken}'
                    
                    # Connect to API server
                    conn = http.client.HTTPSConnection(self.server)
                    conn.request('GET', path, None, headers)
                    res = conn.getresponse()        
                    res_code = res.code                    
                    if res_code == 200:   
                        try:
                            print(f'{datetime.now()} Outputing stream {path} res code {res_code}')
                            # output return data to a text file            
                            if dataFormat == 'csv':
                                stream_data += res.read().decode('utf-8').replace('\r\n','\n') 
                            elif dataFormat == 'json':
                                stream_data += json.dumps(json.loads(res.read().decode('utf-8')), indent=2, sort_keys=False)
                            conn.close()

                        except Exception as e:
                            print(str(e))            
                            self.releaseToken()
                            return None  
                    else:
                        print(str(res_code) + " - " + str(res.reason) + " - " + str(res.read().decode('utf-8')))
                    
                self.releaseToken()   
                # Wait 1 second before next request
                time.sleep(1)
            return stream_data        
        except Exception as e:
            print(str(e))    
            self.releaseToken()
            return None
        
    def GetStreamDataByFolderId(self,folderId, fromDate, toDate, dataFormat='csv'):
        try:        
            # Get an access token            
            self.getToken()    
            if self.isTokenValid():                 
                # Setup the path for data request.
                path = f'/api/StreamDataUrl?folderId={folderId}' # folderId is 
                        
                # Create request header
                headers = {}
                headers['Accept'] = 'text/csv'
                headers['Authorization'] = f'Bearer {self.accessToken}'
                # Connect to API server
                conn = http.client.HTTPSConnection(self.server)
                conn.request('GET', path, None, headers)
                res = conn.getresponse()                
                self.releaseToken()    
                # Process data returned from request to obtain Stream Ids of the folder constituents
                streamUrls=(res.read().decode('utf-8'))
                streamLines=streamUrls.split("\n")        
                streamIds = []
                for streamLine in streamLines[6:]:
                    # Process the rest of the streamLines        
                    streamId = streamLine.split(',')[0]
                    if streamId != '':
                        streamIds.append(int(streamId))
                        
                # Get data for individual streams                      
                self.GetStreamDataByStreamId(streamIds, fromDate, toDate, dataFormat)
                                
        except Exception as e:
            print(str(e))    
            self.releaseToken()
            return None        
    
    def StreamDataOptions(self, streamId, dataFormat='csv'):
        try:      
            DataFormats = {}
            DataFormats['csv'] = 'text/csv'
            DataFormats['json'] = 'Application/json'
            resultSet = {}
            for streamId in streamIds:
                # Get an access token    
                if streamId not in resultSet:
                    self.getToken()                        
                    if self.isTokenValid():                 
                        # Setup the path for data request.
                        path = f'/api/StreamDataOptions/{streamId}'                        
                        # Create request header
                        headers = {}     
                        headers['Accept'] = DataFormats[dataFormat]                                   
                        headers['Authorization'] = f'Bearer {self.accessToken}'
                        # Connect to API server
                        conn = http.client.HTTPSConnection(self.server)
                        conn.request('GET', path, None, headers)
                        res = conn.getresponse()
                        self.releaseToken()       
                        if dataFormat == 'csv':
                            resultSet[streamId] = res.read().decode('utf-8').replace('\r\n','\n') 
                        elif dataFormat == 'json':
                            resultSet[streamId] = json.dumps(json.loads(res.read().decode('utf-8')), indent=2, sort_keys=False)                            
                    time.sleep(1)                        
            return resultSet            
        except Exception as e:
            print(str(e))    
            self.releaseToken()
            return None 
    
    def ListGroupExtracts(self, dataFormat='csv'):
        try:        
            DataFormats = {}
            DataFormats['csv'] = 'text/csv'
            DataFormats['json'] = 'Application/json'
            # Get an access token            
            self.getToken()    
            if self.isTokenValid():                   
                # Setup the path for data request.
                path = f'/api/ListGroupExtracts'                
                
                # Create request header
                headers = {}   
                headers['Accept'] = DataFormats[dataFormat]                    
                headers['Authorization'] = f'Bearer {self.accessToken}'                
                # Connect to API server                
                conn = http.client.HTTPSConnection(self.server)                
                conn.request('GET', path, None, headers)
                
                res = conn.getresponse()                
                if dataFormat == 'csv':
                    groupExtractsList = res.read().decode('utf-8').replace('\r\n','\n') 
                elif dataFormat == 'json':
                    groupExtractsList = json.dumps(json.loads(res.read().decode('utf-8')), indent=2, sort_keys=False)
                self.releaseToken()                
                
                return groupExtractsList
        except Exception as e:
            print("ListGroupExtracts: " + str(e))    
            self.releaseToken()
            return None          
        
    def GetGroupExtractHeader(self, filePrefix):        
        try:                    
            # Get an access token                
            self.getToken()                
            if self.isTokenValid():                 
                # Setup the path for data request.
                path = f'/api/GroupExtractHeader/{filePrefix}'                        
                # Create request header
                headers = {}                                
                headers['Authorization'] = f'Bearer {self.accessToken}'
                # Connect to API server
                conn = http.client.HTTPSConnection(self.server)
                conn.request('GET', path, None, headers)
                res = conn.getresponse()                
                self.releaseToken()                  
                groupExtractHeader = (res.read().decode('utf-8'))    
                return groupExtractHeader                            
        except Exception as e:
            print(str(e))    
            self.releaseToken()
            return None    
        
    def GetGroupExtract(self, filePrefix, fileDate):                
        try:                    
            # Get an access token                        
            self.getToken()    
            return_data = []
            return_data.append(datetime.now())
            if self.isTokenValid():   
                
                # Setup the path for data request.
                path = f'/api/GroupExtract/{filePrefix}?fileDate={fileDate}'                        
                # Create request header
                headers = {}                
                headers['Authorization'] = f'Bearer {self.accessToken}'
                # Connect to API server
                print(path)
                conn = http.client.HTTPSConnection(self.server)
                conn.request('POST', path, None, headers)
                res = conn.getresponse()    
                data = res.read()                
                self.releaseToken()
                if(res.status == 200):
                    cd = res.getheader('Content-Disposition')                       
                    # Get filename out of the content disposition in header
                    filename = re.findall('filename=(.+)', cd)                                        
                    with open(filename[0], 'wb') as f:
                        f.write(data)
                    return str(res.status) + ' - success retrieving ' + filename[0]
                else:                    
                    return str(res.status) + ' - ' + str(res.reason)
        except Exception as e:            
            self.releaseToken()                        
            return str(e)

    def ListStreams(self, dataFormat='csv'):
        try:        
            DataFormats = {}
            DataFormats['csv'] = 'text/csv'
            DataFormats['json'] = 'Application/json'
            # Get an access token            
            self.getToken()    
            if self.isTokenValid():                   
                # Setup the path for data request.
                path = f'/api/StreamList'                
                
                # Create request header
                headers = {}   
                headers['Accept'] = DataFormats[dataFormat]                    
                headers['Authorization'] = f'Bearer {self.accessToken}'                
                # Connect to API server                
                conn = http.client.HTTPSConnection(self.server)                
                conn.request('GET', path, None, headers)
                
                res = conn.getresponse()                
                if dataFormat == 'csv':
                    streamsList = res.read().decode('utf-8').replace('\r\n','\n') 
                elif dataFormat == 'json':
                    streamsList = json.dumps(json.loads(res.read().decode('utf-8')), indent=2, sort_keys=False)
                self.releaseToken()                
                
                return streamsList
        except Exception as e:
            print("ListStreams: " + str(e))    
            self.releaseToken()
            return None
        
# try:    
#     # Authenticate with your NRGSTREAM username and password contained in credentials.txt, file format = username,password 
#     # f = open("credentials.txt", "r")
#     # credentials = f.readline().split(',')
#     # f.close()
#     # nrgStreamApi = NRGStreamApi(credentials[0],credentials[1])         
#     # Enter NRGSTREAM username and password to hardcode for use with PowerBI  
#     nrgStreamApi = NRGStreamApi("uricatmp", "urica4nrg")
#     fromDate ='05/13/2021'
#     toDate = '05/13/2021'

#     dataFormat = 'json'
#     dataOption = ''


#     # Change to True to get streams by Stream Id
#     getByStream = True    
#     if getByStream:
#         # Pass in individual stream id
#         streamIds = [23564]              
#         # Or pass in list of stream ids

#         # stream_list = nrgStreamApi.ListStreams(dataFormat)
#         # print(stream_list) 


#         stream_data = nrgStreamApi.GetStreamDataByStreamId(streamIds, fromDate, toDate, dataFormat, dataOption) 
#         print(stream_data)
        
# except Exception as e:
#     print(str(e))
