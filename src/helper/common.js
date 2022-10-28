const response = (res, result, status, message, pagination) => {
  const resultPrint = {};
  const statusCode = status.toString();

  if (statusCode.match(/20*/)) {
    resultPrint.status = "Success";
  } else if (statusCode.match(/40*/)) {
    resultPrint.status = "Client Error";
  } else if (statusCode.match(/50*/)) {
    resultPrint.status = "Server Error";
  }

  resultPrint.statusCode = status;

  try {
    if (result === null) throw "result kosong";
    resultPrint.data = result;
  } catch (error) {
    // console.log(error)
  }

  try {
    if (message === undefined || null) throw "message kosong";
    resultPrint.message = message;
  } catch (error) {
    // console.log(error)
  }

  try {
    if (pagination === undefined || null) throw "pagination kosong";
    resultPrint.pagination = pagination || {};
  } catch (error) {
    // console.log(error)
  }

  res.status(status).json(resultPrint);
};

module.exports = { response };
