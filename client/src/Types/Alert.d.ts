interface Alert {
  _id: string;
  alertConditionId: string;
  userId: string;
  date: Date;
  type: string;
  assetId: string;
  alertMsg: string;
  acknowledged: boolean;
}
