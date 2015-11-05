/**
  * NOTE: Check this note
  * This request should be changed because it only works on
  * the browser environment, for nodejs we need a new implementation.
  *
  * Suggestion: making a Request factory like we done to sandboxes;
  */
class Request {

  constructor() {

    let _this = this;
    let methods = {get: 'GET', post: 'POST', delete: 'DELETE', put: 'PUT'};

    Object.keys(methods).forEach(function(method) {
      _this[method] = function(url, params, headers) {
        return _this.makeRequest(methods[method], url, params, headers);
      };

    });

  }

  /**
   * Make ajax request
   * @param  {string}   method  the CRUD method (get, post, put, delete)
   * @param  {string}   url     the url requested to obtain an response
   * @param  {object}   params  pass the parameters to request
   * @param  {object}   headers set request headers
   * @return {object}
   */
  makeRequest(method, url, params, headers) {

    let _this = this;

    return new Promise(function(resolve, reject) {

      let httpRequest;

      if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        httpRequest = new XMLHttpRequest();
      } else if (window.ActiveXObject) { // IE
        try {
          httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (e) {
          try {
            httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
          }
          catch (error) {
            reject(error);
          }
        }
      }

      if (!httpRequest) {
        reject('Giving up :( Cannot create an XMLHTTP instance');
      }

      httpRequest.open(method, url);

      // Set headers to request
      if (headers) {
        Object.keys(headers).forEach(function(header) {
          httpRequest.setRequestHeader(header, headers[header]);
        });
      }

      httpRequest.onreadystatechange = function(event) {
        let httpRequest = event.currentTarget;

        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            // console.log(httpRequest.response);
            resolve(httpRequest.response);
          } else {
            reject(httpRequest.response);
          }
        }
      };

      // If have params send them, in string format
      httpRequest.send(params);

    });

  }

}

var request = new Request();
export default request;
