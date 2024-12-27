function request(url, callbackSuccess, callbackFailure) {
  fetch(url, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    })
    .then((data) => {
      if (callbackSuccess) {
        callbackSuccess(data);
      }
    })
    .catch((error) => {
      if (callbackFailure) {
        callbackFailure(error);
      }
    });
}

module.exports = { request }