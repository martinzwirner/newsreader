module.exports = class Response {

  constructor() {

    this.urlAfterRedirect = null;
    this.errorStatusCode = null;
    this.contentType = null;
    this.body = null;
  }
}