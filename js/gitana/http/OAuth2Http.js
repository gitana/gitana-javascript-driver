(function()
{
    Gitana.OAuth2Http = Gitana.Http.extend(
    /** @lends Gitana.OAuth2Http.prototype */
    {
        /**
         * @constructs
         *
         * @class Gitana.OAuth2Http
         */
        constructor: function(options, storage)
        {
            const self = this;

            // storage for OAuth credentials
            // this can either be a string ("local", "session", "memory") or a storage instance or empty
            // if empty, memory-based storage is assumed
            if (storage === null || typeof(storage) === "string")
            {
                storage = new Gitana.OAuth2Http.Storage(storage);
            }

            // cookie mode
            this.cookieMode = null;

            // ticket mode
            this.ticketMode = null;

            // preset the error state
            this.error = null;
            this.errorDescription = null;
            this.errorUri = null;

            // gitana urls
            let tokenURL = "/oauth/token";
            if (options.tokenURL)
            {
                tokenURL = options.tokenURL;
            }

            // base URL?
            let baseURL = null;
            if (options.baseURL)
            {
                baseURL = options.baseURL;
            }

            // client
            const clientKey = options.clientKey;
            const clientSecret = options.clientSecret;

            // authorization flow
            // if none specified, assume AUTHORIZATION CODE
            this.authorizationFlow = options.authorizationFlow || Gitana.OAuth2Http.AUTHORIZATION_CODE;

            // optional
            if (options.requestedScope)
            {
                this.requestedScope = options.requestedScope;
            }

            if (this.authorizationFlow === Gitana.OAuth2Http.AUTHORIZATION_CODE)
            {
                this.code = options.code;
                this.redirectUri = options.redirectUri;
            }

            if (this.authorizationFlow === Gitana.OAuth2Http.PASSWORD)
            {
                this.username = options.username;

                if (options.password)
                {
                    this.password = options.password;
                }
                else
                {
                    this.password = "";
                }
            }

            if (this.authorizationFlow === Gitana.OAuth2Http.COOKIE)
            {
                this.cookieMode = true;
            }

            if (this.authorizationFlow === Gitana.OAuth2Http.TICKET)
            {
                this.ticketMode = options.ticket;
            }

            this.ticketMaxAge = options.ticketMaxAge;


            ////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // ACCESSORS
            //
            ////////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Clears persisted storage of auth data
             */
            this.clearStorage = function()
            {
                storage.clear();
            };

            /**
             * Gets or saves the access token
             *
             * @param value {String} optional value
             */
            this.accessToken = function(value)
            {
                return storage.poke("accessToken", value);
            };

            /**
             * Gets or saves the refresh token
             *
             * @param value {String} optional value
             */
            this.refreshToken = function(value)
            {
                return storage.poke("refreshToken", value);
            };

            /**
             * Gets or saves the granted scope
             *
             * @param value {String}optional value
             */
            this.grantedScope = function(value)
            {
                return storage.poke("grantedScope", value);
            };

            /**
             * Gets or saves the expires in value
             *
             * @param value {String} optional value
             */
            this.expiresIn = function(value)
            {
                return storage.poke("expiresIn", value);
            };

            /**
             * Gets or saves the grant time
             *
             * @param value {String} optional value
             */
            this.grantTime = function(value)
            {
                return storage.poke("grantTime", value);
            };

            this.getClientAuthorizationHeader = function() {

                let basicString = clientKey + ":";
                if (clientSecret)
                {
                    basicString += clientSecret;
                }
                return "Basic " + Gitana.btoa(basicString);
            };

            this.getBearerAuthorizationHeader = function()
            {
                return "Bearer " + self.accessToken();
            };

            this.getPrefixedTokenURL = function()
            {
                return this.getPrefixedURL(tokenURL);
            };

            this.getPrefixedURL = function(url)
            {
                let rebasedURL = url;
                if (baseURL && Gitana.startsWith(url, "/"))
                {
                    rebasedURL = baseURL + url;
                }

                return rebasedURL;
            };


            // if they initiatialized with an access token, clear and write into persisted state
            // unless they're continuing an existing token
            if (this.authorizationFlow === Gitana.OAuth2Http.TOKEN)
            {
                const existingAccessToken = this.accessToken();
                if (existingAccessToken !== options.accessToken)
                {
                    storage.clear();
                }

                this.accessToken(options.accessToken);
            }

            this.base();
        },

        /**
         * Performs an HTTP call using OAuth2.
         *
         * @param options
         */
        request: function(options)
        {
            const self = this;

            /**
             * Call over to Gitana and acquires an access token using flow authorization.
             *
             * @param success
             * @param failure
             */
            const doGetAccessToken = function(success, failure)
            {
                const onSuccess = function(response, xhr)
                {
                    const object = JSON.parse(response.text);
                    if (object["error"])
                    {
                        self.error = object["error"];
                        self.errorDescription = object["error_description"];
                        self.errorUri = object["error_uri"];

                        return failure(response, xhr);
                    }

                    const _accessToken = object["access_token"];
                    const _refreshToken = object["refresh_token"];
                    const _expiresIn = object["expires_in"];
                    const _grantedScope = object["scope"];
                    const _grantTime = new Date().getTime();

                    // store into persistent storage
                    self.clearStorage();
                    self.accessToken(_accessToken);
                    self.refreshToken(_refreshToken);
                    self.expiresIn(_expiresIn);
                    self.grantedScope(_grantedScope);
                    self.grantTime(_grantTime);

                    // console.log("doGetAccessToken -> " + JSON.stringify(object));

                    success();
                };

                const onFailure = function(http, xhr) {
                    failure(http, xhr);
                };

                const o = {
                    success: onSuccess,
                    failure: onFailure,
                    headers: {
                        "Authorization": self.getClientAuthorizationHeader()
                    },
                    url: self.getPrefixedTokenURL(),
                    method: Gitana.OAuth2Http.TOKEN_METHOD
                };

                // query string
                const qs = {};

                // ticket max age
                if (self.ticketMaxAge)
                {
                    qs["ticketMaxAge"] = self.ticketMaxAge;
                }

                // if we're POSTing, do so as application/x-www-form-urlencoded to make secure over the wire
                if ("post" === Gitana.OAuth2Http.TOKEN_METHOD.toLowerCase())
                {
                    o.headers["Content-Type"] = "application/x-www-form-urlencoded";

                    // url encoded payload
                    const urlEncodedTokens = {};
                    urlEncodedTokens["grant_type"] = self.authorizationFlow;
                    if (self.requestedScope) {
                        urlEncodedTokens["scope"] = self.requestedScope;
                    }
                    if (self.authorizationFlow === Gitana.OAuth2Http.AUTHORIZATION_CODE)
                    {
                        urlEncodedTokens["code"] = self.code;
                        if (self.redirectUri) {
                            urlEncodedTokens["redirect_uri"] = self.redirectUri;
                        }
                    }
                    else if (self.authorizationFlow === Gitana.OAuth2Http.PASSWORD)
                    {
                        urlEncodedTokens["username"] = self.username;
                        urlEncodedTokens["password"] = self.password;
                    }
                    o.data = "" + Gitana.Http.toQueryString(urlEncodedTokens);
                }
                else
                {
                    qs["grant_type"] = self.authorizationFlow;
                    if (self.requestedScope) {
                        qs["scope"] = self.requestedScope;
                    }
                    if (self.authorizationFlow === Gitana.OAuth2Http.AUTHORIZATION_CODE)
                    {
                        qs["code"] = self.code;
                        if (self.redirectUri) {
                            qs["redirect_uri"] = self.redirectUri;
                        }
                    }
                    else if (self.authorizationFlow === Gitana.OAuth2Http.PASSWORD)
                    {
                        qs["username"] = self.username;
                        qs["password"] = self.password;
                    }
                }

                // append into query string
                const queryString = Gitana.Http.toQueryString(qs);
                if (queryString)
                {
                    if (o.url.indexOf("?") > -1)
                    {
                        o.url = o.url + "&" + queryString;
                    }
                    else
                    {
                        o.url = o.url + "?" + queryString;
                    }
                }

                self.invoke(o);
            };

            if (typeof(Gitana.REFRESH_TOKEN_LOCKS) === "undefined")
            {
                Gitana.REFRESH_TOKEN_LOCKS = {};
            }
            if (typeof(Gitana.REFRESH_TOKEN_LOCK_REATTEMPT_MS) === "undefined")
            {
                Gitana.REFRESH_TOKEN_LOCK_REATTEMPT_MS = 75;
            }

            const waitForPendingRefresh = function(key, oldAccessToken)
            {
                setTimeout(function() {

                    // if another "thread" is still refreshing, keep on waiting
                    if (Gitana.REFRESH_TOKEN_LOCKS[key]) {
                        return waitForPendingRefresh();
                    }

                    // if we get this far, we take advantage of the new access key
                    // first check to make sure that it is a different access key
                    const newAccessToken = self.accessToken();

                    // we try the call again under the assumption that the access token is valid
                    // if the access token is different, we allow for another attempted refresh
                    // otherwise we do not to avoid spinning around forever
                    const autoAttemptRefresh = (newAccessToken === oldAccessToken);

                    // fire the call
                    doCall(autoAttemptRefresh);

                }, Gitana.REFRESH_TOKEN_LOCK_REATTEMPT_MS);
            };

            /**
             * Calls over to Gitana and acquires an access token using an existing refresh token.
             *
             * We use a refresh token lock here (scoped to the module) so that only one event loop per refresh token
             * is allowed to perform the refresh at a time.  This is to avoid making excessive network calls and also
             * helps to avoid race/bounce conditions when multiple refresh tokens come back, spinning things out of
             * control.  Eventually it settles down but better to avoid altogether.
             *
             * @param success
             * @param failure
             */
            const doRefreshAccessToken = function(success, failure) {

                const key = self.refreshToken();
                const oldAccessToken = self.accessToken();

                // if another "thread" is refreshing for this refresh key, then we wait until it finishes
                // when it finishes, we either use the acquired access token or make another attempt
                if (Gitana.REFRESH_TOKEN_LOCKS[key]) {
                    return waitForPendingRefresh(key, oldAccessToken);
                }

                // claim that we are the "thread" doing the refresh
                Gitana.REFRESH_TOKEN_LOCKS[key] = true;

                // make the http call for the refresh
                _doRefreshAccessToken(function(response) {

                    // all done, delete the lock
                    delete Gitana.REFRESH_TOKEN_LOCKS[key];

                    // callback
                    success(response);

                }, function(http, xhr) {

                    // didn't work, release the lock
                    delete Gitana.REFRESH_TOKEN_LOCKS[key];

                    // callback
                    failure(http, xhr);
                });
            };

            const _doRefreshAccessToken = function(success, failure) {

                const onSuccess = function(response)
                {
                    const object = JSON.parse(response.text);
                    if (response["error"])
                    {
                        self.error = object["error"];
                        self.errorDescription = object["error_description"];
                        self.errorUri = object["error_uri"];
                    }
                    else
                    {
                        const _accessToken = object["access_token"];
                        const _refreshToken = object["refresh_token"];
                        const _expiresIn = object["expires_in"];
                        //self.grantedScope = object["scope"]; // this doesn't come back on refresh, assumed the same
                        const _grantTime = new Date().getTime();
                        const _grantedScope = self.grantedScope();

                        // store into persistent storage
                        self.clearStorage();
                        self.accessToken(_accessToken);
                        self.refreshToken(_refreshToken);
                        self.expiresIn(_expiresIn);
                        self.grantedScope(_grantedScope);
                        self.grantTime(_grantTime);
                    }

                    success(response);
                };

                const onFailure = function(http, xhr) {

                    Gitana.REFRESH_TOKEN_FAILURE_FN(self, http, xhr);

                    failure(http, xhr);
                };

                const o = {
                    success: onSuccess,
                    failure: onFailure,
                    headers: {
                        "Authorization": self.getClientAuthorizationHeader()
                    },
                    url: self.getPrefixedTokenURL(),
                    method: Gitana.OAuth2Http.TOKEN_METHOD
                };

                // query string
                const qs = {};

                // ticket max age
                if (self.ticketMaxAge)
                {
                    qs["ticketMaxAge"] = self.ticketMaxAge;
                }

                // if we're POSTing, do so as application/x-www-form-urlencoded to make secure over the wire
                if ("post" === Gitana.OAuth2Http.TOKEN_METHOD.toLowerCase())
                {
                    o.headers["Content-Type"] = "application/x-www-form-urlencoded";

                    // url encoded payload
                    const urlEncodedTokens = {};
                    urlEncodedTokens["grant_type"] = "refresh_token";
                    urlEncodedTokens["refresh_token"] = self.refreshToken();
                    if (self.requestedScope)
                    {
                        urlEncodedTokens["scope"] = self.requestedScope;
                    }
                    o.data = "" + Gitana.Http.toQueryString(urlEncodedTokens);
                }
                else
                {
                    qs["grant_type"] = "refresh_token";
                    qs["refresh_token"] = self.refreshToken();
                    if (self.requestedScope)
                    {
                        qs["scope"] = self.requestedScope;
                    }
                }

                // append into query string
                const queryString = Gitana.Http.toQueryString(qs);
                if (queryString)
                {
                    if (o.url.indexOf("?") > -1)
                    {
                        o.url = o.url + "&" + queryString;
                    }
                    else
                    {
                        o.url = o.url + "?" + queryString;
                    }
                }

                self.invoke(o);
            };

            const doCall = function(autoAttemptRefresh)
            {
                const successHandler = function(response)
                {
                    options.success(response);
                };

                const failureHandler = function(http, xhr)
                {
                    if (autoAttemptRefresh)
                    {
                        // there are a few good reasons why this might naturally fail
                        //
                        // 1.  our access token is invalid, has expired or has been forcefully invalidated on the Cloud CMS server
                        //     in this case, we get back a 200 and something like http.text =
                        //     {"error":"invalid_token","error_description":"Invalid access token: blahblahblah"}
                        //
                        // 2.  the access token no longer permits access to the resource
                        //     in this case, we get back a 401
                        //     it might not make much sense to re-request a new access token, but we do just in case.

                        let notJson = false;
                        let isInvalidToken = false;
                        if (http.text)
                        {
                            let responseData = {};

                            // catch if http.text is not JSON
                            try
                            {
                                responseData = JSON.parse(http.text);
                            }
                            catch (e)
                            {
                                console.log("Error response is not json");
                                console.log(e);
                                console.log(http.text);
                                notJson = true;
                            }

                            if (responseData.error)
                            {
                                if (responseData.error === "invalid_token")
                                {
                                    isInvalidToken = true;
                                }
                            }
                        }
                        const is401 = (http.code === 401);
                        const is400 = (http.code === 400);
                        const is403 = (http.code === 403);
                        const isTimeout = http.timeout;

                        // handle both cases
                        if (is401 || is400 || is403 || isInvalidToken || (notJson && !isTimeout))
                        {
                            if (self.refreshToken())
                            {
                                // use the refresh token to acquire a new access token
                                doRefreshAccessToken(function() {

                                    // success, got a new access token

                                    doCall(false);

                                }, function() {

                                    // failure, nothing else we can do
                                    // call into intended failure handler with the original failure http object
                                    options.failure(http, xhr);
                                });
                            }
                            else
                            {
                                // fail case - nothing we can do
                                options.failure(http, xhr);
                            }
                        }
                        else
                        {
                            // some other kind of error
                            options.failure(http, xhr);
                        }
                    }
                    else
                    {
                        // we aren't allowed to automatically attempt to get a new token via refresh token
                        options.failure(http, xhr);
                    }
                };

                // call through to the protected resource (with custom success/failure handling)
                const o = {};
                Gitana.copyInto(o, options);
                o.success = successHandler;
                o.failure = failureHandler;
                if (!o.headers)
                {
                    o.headers = {};
                }
                if (!self.cookieMode && !self.ticketMode)
                {
                    o.headers["Authorization"] = self.getBearerAuthorizationHeader();
                }
                if (self.ticketMode)
                {
                    o.headers["GITANA_TICKET"] = encodeURIComponent(self.ticketMode);
                }
                o.url = self.getPrefixedURL(o.url);

                // make the call
                self.invoke(o);
            };

            // if we have an access token and it's about to expire (within 20 seconds of it's expiry),
            // we force an early refresh of the access token so that concurrent requests don't get access problems
            // this is important for any browser-originated requests that rely on a persisted cookie (GITANA_TICKET)
            //
            // also provide some debugging if needed
            let forceRefresh = false;
            if (self.accessToken())
            {
                const grantTime = self.grantTime();
                if (grantTime)
                {
                    const expiresIn = self.expiresIn();
                    if (expiresIn)
                    {
                        // NOTE: expiresIn is in seconds
                        const expirationTimeMs = self.grantTime() + (self.expiresIn() * 1000);
                        const nowTimeMs = new Date().getTime();

                        const timeRemainingMs = expirationTimeMs - nowTimeMs;
                        if (timeRemainingMs <= 0)
                        {
                            // console.log("Access Token is expired, refresh will be attempted!");
                        }
                        else
                        {
                            // console.log("Access Token Time Remaining: " + timeRemainingMs);
                        }

                        if (timeRemainingMs <= 20000)
                        {
                            // console.log("Access Token only has 20 seconds left, forcing early refresh");
                            forceRefresh = true;
                        }
                    }
                }
            }

            // if no access token, request one
            if ((!self.accessToken() || forceRefresh) && !this.cookieMode && !this.ticketMode)
            {
                if (!self.refreshToken())
                {
                    // no refresh token, do an authorization call
                    doGetAccessToken(function() {

                        // got an access token, so proceed
                        doCall(true);

                    }, function(http, xhr) {

                        // access denied
                        options.failure(http, xhr);

                    });
                }
                else
                {
                    // we have a refresh token, so do a refresh call
                    doRefreshAccessToken(function() {

                        // got an access token, so proceed
                        doCall(true);

                    }, function(http, xhr) {

                        // unable to get an access token
                        options.failure(http, xhr);

                    });
                }
            }
            else
            {
                // we already have an access token
                doCall(true);
            }
        },

        /**
         * Refreshes the OAuth2 access token.
         */
        refresh: function(callback)
        {
            const self = this;

            const currentRefreshToken = self.refreshToken();
            if (!currentRefreshToken)
            {
                return callback({
                    "message": "The driver does not have a refresh token, cannot refresh"
                });
            }

            const onSuccess = function(response)
            {
                const object = JSON.parse(response.text);
                if (object["error"])
                {
                    self.error = object["error"];
                    self.errorDescription = object["error_description"];
                    self.errorUri = object["error_uri"];

                    return callback({
                        "error": self.error,
                        "message": self.errorDescription
                    });
                }
                else
                {
                    const _accessToken = object["access_token"];
                    const _refreshToken = object["refresh_token"];
                    const _expiresIn = object["expires_in"];
                    //self.grantedScope = object["scope"]; // this doesn't come back on refresh, assumed the same
                    const _grantTime = new Date().getTime();
                    const _grantedScope = self.grantedScope();

                    // store into persistent storage
                    self.clearStorage();
                    self.accessToken(_accessToken);
                    self.refreshToken(_refreshToken);
                    self.expiresIn(_expiresIn);
                    self.grantedScope(_grantedScope);
                    self.grantTime(_grantTime);

                    callback();
                }
            };

            const onFailure = function(http, xhr)
            {
                if (Gitana.REFRESH_TOKEN_FAILURE_FN)
                {
                    Gitana.REFRESH_TOKEN_FAILURE_FN(self, http, xhr);
                }

                // clear storage
                self.clearStorage();

                callback({
                    "message": "Unable to refresh access token"
                });
            };

            const o = {
                success: onSuccess,
                failure: onFailure,
                headers: {
                    "Authorization": self.getClientAuthorizationHeader()
                },
                url: self.getPrefixedTokenURL(),
                method: Gitana.OAuth2Http.TOKEN_METHOD
            };

            // query string
            const qs = {};

            // ticket max age
            if (self.ticketMaxAge)
            {
                qs["ticketMaxAge"] = self.ticketMaxAge;
            }

            // if we're POSTing, do so as application/x-www-form-urlencoded to make secure over the wire
            if ("post" === Gitana.OAuth2Http.TOKEN_METHOD.toLowerCase())
            {
                o.headers["Content-Type"] = "application/x-www-form-urlencoded";

                // url encoded data
                const urlEncodedTokens = {};
                urlEncodedTokens["grant_type"] = "refresh_token";
                urlEncodedTokens["refresh_token"] = self.refreshToken();
                if (self.requestedScope)
                {
                    urlEncodedTokens["scope"] = self.requestedScope;
                }
                o.data = "" + Gitana.Http.toQueryString(urlEncodedTokens);
            }
            else
            {
                qs["grant_type"] = "refresh_token";
                qs["refresh_token"] = self.refreshToken();
                if (self.requestedScope)
                {
                    qs["scope"] = self.requestedScope;
                }
            }

            // append into query string
            const queryString = Gitana.Http.toQueryString(qs);
            if (queryString)
            {
                if (o.url.indexOf("?") > -1)
                {
                    o.url = o.url + "&" + queryString;
                }
                else
                {
                    o.url = o.url + "?" + queryString;
                }
            }

            self.invoke(o);
        }

    });

    /**
     * Provides a storage location for OAuth2 credentials
     *
     * @param scope
     *
     * @return storage instance
     * @constructor
     */
    Gitana.OAuth2Http.Storage = function(scope)
    {
        // in-memory implementation of HTML5 storage interface
        const memoryStorage = function() {

            const memory = {};

            const m = {};
            m.removeItem = function(key)
            {
                delete memory[key];
            };

            m.getItem = function(key)
            {
                return memory[key];
            };

            m.setItem = function(key, value)
            {
                memory[key] = value;
            };

            return m;
        }();

        /**
         * Determines whether the current runtime environment supports HTML5 local storage
         *
         * @return {Boolean}
         */
        const supportsLocalStorage = function()
        {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        };

        /**
         * Determines whether the current runtime environment supports HTML5 session storage.
         *
         * @return {Boolean}
         */
        const supportsSessionStorage = function()
        {
            try {
                return 'sessionStorage' in window && window['sessionStorage'] !== null;
            } catch (e) {
                return false;
            }
        };

        const acquireStorage = function()
        {
            let storage = null;

            // store
            if (scope === "session" && supportsSessionStorage())
            {
                storage = sessionStorage;
            }
            else if (scope === "local" && supportsLocalStorage())
            {
                storage = localStorage;
            }
            else
            {
                // fall back to memory-based storage
                storage = memoryStorage;
            }

            return storage;
        };

        // result object
        const r = {};

        /**
         * Clears state.
         */
        r.clear = function()
        {
            // we first set to empty to account for a bug in Chrome
            // this bug is with the removeItem method where it sometimes doesn't work, so force to empty to handle worst case
            // https://bugs.chromium.org/p/chromium/issues/detail?id=765524
            acquireStorage().setItem("gitanaAuthState", "");

            // now do the actual remove
            acquireStorage().removeItem("gitanaAuthState");
        };

        /**
         * Pokes and peeks the value of a key in the state.
         *
         * @param key
         * @param value
         *
         * @return {*}
         */
        r.poke = function(key, value)
        {
            let state = {};

            const stateString = acquireStorage().getItem("gitanaAuthState");
            if (stateString && stateString !== "") {
                state = JSON.parse(stateString);
            }

            let touch = false;
            if (typeof(value) !== "undefined" && value !== null)
            {
                state[key] = value;
                touch = true;
            }
            else if (value === null)
            {
                delete state[key];
                touch = true;
            }

            if (touch) {
                acquireStorage().setItem("gitanaAuthState", JSON.stringify(state));
            }

            return state[key];
        };

        return r;
    };

}(this));

// statics
Gitana.OAuth2Http.PASSWORD = "password";
Gitana.OAuth2Http.AUTHORIZATION_CODE = "authorization_code";
Gitana.OAuth2Http.TOKEN = "token";
Gitana.OAuth2Http.COOKIE = "cookie";
Gitana.OAuth2Http.TICKET = "ticket";

// method to use for retrieving access and refresh tokens
//Gitana.OAuth2Http.TOKEN_METHOD = "GET";
Gitana.OAuth2Http.TOKEN_METHOD = "POST";



