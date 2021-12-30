import https from "https";
import logger from "../config/logging";
import keys from "../config/keys";
var { NRG } = keys.default;
https.globalAgent.maxSockets = 1;

const httpsGetPromise = (options: any) => {
  return new Promise(async (resolve, reject) => {
    var req = https.request(options, async (res: any) => {
      let data = "";
      res.on("data", (chunk: any) => {
        data += chunk;
      });
      res.on("end", async () => {
        if (res.statusCode == 200) {
          resolve(data);
        } else {
          reject("Request failed status: " + res.statusCode + " " + res.headers.toString());
        }
      });
    });
    req.on("error", (err: any) => {
      reject(err);
    });
    req.end();
  });
};

const httpsPostPromise = (options: any, body: any) => {
  return new Promise(async (resolve, reject) => {
    var req = https.request(options, async (res: any) => {
      let data = "";
      res.on("data", (chunk: any) => {
        data += chunk;
      });
      res.on("end", async () => {
        if (res.statusCode == 200) {
          resolve(data);
        } else {
          reject(new Error("post"));
        }
      });
    });
    req.on("error", (err: any) => {
      reject(err);
    });
    req.write(body);
    req.end();
  });
};

class NRGStreamApi {
  static instance: any;
  constructor() {
    throw new Error("Use NRGStreamApi.getInstance()");
  }
  static getInstance() {
    if (!NRGStreamApi.instance) {
      NRGStreamApi.instance = new PrivateNRGStreamApi(NRG.username, NRG.password);
    }
    return NRGStreamApi.instance;
  }
}

class PrivateNRGStreamApi {
  username: string;
  password: string;
  server: string;
  tokenPath: string;
  tokenPayload: string;
  tokenExpiry: Date | null;
  token: string | null;

  constructor(username: any, password: any) {
    this.username = username;
    this.password = password;
    this.server = "api.nrgstream.com";
    this.tokenPath = "/api/security/token";
    this.tokenPayload = `grant_type=password&username=${this.username}&password=${this.password}`;
    this.tokenExpiry = null;
    this.token = null;
  }

  async createToken() {
    // console.log(`createToken() start: ${new Date().getTime()}`);
    try {
      var options = {
        hostname: this.server,
        path: this.tokenPath,
        method: "POST",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      };
      var data: any = await httpsPostPromise(options, this.tokenPayload);
      let json = JSON.parse(data);
      return json;
    } catch (err) {
      var error = `Error creating NRG token, ${err}`;
      // logger.error(`Api/NRGStream/createToken error: ${error}`);
      // logger.error(`Api/NRGStream/createToken token: ${this.token}`);
      throw error;
    } finally {
      // console.log(`createToken() end: ${new Date().getTime()}`);
    }
  }
  async getToken() {
    // console.log(`getToken() start: ${new Date().getTime()}`);
    if (
      this.tokenExpiry == null ||
      new Date().getTime() >= new Date(this.tokenExpiry).getTime() ||
      this.token == null
    ) {
      var { expires_in, access_token } = await this.createToken();
      var date = new Date();
      date.setSeconds(date.getSeconds() + expires_in);
      this.tokenExpiry = date;
      this.token = access_token;
    }
    // console.log(`getToken token: ${this.token}`);
    // console.log(`getToken() end: ${new Date().getTime()}`);
    return this.token;
  }
  async releaseToken() {
    // console.log(`releaseToken() start: ${new Date().getTime()}`);
    if (this.token) {
      var headers = { Authorization: "Bearer " + this.token.toString() };
      var options = {
        hostname: this.server,
        path: "/api/ReleaseToken",
        method: "DELETE",
        headers: headers,
      };
      try {
        await httpsGetPromise(options);
        this.tokenExpiry = null;
        this.token = null;
        // console.log(`releaseToken token: ${this.token}`);
        return true;
      } catch (err) {
        var error = `Error releasing NRG token, ${err}`;
        logger.error(`Api/NRGStream/releaseToken: ${error}`);
        throw error;
      } finally {
        // console.log(`releaseToken() end: ${new Date().getTime()}`);
      }
    }
  }
  async getStreamDataUrls(query = null) {
    var token = await this.getToken();
    // console.log(`getStreamDataUrls token: ${token}`);
    var queryString = createQueryStringFromObj(query);
    var tokenStr = token ? token.toString() : "";
    var headers = { Authorization: "Bearer " + tokenStr };
    var options = {
      hostname: this.server,
      path: "/api/StreamDataUrl" + queryString,
      method: "GET",
      headers: headers,
    };
    try {
      var res: any = await httpsGetPromise(options);
      var json = JSON.parse(res);
      return json;
    } catch (err) {
      var error = `Error getting NRG stream data urls, ${err}`;
      logger.error(`Api/NRGStream/getStreamDataUrls: ${error}`);
    } finally {
      await this.releaseToken();
    }
  }
  async getStreamData(stream_id: any, fromDate: any, toDate: any) {
    try {
      // format date and check for valid date
      var formattedFromDate = formatDateForNRG(fromDate); // MM-DD-YYYY hh:mm
      var formattedToDate = formatDateForNRG(toDate); // MM-DD-YYYY hh:mm
      var token = await this.getToken();

      var tokenStr = token ? token.toString() : "";
      var headers = { Authorization: "Bearer " + tokenStr };
      var path = "/api/StreamData/" + stream_id + "?fromDate=" + formattedFromDate + "&toDate=" + formattedToDate;
      var options = {
        hostname: this.server,
        path: path,
        method: "GET",
        headers: headers,
      };
      var res: any = await httpsGetPromise(options);
      var json = JSON.parse(res);
      return json;
    } catch (err) {
      var error = `Error getting NRG stream data, ${err}`;
      logger.error(`Api/NRGStream/getStreamData: ${error}`);
      throw error;
    } finally {
      await this.releaseToken();
    }
  }

