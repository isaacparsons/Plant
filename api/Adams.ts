import fs from "fs";
import cheerio from "cheerio";
var httpsRedirects = require("follow-redirects").https;
import https from "https";
import logger from "../config/logging";
import KEYS from "../config/keys";
const { ADAMS } = KEYS.default;
const { username, password, cert_passphrase, cert_file_path } = ADAMS;

const getDispatchData = () => {
  return new Promise((resolve, reject) => {
    var options1 = {
      hostname: "adams-2010.aeso.ca",
      path: "/adams-web/",
      method: "GET",
      pfx: fs.readFileSync(cert_file_path),
      passphrase: cert_passphrase,
      headers: {
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Language": "en-CA,en;q=0.9",
        "Cache-Control": "max-age=0",
        "sec-ch-ua-mobile": "?0",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        Host: "adams-2010.aeso.ca",
      },
    };
    const request = https.request(options1, (response: any) => {
      response.on("error", (err: any) => {
        logger.error("Error in https request while getting cookie");
        reject("ADaMS Error: couldnt get cookie");
      });
      response.on("data", (chunk: any) => {});
      response.on("end", () => {
        if (response.statusCode == 200) {
          if (response.headers.hasOwnProperty("set-cookie")) {
            var cookie1 = response.headers["set-cookie"][0] ? response.headers["set-cookie"][0].split(" ")[0] : "";
            var cookie2 = response.headers["set-cookie"][1] ? response.headers["set-cookie"][1].split(" ")[0] : "";
            var coookies = cookie1.toString() + " " + cookie2.toString();
            var options2: any = {
              hostname: "adams-2010.aeso.ca",
              port: 443,
              path: "/adams-web/login",
              method: "POST",
              pfx: fs.readFileSync(cert_file_path),
              passphrase: cert_passphrase,
              headers: {
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "Accept-Language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
                "Cache-Control": "max-age=0",
                "Content-Type": "application/x-www-form-urlencoded",
                "sec-ch-ua-mobile": "?0",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1",
                Referrer: "https://adams-2010.aeso.ca/adams-web/login.jsp",
                Origin: "https://adams-2010.aeso.ca",
                Cookie: coookies,
              },
            };
            options2.followRedirects = true;
            options2.trackRedirects = true;
            var req2 = httpsRedirects.request(options2, (res: any) => {
              var body = "";
              res.on("data", (chunk: any) => (body += chunk));
              res.on("error", (err: any) => {
                var error = `ADaMS Error: couldnt get cookie`;
                logger.error(`Api/Adams/getDispatchData: ${err}`);
                reject(error);
              });
              res.on("end", () => {
                var redirectUrls = res.redirects.map((redirect: any) => redirect.url);
                var redirectError = checkUrlsForError(redirectUrls);
                if (res.statusCode == 200 && !redirectError) {
                  try {
                    var dispatchHistoryObjs = parseDispatchHistory(body);
                    var currentDispatchObjs = parseCurrentDispatch(body);
                  } catch (err) {
                    var error = `ADaMS Error: failed to parse data`;
                    logger.error(`Api/Adams/getDispatchData: ${err}`);
                    reject(error);
                  }
                  var options3 = {
                    hostname: "adams-2010.aeso.ca",
                    port: 443,
                    path: "/adams-web/j_spring_security_logout",
                    method: "GET",
                    pfx: fs.readFileSync(cert_file_path),
                    passphrase: cert_passphrase,
                    headers: {
                      "Accept-Encoding": "gzip, deflate, br",
                      Connection: "keep-alive",
                      Accept:
                        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                      "Accept-Language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
                      "Cache-Control": "max-age=0",
                      "Content-Type": "application/x-www-form-urlencoded",
                      "sec-ch-ua-mobile": "?0",
                      "Sec-Fetch-Dest": "document",
                      "Sec-Fetch-Mode": "navigate",
                      "Sec-Fetch-Site": "same-origin",
                      "Sec-Fetch-User": "?1",
                      "Upgrade-Insecure-Requests": "1",
                      Referrer: "https://adams-2010.aeso.ca/adams-web/participant/participantView.do",
                      Cookie: coookies,
                    },
                  };
                  var req3 = https.request(options3, (res2) => {
                    res2.on("error", (err) => {
                      var error = `ADaMS Error: unable to log out`;
                      logger.error(`Api/Adams/getDispatchData: ${err}`);
                      reject(error);
                    });
                    res2.on("data", (chunk) => {});
                    res2.on("end", () => {
                      resolve({
                        dispatchHistory: dispatchHistoryObjs,
                        currentDispatches: currentDispatchObjs,
                      });
                    });
                  });
                  req3.end();
                } else {
                  var error = `ADaMS Error: unable to log in`;
                  logger.error(`Api/Adams/getDispatchData: ${res.statusCode}`);
                  reject(error);
                }
              });
            });
            req2.write(`j_username=&h_username=${username}&j_password=&h_password=${password}`);
            req2.end();
          } else {
            logger.error("Api/Adams/getDispatchData: cookie was not given :(");
            reject("ADaMS Error: unable to get cookie");
          }
        } else {
          logger.error("Api/Adams/getDispatchData: request returned !200, Error gettig cookie");
          reject("ADaMS Error: unable to get cookie");
        }
      });
    });
    request.end();
  });
};

