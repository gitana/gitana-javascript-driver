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
        constructor: function(options)
        {
            var self = this;

            // preset the access token state
            this.accessToken = null;
            this.refreshToken = null;
            this.grantedScope = null;
            this.expiresIn = null;
            this.grantTime = null;

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
            var clientId = options.clientId;
            var clientSecret = options.clientSecret;

            // authorization flow
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

            if (this.authorizationFlow == Gitana.OAuth2Http.TOKEN)
            {
                this.accessToken = options.accessToken;
            }

            this.getClientAuthorizationHeader = function() {

                var basicString = clientId + ":";
                if (clientSecret)
                {
                    basicString += clientSecret;
                }
                return "Basic " + Gitana.btoa(basicString);
            };

            this.getBearerAuthorizationHeader = function() {
                return "Bearer " + self.accessToken;
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
                        self.accessToken = object["access_token"];
                        self.refreshToken = object["refresh_token"];
                        self.expiresIn = object["expires_in"];
                        self.grantedScope = object["scope"];
                        self.grantTime = new Date().getTime();
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
                        self.accessToken = object["access_token"];
                        self.refreshToken = object["refresh_token"];
                        self.expiresIn = object["expires_in"];
                        self.grantedScope = object["scope"];
                        self.grantTime = new Date().getTime();
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
                        if (http.code == 401)
                        {
                            // if we caught a 401, it may be because the access token expired
                            // if we have a refresh token, get a new access token
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
                o.headers["Authorization"] = self.getBearerAuthorizationHeader();
                o.url = self.getPrefixedURL(o.url);

                // make the call
                self.invoke(o);
            };


            // if no access token, request one
            if (!self.accessToken)
            {
                if (!self.refreshToken)
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
        }
    });

}(this));

// statics
Gitana.OAuth2Http.PASSWORD = "password";
Gitana.OAuth2Http.AUTHORIZATION_CODE = "authorization_code";
Gitana.OAuth2Http.TOKEN = "token";



