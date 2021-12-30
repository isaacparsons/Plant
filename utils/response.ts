export const errorResponseFormat = (msg: any) => {
  return {
    status: "error",
    message: msg,
  };
};

export const successResponseFormat = (data: any) => {
  return {
    status: "success",
    data: data,
  };
};
