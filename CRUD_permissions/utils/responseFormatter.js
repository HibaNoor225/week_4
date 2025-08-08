function sendSuccess(res, message = "Success", data = null, statusCode = 200) {
  res.status(statusCode).json({
    result: "success",
    message,
    data: data ,
  });
}

function sendError(res, message = "Something went wrong", statusCode = 500, error,data = null) {
  res.status(statusCode).json({
    result: "failure",
    message,
    error:error,
    data: data,
  });
}

module.exports = { sendSuccess, sendError };
