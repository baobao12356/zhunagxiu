

function checkStatus(response) {
  if (response.code != 200) {
    // 异常
    throw response;
  }
  return response;
}

module.exports.checkStatus = checkStatus;
