const appErrHandler = (message, statusCode) => {
  let myError = new Error(message);
  // myError.stack = myError.stack;
  myError.statusCode = statusCode ? statusCode : 500;
  return myError;
};

export default appErrHandler;
