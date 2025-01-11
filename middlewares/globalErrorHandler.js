const globalErrHandler = (err, req, res, next) => {
  //status - failed/Third Party Error/server error
  //message - actual message
  //stack - represents in which file this error is occurred
  const stack = err.stack;
  const message = err.message;
  const status = (err.status ||= "Internal Server Error"); //same as n += 2 => (n = n + 2)
  const statusCode = err.statusCode ? err.statusCode : 500;
  //send response
  res.status(statusCode).json({
    status,
    message,
    // stack,
  });
};

export default globalErrHandler;
