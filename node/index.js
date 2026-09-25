var Gitana = require("./lib/gitana");

var isNode = function() {
    var windowTest;
    try {
        //if window is declared thorugh JS DOM then window will be defined but will not be equal to this
        windowTest = (this === window);
    } catch(e) {
        return true;
    }
      
    try {
        return (this===global) && !windowTest;
    } catch(e) {
        return false;
    }
}

var _safeRequire = function(name)
{
    var x = null;
    try {
        x = require(name);
    }
    catch (e) { }
    return x;
}

// default settings so that we connect to Cloud CMS demo sandbox (by default)
Gitana.DEFAULT_CONFIG = {
	"baseURL": "https://api.cloudcms.com"
};

if (isNode())
{
    var fs = _safeRequire("fs");
    var path = _safeRequire("path");
    //var request = _safeRequire("request");
    var request = require("./request");

    var HttpsProxyAgent = _safeRequire("https-proxy-agent");

    // support for environment variable "HTTP_PROXY" or "HTTPS_PROXY"
    var _httpProxy = process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy || process.env.HTTPS_PROXY;

    // support for loading "gitana.json" from optional file on disk
    var defaultConfig = null;
    Gitana.loadDefaultConfig = function() {

        if (!defaultConfig)
        {
            var configFilePath = path.resolve(path.join(".", "gitana.json"));

            if (fs.existsSync(configFilePath)) {
                defaultConfig = JSON.parse(fs.readFileSync(configFilePath));
            }
        }

        return defaultConfig;
    };

    // support node streams for upload and download
    Gitana.streamUpload = function(driver, readStream, uploadUri, contentType, callback)
    {
        var headers = {};
        headers["Content-Type"] = contentType;
        headers["Authorization"] = driver.getHttpHeaders()["Authorization"];

        request({
            "method": "POST", 
            "url": uploadUri,
            "data": readStream,
            "headers": headers, 
            "timeout": 120 * 1000 // 2 minutes
        }, function (err, httpResponse, body) {

            if (err)
            {
                return callback(err);
            }

            if (httpResponse.status >= 200 && httpResponse.status <= 204)
            {
                return callback();
            }

            callback({
                "message": "Status: " + httpResponse.statusCode + ", Message: " + body
            });
        });
    };

    Gitana.streamDownload = function(attachment, callback)
    {
        var driver = attachment.getDriver();
        
        var headers = {};
        headers["Authorization"] = driver.getHttpHeaders()["Authorization"];
        
        // download and pipe to stream
        request({
            "method": "GET", 
            "url": attachment.getDownloadUri(), 
            "headers": {
                "Authorization": attachment.getDriver().getHttpHeaders()["Authorization"]
            },
            "timeout": 120 * 1000 // 2 minutes        
        }, function (err, response) {
    
            if (err) {
                return callback(err);
            }
            
            callback(null, response.data);
        });
    };

    Gitana.HTTP_XHR_FACTORY = function()
    {
        var XHR = null;
        
        if (!_httpProxy) 
        {
            // XHR library
            var XMLHttpRequest = _safeRequire("xmlhttprequest").XMLHttpRequest;
            XHR = new XMLHttpRequest();
        }
        else
        {
            // new XHR library
            var XMLHttpRequest = _safeRequire("node-http-xhr");
            XHR = new XMLHttpRequest();

            XHR._reqOpts.agent = new HttpsProxyAgent(_httpProxy);
        }

        return XHR;
    };
}

module.exports = Gitana;