import { alertConditions as alertConditionsType } from "../../config/types";

const user = {
  accountName: "isaac.2962@gmail.com",
  password: "123",
};

const asset = {
  name: "Keephills 1",
  assetId: "KH1",
  operatingStatus: "Active",
  nrgId: "293684",
};

const assetFollower = {
  assetId: "KH1",
};

const dispatch = {
  units: "MW",
  assetId: "KH1",
  date: "2021-10-29T21:45:00.000Z",
  value: 350,
  status: "Acknowledged",
  instructionDate: "2021-10-29T21:43:00.000Z",
};
const invalidDispatch = {
  units: "MW",
  asset: "KH1",
  date: "2021-10-29T21:45:00.000Z",
  energy: 350,
  status: "Invalid (A)",
  instructionDate: "2021-10-29T21:43:00.000Z",
};

const invalidDispatchAlertCondition = {
  alertInterval: 10,
  value: 1,
  assetId: "KH1",
  popup: false,
  type: alertConditionsType.invalidDispatch,
};
const preDispatchAlertCondition = {
  alertInterval: 10,
  value: 5,
  assetId: "KH1",
  popup: false,
  type: alertConditionsType.preDispatch,
};
const thresholdDispatchAlertCondition = {
  alertInterval: 10,
  value: 5,
  assetId: "KH1",
  popup: false,
  type: alertConditionsType.threshold,
};
const inactiveDispatchAlertCondition = {
  alertInterval: 10,
  value: 5,
  assetId: "KH1",
  popup: false,
  type: alertConditionsType.inactive,
};

const energyData = {
  units: "MW",
  assetId: "SH1",
  date: "2021-10-31T02:19:00.000Z",
  value: 234,
};

export default {
  user,
  asset,
  assetFollower,
  dispatch,
  invalidDispatch,
  invalidDispatchAlertCondition,
  preDispatchAlertCondition,
  thresholdDispatchAlertCondition,
  inactiveDispatchAlertCondition,
  energyData,
};
