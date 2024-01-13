export const responseUtil = new class {
  sendResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };
  
  responseNotFound = res => {
    this.sendResponse(res, 404, "Not Found");
  }
}
