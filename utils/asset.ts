export const formatAesoAssetName = (name: any) => {
  var res = name.search(/\s#/g);
  var updatedName = name;
  if (res != -1) {
    updatedName = name.slice(0, res) + name.slice(res + 1);
  }
  res = name.search(/\s/g);
  updatedName = updatedName.slice(res + 1);
  return updatedName;
};
export const formatNRGAssetName = (name: any) => {
  var res = name.search(/\s#/g);
  var updatedName = name;
  if (res != -1) {
    updatedName = name.slice(0, res) + name.slice(res + 1);
  }
  res = name.search(/-\s/g);
  updatedName = updatedName.slice(res + 2);
  return updatedName;
};
export const parseEnergyData = (data: any) => {
  return data.map((item: any, index: any) => {
    return {
      date: new Date(item[0]),
      value: parseFloat(item[1]),
    };
  });
};
