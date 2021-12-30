const axios = require("axios");
const cheerio = require("cheerio");

const getAssetNamesAndIds = async () => {
  const response = await axios({
    url: "http://ets.aeso.ca/ets_web/ip/Market/Reports/AssetListReportServlet?beginDate=&endDate=&contentType=html",
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  var assetDetails: any = [];
  var $ = cheerio.load(response.data);
  var table = $("table");
  var assetRows = $(table).find("tbody").find("tr");
  $(assetRows).each(function (i: any, elem: any) {
    // index 0 is the table title, index 1 is the filter by first letter selection (A-Z)
    // index 2 is the table header names
    if (i > 2) {
      var tds = $(elem).children();
      assetDetails.push({
        assetName: $(tds[0]).text(),
        assetId: $(tds[1]).text(),
        assetType: $(tds[2]).text(),
        operatingStatus: $(tds[3]).text(),
        poolParticipantName: $(tds[4]).text(),
        poolParticipantId: $(tds[5]).text(),
      });
    }
  });
  return assetDetails;
};

export default {
  getAssetNamesAndIds,
};
