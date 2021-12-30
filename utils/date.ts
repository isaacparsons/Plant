const isValidDate = (d: any) => {
  return d instanceof Date;
};

// const formatDate = (date: any) => {
//   function padZero(num: any) {
//     if (num < 10) {
//       return "0" + num.toString();
//     } else {
//       return num.toString();
//     }
//   }

//   var formattedDate = new Date(date);
//   // make sure the date is valid
//   if (!isNaN(formattedDate.getTime())) {
//     var month = formattedDate.getMonth() + 1;
//     var day = formattedDate.getDate();
//     var year = formattedDate.getFullYear();

//     var formattedDateStr = padZero(month) + "/" + day + "/" + year;
//     return formattedDateStr;
//   } else {
//     throw new Error("Invalid Date");
//   }
// };

// yyyy-mm-dd hh:mm
const formatDate = (date: any) => {
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
    var hour = padZero(formattedDate.getHours() + 1);
    var min = padZero(formattedDate.getMinutes());

    var formattedDateStr = year + "-" + month + "-" + day + " " + hour + ":" + min;
    return formattedDateStr;
  } else {
    throw new Error("Invalid Date");
  }
};

export default {
  isValidDate,
  formatDate,
};
