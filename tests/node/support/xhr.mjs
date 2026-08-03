/**
 * A minimal XMLHttpRequest for Node, backed by the built-in fetch.
 *
 * The driver reaches the network through exactly one call site
 * (js/gitana/http/Http.js, Gitana.Http.Request) and uses only the small surface
 * implemented below. Node has no global XMLHttpRequest, so the driver's
 * Gitana.HTTP_XHR_FACTORY hook is pointed at this class instead of pulling in an
 * unmaintained XHR package.
 *
 * Surface the driver actually uses:
 *   open, send, abort, setRequestHeader, getAllResponseHeaders,
 *   onreadystatechange, readyState (only compared against 4), status,
 *   responseText, responseXML, withCredentials
 */

const UNSENT = 0;
const OPENED = 1;
const DONE = 4;

export class XMLHttpRequest
{
    constructor()
    {
        this.readyState = UNSENT;
        this.status = 0;
        this.statusText = "";
        this.responseText = "";
        this.responseXML = "";
        this.onreadystatechange = null;

        // accepted and ignored: Node's fetch has no ambient cookie jar
        this.withCredentials = false;

        this._method = "GET";
        this._url = null;
        this._headers = {};
        this._responseHeaders = "";
        this._controller = new AbortController();
        this._aborted = false;
    }

    open(method, url)
    {
        this._method = (method || "GET").toUpperCase();
        this._url = url;
        this.readyState = OPENED;
    }

    setRequestHeader(name, value)
    {
        this._headers[name] = value;
    }

    /**
     * Returns headers in the "Name: value\r\n" form the driver parses.
     *
     * Names come back lower-cased, which matches what browsers return - the
     * XHR spec lower-cases them too.
     */
    getAllResponseHeaders()
    {
        return this._responseHeaders;
    }

    abort()
    {
        this._aborted = true;
        this._controller.abort();
    }

    send(data)
    {
        var self = this;

        var init = {
            "method": this._method,
            "headers": this._headers,
            "signal": this._controller.signal
        };

        // GET/HEAD cannot carry a body
        if (data !== null && data !== undefined && this._method !== "GET" && this._method !== "HEAD")
        {
            init.body = data;
        }

        fetch(this._url, init).then(function(response) {

            return response.text().then(function(text) {

                if (self._aborted)
                {
                    return;
                }

                self.status = response.status;
                self.statusText = response.statusText;
                self.responseText = text;

                var headers = "";
                response.headers.forEach(function(value, name) {
                    headers += name + ": " + value + "\r\n";
                });
                self._responseHeaders = headers;

                self._done();
            });

        }).catch(function(err) {

            if (self._aborted)
            {
                // the driver's timeout path calls abort() and reports the failure
                // itself, so there is nothing left to notify
                return;
            }

            // a browser reports network-level failures as status 0 with no body;
            // the driver treats status 0 as "not handled" and will not call back,
            // so surface the cause rather than let a test hang unexplained
            console.warn("XHR request failed: " + self._method + " " + self._url + " - " + err.message);

            self.status = 0;
            self._done();
        });
    }

    _done()
    {
        this.readyState = DONE;

        if (this.onreadystatechange)
        {
            this.onreadystatechange();
        }
    }
}