const checkUrlsForError = (urls: any) => {
  var error = false;
  urls.forEach((url: any) => {
    const regex = /error/g;
    const found = url.match(regex);
    if (found) {
      error = true;
    }
  });
  return error;
};

const parseDispatchHistory = (body: any) => {
  var dispatchHistoryObjs: Array<object> = [];
  var $ = cheerio.load(body);
  var dispatchHistoryRows = $("#dispatchHistoryContent").find("table").find("tbody").find("tr");
  if (dispatchHistoryRows.length > 2) {
    $(dispatchHistoryRows).each(function (i, elem) {
      var tds = $(elem).children();
      var instrRes = $(tds[16]).text().split(" ");
      var instructionD = instrRes[0];
      var instructionTime = instrRes[1];
      var instructionDate = adamsFormatter.formatDate(instructionD, instructionTime);
      var d = adamsFormatter.formatDate($(tds[1]).text(), $(tds[2]).text());
      dispatchHistoryObjs.push({
        status: $(tds[0]).text(),
        date: d,
        asset: $(tds[3]).text(),
        ac: parseFloat($(tds[4]).text()),
        energy: parseFloat($(tds[5]).text()),
        dds: parseFloat($(tds[6]).text()),
        sr: {
          dispatch: parseFloat($(tds[7]).text()),
          directive: parseFloat($(tds[8]).text()),
        },
        sup: {
          dispatch: parseFloat($(tds[9]).text()),
          directive: parseFloat($(tds[10]).text()),
        },
        tmr: parseFloat($(tds[11]).text()),
        rr: parseFloat($(tds[12]).text()),
        target: {
          low: parseFloat($(tds[13]).text()),
          high: parseFloat($(tds[14]).text()),
        },
        notes: $(tds[15]).text(),
        instructionDate: instructionDate,
        dispatch: {
          on: $(tds[17]).text(),
          off: $(tds[18]).text(),
        },
        directive: {
          on: $(tds[19]).text(),
          off: $(tds[20]).text(),
        },
      });
    });
  }
  return dispatchHistoryObjs;
};

const parseCurrentDispatch = (body: any) => {
  var currentDispatchObjs: Array<object> = [];
  var $ = cheerio.load(body);
  var currentDispatchTable = $("table");
  var currentDispatchRows = $(currentDispatchTable[1]).find("tbody").find("tr");
  if (currentDispatchRows.length > 2) {
    $(currentDispatchRows.slice(2)).each(function (i, elem) {
      var tds = $(elem).children();
      var instrRes = $(tds[18]).text().split(" ");
      var instructionD = instrRes[0];
      var instructionTime = instrRes[1];
      var instructionDate = adamsFormatter.formatDate(instructionD, instructionTime);
      var d = adamsFormatter.formatDate($(tds[3]).text(), $(tds[4]).text());
      currentDispatchObjs.push({
        ackDisp: $(tds[0]).text(),
        ackDir: $(tds[2]).text(),
        date: d,
        asset: $(tds[5]).text(),
        ac: parseFloat($(tds[6]).text()),
        energy: parseFloat($(tds[7]).text()),
        dds: parseFloat($(tds[8]).text()),
        sr: {
          dispatch: parseFloat($(tds[9]).text()),
          directive: parseFloat($(tds[10]).text()),
        },
        sup: {
          dispatch: parseFloat($(tds[11]).text()),
          directive: parseFloat($(tds[12]).text()),
        },
        tmr: parseFloat($(tds[13]).text()),
        rr: parseFloat($(tds[14]).text()),
        target: {
          low: parseFloat($(tds[15]).text()),
          high: parseFloat($(tds[16]).text()),
        },
        notes: $(tds[17]).text(),
        instructionDate: instructionDate,
        dispatch: {
          on: $(tds[19]).text(),
          off: $(tds[20]).text(),
        },
        directive: {
          on: $(tds[21]).text(),
          off: $(tds[22]).text(),
        },
      });
    });
  }
  return currentDispatchObjs;
};

const adamsFormatter = {
  formatDate: (date: any, time: any) => {
    var year = new Date().getFullYear();
    var res = date.split("/");
    var month = parseInt(res[0]);
    var day = parseInt(res[1]);
    if (day == 31 && month == 12) {
      year = year - 1;
    }
    var resT = time.split(":");
    var hour = parseInt(resT[0]);
    var min = parseInt(resT[1]);

    var parsedDate = new Date(year, month - 1, day, hour, min);
    parsedDate.setHours(parsedDate.getHours());
    return parsedDate;
  },
};

export default {
  getDispatchData,
};