  // ---------------------------------------------------------------------------
  // THE METHODS BELOW NEED TO BE UPDATE IF NEED TO BE USED (ERROR HANDLING ETC)
  // ---------------------------------------------------------------------------
  // async getStreamDataOptions(streamI: any) {
  //   var token = await this.getToken();
  //   var tokenStr = token ? token.toString() : "";
  //   var headers = { Authorization: "Bearer " + token.toString() };
  //   var options = {
  //     hostname: this.server,
  //     path: "/api/StreamDataOptions/" + streamId,
  //     method: "GET",
  //     headers: headers,
  //   };
  //   var res = await httpsGetPromise(options);
  //   var json = JSON.parse(res);
  //   return json;
  // }
  // async getStreamDataFilters() {
  //   var token = await this.getToken();
  //   var headers = { Authorization: "Bearer " + token.toString() };
  //   var options = {
  //     hostname: this.server,
  //     path: "/api/StreamDataUrlFilters",
  //     method: "GET",
  //     headers: headers,
  //   };
  //   var res = await httpsGetPromise(options);
  //   var json = JSON.parse(res);
  //   return json;
  // }
  // async getListGroupExtracts() {
  //   var token = await this.getToken();
  //   var headers = { Authorization: "Bearer " + token.toString() };
  //   var options = {
  //     hostname: this.server,
  //     path: "/api/ListGroupExtracts/",
  //     method: "GET",
  //     headers: headers,
  //   };
  //   var res = await httpsGetPromise(options);
  //   var json = JSON.parse(res);
  //   return json;
  // }
  // async getGroupExtractHeader(groupExtract) {
  //   var token = await this.getToken();
  //   var headers = { Authorization: "Bearer " + token.toString() };
  //   var options = {
  //     hostname: this.server,
  //     path: "/api/groupExtractHeader/" + groupExtract,
  //     method: "GET",
  //     headers: headers,
  //   };
  //   var res = await httpsGetPromise(options);
  //   var json = JSON.parse(res);
  //   return json;
  // }
  // async getGroupExtract(groupExtract) {
  //   var token = await this.getToken();
  //   var headers = { Authorization: "Bearer " + token.toString() };
  //   var options = {
  //     hostname: this.server,
  //     path: "/api/" + groupExtract,
  //     method: "GET",
  //     headers: headers,
  //   };
  //   var res = await httpsGetPromise(options);
  //   var json = JSON.parse(res);
  //   return json;
  // }
  // async getListStreams() {
  //   var token = await this.getToken();
  //   var headers = { Authorization: "Bearer " + token.toString() };
  //   var options = {
  //     hostname: this.server,
  //     path: "/api/ListStreams",
  //     method: "GET",
  //     headers: headers,
  //   };
  //   try {
  //     var res = await httpsGetPromise(options);
  //     this.releaseToken();
  //     var json = JSON.parse(res);
  //     return json;
  //   } catch (error) {
  //     console.log(error);
  //     this.releaseToken();
  //   }
  // }

  formatDate(date: any) {
    function padZero(num: any) {
      if (num < 10) {
        return "0" + num.toString();
      } else {
        return num.toString();
      }
    }

    var formattedDate = new Date(date);
    // make sure the date is valid
    if (!isNaN(formattedDate.getTime())) {
      var month = formattedDate.getMonth() + 1;
      var day = formattedDate.getDate();
      var year = formattedDate.getFullYear();

      var formattedDateStr = padZero(month) + "/" + day + "/" + year;
      return formattedDateStr;
    } else {
      throw new Error("Invalid Date");
    }
  }
}

// MM-DD-YYYY hh:mm
const formatDateForNRG = (date: any) => {
  function padZero(num: any) {
    if (num < 10) {
      return "0" + num.toString();
    } else {
      return num.toString();
    }
  }

  var formattedDate = new Date(date);
  // make sure the date is valid
  if (!isNaN(formattedDate.getTime())) {
    var month = padZero(formattedDate.getMonth() + 1);
    var day = padZero(formattedDate.getDate());
    var year = formattedDate.getFullYear();
    var hour = padZero(formattedDate.getHours());
    var min = padZero(formattedDate.getMinutes());

    var formattedDateStr = month + "-" + day + "-" + year + "%20" + hour + ":" + min;
    return formattedDateStr;
  } else {
    throw new Error("Invalid Date");
  }
};

function createQueryStringFromObj(obj: any) {
  if (typeof obj == "object") {
    var queryString = "";
    if (obj) {
      Object.keys(obj).forEach((key, index) => {
        if (index == 0) {
          queryString = "?" + key + "=" + obj[key];
        } else {
          queryString = "&" + key + "=" + obj[key];
        }
      });
    }
    return queryString;
  } else {
    throw new Error("Must be an object");
  }
}

module.exports = NRGStreamApi;
