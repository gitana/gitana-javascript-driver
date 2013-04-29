(function(global)
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
            var self = this;

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
            var tokenURL = "/oauth/token";
            if (options.tokenURL)
            {
                tokenURL = options.tokenURL;
            }

            // base URL?
            var baseURL = null;
            if (options.baseURL)
            {
                baseURL = options.baseURL;
            }

            // client
            var clientKey = options.clientKey;
            var clientSecret = options.clientSecret;

            // authorization flow
            // if none specified, assume CODE
            this.authorizationFlow = options.authorizationFlow || Gitana.OAuth2Http.AUTHORIZATION_CODE;

            // optional
            if (options.requestedScope)
            {
                this.requestedScope = options.requestedScope;
            }

            if (this.authorizationFlow == Gitana.OAuth2Http.AUTHORIZATION_CODE)
            {
                this.code = options.code;
                this.redirectUri = options.redirectUri;
            }

            if (this.authorizationFlow == Gitana.OAuth2Http.PASSWORD)
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

            if (this.authorizationFlow == Gitana.OAuth2Http.COOKIE)
            {
                this.cookieMode = true;
            }

            if (this.authorizationFlow == Gitana.OAuth2Http.TICKET)
            {
                this.ticketMode = options.ticket;
            }


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
             * @param value [String] optional value
             */
            this.accessToken = function(value)
            {
                return storage.poke("accessToken", value);
            };

            /**
             * Gets or saves the refresh token
             *
             * @param value [String] optional value
             */
            this.refreshToken = function(value)
            {
                return storage.poke("refreshToken", value);
            };

            /**
             * Gets or saves the granted scope
             *
             * @param value [String] optional value
             */
            this.grantedScope = function(value)
            {
                return storage.poke("grantedScope", value);
            };

            /**
             * Gets or saves the expires in value
             *
             * @param value [String] optional value
             */
            this.expiresIn = function(value)
            {
                return storage.poke("expiresIn", value);
            };

            /**
             * Gets or saves the grant time
             *
             * @param value [String] optional value
             */
            this.grantTime = function(value)
            {
                return storage.poke("grantTime", value);
            };

            this.getClientAuthorizationHeader = function() {

                var basicString = clientKey + ":";
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
                var rebasedURL = url;
                if (baseURL && Gitana.startsWith(url, "/"))
                {
                    rebasedURL = baseURL + url;
                }

                return rebasedURL;
            };


            // if they initiatialized with an access token, clear and write into persisted state
            // unless they're continuing an existing token
            if (this.authorizationFlow == Gitana.OAuth2Http.TOKEN)
            {
                var existingAccessToken = this.accessToken();
                if (existingAccessToken != options.accessToken)
                {
                    storage.clear();
                }

                this.accessToken(existingAccessToken);
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
            var self = this;

            /**
             * Call over to Gitana and acquires an access token using flow authorization.
             *
             * @param success
             * @param failure
             */
            var doGetAccessToken = function(success, failure)
            {
                var onSuccess = function(response)
                {
                    var object = JSON.parse(response.text);
                    if (response["error"])
                    {
                        self.error = object["error"];
                        self.errorDescription = object["error_description"];
                        self.errorUri = object["error_uri"];
                    }
                    else
                    {
                        var _accessToken = object["access_token"];
                        var _refreshToken = object["refresh_token"];
                        var _expiresIn = object["expires_in"];
                        var _grantedScope = object["scope"];
                        var _grantTime = new Date().getTime();

                        // store into persistent storage
                        self.clearStorage();
                        self.accessToken(_accessToken);
                        self.refreshToken(_refreshToken);
                        self.expiresIn(_expiresIn);
                        self.grantedScope(_grantedScope);
                        self.grantTime(_grantTime);
                    }

                    success();
                };

                var o = {
                    success: onSuccess,
                    failure: failure,
                    headers: {
                        "Authorization": self.getClientAuthorizationHeader()
                    },
                    url: self.getPrefixedTokenURL()
                };

                var queryString = "grant_type=" + Gitana.Http.URLEncode(self.authorizationFlow);
                if (self.requestedScope)
                {
                    queryString += "&scope=" + Gitana.Http.URLEncode(self.requestedScope);
                }

                // separate configurations per flow
                if (self.authorizationFlow == Gitana.OAuth2Http.AUTHORIZATION_CODE)
                {
                    queryString += "&code=" + Gitana.Http.URLEncode(self.code);
                    if (self.redirectUri)
                    {
                        queryString += "&redirect_uri=" + Gitana.Http.URLEncode(self.redirectUri);
                    }
                }
                else if (self.authorizationFlow == Gitana.OAuth2Http.PASSWORD)
                {
                    queryString += "&username=" + Gitana.Http.URLEncode(self.username);
                    if (self.password)
                    {
                        queryString += "&password=" + Gitana.Http.URLEncode(self.password);
                    }
                }

                // append into query string
                if (o.url.indexOf("?") > -1)
                {
                    o.url = o.url + "&" + queryString;
                }
                else
                {
                    o.url = o.url + "?" + queryString;
                }

                self.invoke(o);
            };

            /**
             * Calls over to Gitana and acquires an access token using an existing refresh token.
             *
             * @param success
             * @param failure
             */
            var doRefreshAccessToken = function(success, failure)
            {
                var onSuccess = function(response)
                {
                    var object = JSON.parse(response.text);
                    if (response["error"])
                    {
                        self.error = object["error"];
                        self.errorDescription = object["error_description"];
                        self.errorUri = object["error_uri"];
                    }
                    else
                    {
                        var _accessToken = object["access_token"];
                        var _refreshToken = object["refresh_token"];
                        var _expiresIn = object["expires_in"];
                        //self.grantedScope = object["scope"]; // this doesn't come back on refresh, assumed the same
                        var _grantTime = new Date().getTime();
                        var _grantedScope = self.grantedScope();

                        // store into persistent storage
                        self.clearStorage();
                        self.accessToken(_accessToken);
                        self.refreshToken(_refreshToken);
                        self.expiresIn(_expiresIn);
                        self.grantedScope(_grantedScope);
                        self.grantTime(_grantTime);
                    }

                    success();
                };

                var o = {
                    success: onSuccess,
                    failure: failure,
                    headers: {
                        "Authorization": self.getClientAuthorizationHeader()
                    },
                    url: self.getPrefixedTokenURL()
                };

                var queryString = "grant_type=refresh_token&refresh_token=" + self.refreshToken();
                if (self.requestedScope)
                {
                    queryString += "&scope=" + Gitana.Http.URLEncode(self.requestedScope);
                }

                // append into query string
                if (o.url.indexOf("?") > -1)
                {
                    o.url = o.url + "&" + queryString;
                }
                else
                {
                    o.url = o.url + "?" + queryString;
                }

                self.invoke(o);
            };

            var doCall = function(autoAttemptRefresh)
            {
                var successHandler = function(response)
                {
                    options.success(response);
                };

                var failureHandler = function(http, xhr)
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

                        var isError = false;
                        if (http.text) {
                            console.log("Received failure text: " + http.text);

                            var responseData = JSON.parse(http.text);
                            if (responseData.error)
                            {
                                isError = true;
                            }
                        }
                        var is401 = (http.code == 401);

                        // handle both cases
                        if (isError || is401)
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
                var o = {};
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


            // if no access token, request one
            if (!self.accessToken() && !this.cookieMode && !this.ticketMode)
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
            var self = this;

            var onSuccess = function(response)
            {
                var object = JSON.parse(response.text);
                if (response["error"])
                {
                    self.error = object["error"];
                    self.errorDescription = object["error_description"];
                    self.errorUri = object["error_uri"];
                }
                else
                {
                    var _accessToken = object["access_token"];
                    var _refreshToken = object["refresh_token"];
                    var _expiresIn = object["expires_in"];
                    //self.grantedScope = object["scope"]; // this doesn't come back on refresh, assumed the same
                    var _grantTime = new Date().getTime();
                    var _grantedScope = self.grantedScope();

                    // store into persistent storage
                    self.clearStorage();
                    self.accessToken(_accessToken);
                    self.refreshToken(_refreshToken);
                    self.expiresIn(_expiresIn);
                    self.grantedScope(_grantedScope);
                    self.grantTime(_grantTime);
                }

                callback();
            };

            var onFailure = function(http, xhr)
            {
                callback({
                    "message": "Unable to refresh access token"
                });
            };

            var o = {
                success: onSuccess,
                failure: onFailure,
                headers: {
                    "Authorization": self.getClientAuthorizationHeader()
                },
                url: self.getPrefixedTokenURL()
            };

            var queryString = "grant_type=refresh_token&refresh_token=" + self.refreshToken();
            if (self.requestedScope)
            {
                queryString += "&scope=" + Gitana.Http.URLEncode(self.requestedScope);
            }

            // append into query string
            if (o.url.indexOf("?") > -1)
            {
                o.url = o.url + "&" + queryString;
            }
            else
            {
                o.url = o.url + "?" + queryString;
            }

            self.invoke(o);
        }
    });

    /**
     * Provides a storage location for OAuth2 credentials
     *
     * @param type
     * @param scope
     *
     * @return storage instance
     * @constructor
     */
    Gitana.OAuth2Http.Storage = function(scope)
    {
        // in-memory implementation of HTML5 storage interface
        var memoryStorage = function() {

            var memory = {};

            var m = {};
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
        var supportsLocalStorage = function()
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
        var supportsSessionStorage = function()
        {
            try {
                return 'sessionStorage' in window && window['sessionStorage'] !== null;
            } catch (e) {
                return false;
            }
        };

        var acquireStorage = function()
        {
            var storage = null;

            // store
            if (scope == "session" && supportsSessionStorage())
            {
                storage = sessionStorage;
            }
            else if (scope == "local" && supportsLocalStorage())
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
        var r = {};

        /**
         * Clears state.
         */
        r.clear = function()
        {
            acquireStorage().removeItem("gitanaAuthState");
        };

        /**
         * Pokes and peeks the value of a key in the state.
         *
         * @param key
         * @param value
         * @return {*}
         */
        r.poke = function(key, value)
        {
            var state = {};

            var stateString = acquireStorage().getItem("gitanaAuthState");
            if (stateString) {
                state = JSON.parse(stateString);
            }

            var touch = false;
            if (value)
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



