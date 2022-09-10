class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // error main class takes message as default paramerter.
    this.code = errorCode; // adding erroCode property to show the passed status code.
  }
}

module.exports = HttpError;
