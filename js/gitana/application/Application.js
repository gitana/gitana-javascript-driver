(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Application = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.Application.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Application
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = "Gitana.Application";

            this.base(platform, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/applications/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_APPLICATION;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().application(this.getPlatform(), this.object);
        },

        /**
         * Lists the auto-client mappings maintained for this application.
         *
         * @param callback the callback function
         * @param pagination
         *
         * @chained this
         */
        listAutoClientMappingObjects: function(callback, pagination)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/autoclientmappings";
            };

            // parameters
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback.call(this, response["rows"]);
            });
        },

        

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // SETTINGS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create settings
         *
         * @chained settings
         *
         * @param [Object] object JSON object
         */
        createSettings: function(object)
        {
            // Makes sure we have an empty settings key
            if (object["settings"] == null)
            {
                object["settings"] = {};
            }
            var chainable = this.getFactory().settings(this);
            return this.chainCreate(chainable, object, this.getUri() + "/settings");
        },

        /**
         * Lists the settings.
         *
         * @param pagination
         *
         * @chained settings map
         */
        listSettings: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().settingsMap(this);
            return this.chainGet(chainable, this.getUri() + "/settings", params);
        },

        /**
         * Reads an setting.
         *
         * @param settingId
         *
         * @chained settings
         */
        readSettings: function(settingId)
        {
            var chainable = this.getFactory().settings(this);
            return this.chainGet(chainable, this.getUri() + "/settings/" + settingId);
        },

        /**
         * Queries for settings.
         *
         * @chained settings map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        querySettings: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/settings/query";
            };

            var chainable = this.getFactory().settingsMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Reads the application settings for the given scope and key.
         * If the settings doesn't exist, creates an empty one.
         *
         * @param {String } scope (optional)
         * @param {String) key (optional)
         */
        readApplicationSettings: function(scope,  key)
        {
            var self = this;

            if (scope == null)
            {
                scope = "application";
            }

            if (key == null)
            {
                key = "application";
            }

            var object = {
                "scope" : scope,
                "key" : key
            };

            var settings = new Gitana.Settings(this,object);

            var result = this.subchain(settings);
            result.subchain().then(function() {

                var chain = this;
                var driver = self.getDriver();
                var createUri = self.getUri() + "/settings";
                var queryUri = self.getUri()  + "/settings/query";

                driver.gitanaPost(queryUri, {}, object, function(response) {
                    var settings = new Gitana.SettingsMap(self);
                    settings.handleResponse(response);
                    if (settings.keys.length > 0)
                    {
                        var obj = settings.map[settings.keys[0]];
                        result.loadFrom(obj);
                        chain.next();
                    }
                    else
                    {
                        object["settings"] = {};
                        driver.gitanaPost(createUri, null, object, function(status) {
                            driver.gitanaGet(createUri + "/" + status.getId(), null, function(response) {
                                chain.handleResponse(response);
                                chain.next();
                            }, function(http) {
                                self.httpError(http);
                            });
                        }, function(http) {
                            self.httpError(http);
                        });
                    }
                }, function(http) {
                    self.httpError(http);
                });

                return false;
            });

            return result;
        },

        /**
         * Reads the principal settings. It takes either a single Gitana.DomainPrincipal parameter
         * or a domain Id parameter and a principal Id parameter.
         */
        readApplicationPrincipalSettings: function()
        {
            var args = Gitana.makeArray(arguments);

            if (args.length == 1)
            {
                var principal = args.shift();
                return this.readApplicationSettings("principal", principal.getDomainQualifiedId());
            }
            else if (args.length == 2)
            {
                var domainId = args.shift();
                var principalId = args.shift();
                return this.readApplicationSettings("principal", domainId + "/" + principalId);
            }

        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type settings.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkSettingPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/settings/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // REGISTRATIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create registration
         *
         * @chained registration
         *
         * @param [Object] object JSON object
         */
        createRegistration: function(object)
        {
            var chainable = this.getFactory().registration(this);

            return this.chainCreate(chainable, object, this.getUri() + "/registrations");
        },

        /**
         * Lists the registrations.
         *
         * @param pagination
         *
         * @chained registration map
         */
        listRegistrations: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().registrationMap(this);
            return this.chainGet(chainable, this.getUri() + "/registrations", params);
        },

        /**
         * Reads a registration.
         *
         * @param registrationId
         *
         * @chained registration
         */
        readRegistration: function(registrationId)
        {
            var chainable = this.getFactory().registration(this);

            return this.chainGet(chainable, this.getUri() + "/registrations/" + registrationId);
        },

        /**
         * Queries for registrations.
         *
         * @chained registration map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryRegistrations: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/registrations/query";
            };

            var chainable = this.getFactory().registrationMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type registration.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkRegistrationPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/registrations/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // EMAIL PROVIDERS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create email provider
         *
         * @chained email provider
         *
         * @param [Object] object JSON object
         */
        createEmailProvider: function(object)
        {
            var chainable = this.getFactory().emailProvider(this);

            return this.chainCreate(chainable, object, this.getUri() + "/emailproviders");
        },

        /**
         * Lists the email providers.
         *
         * @param pagination
         *
         * @chained email provider map
         */
        listEmailProviders: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().emailProviderMap(this);
            return this.chainGet(chainable, this.getUri() + "/emailproviders", params);
        },

        /**
         * Reads an email provider.
         *
         * @param emailProviderId
         *
         * @chained emailProvider
         */
        readEmailProvider: function(emailProviderId)
        {
            var chainable = this.getFactory().emailProvider(this);

            return this.chainGet(chainable, this.getUri() + "/emailproviders/" + emailId);
        },

        /**
         * Queries for email providers.
         *
         * @chained email provider map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryEmailProviders: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/emailproviders/query";
            };

            var chainable = this.getFactory().emailProviderMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type emailprovider.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkEmailProviderPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/emailproviders/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },






        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // EMAILS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create email
         *
         * @chained email
         *
         * @param [Object] object JSON object
         */
        createEmail: function(object)
        {
            var chainable = this.getFactory().email(this);

            return this.chainCreate(chainable, object, this.getUri() + "/emails");
        },

        /**
         * Lists the emails.
         *
         * @param pagination
         *
         * @chained email map
         */
        listEmails: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().emailMap(this);
            return this.chainGet(chainable, this.getUri() + "/emails", params);
        },

        /**
         * Reads an email.
         *
         * @param emailId
         *
         * @chained email
         */
        readEmail: function(emailId)
        {
            var chainable = this.getFactory().email(this);

            return this.chainGet(chainable, this.getUri() + "/emails/" + emailId);
        },

        /**
         * Queries for emails.
         *
         * @chained email map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryEmails: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/emails/query";
            };

            var chainable = this.getFactory().emailMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type email.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkEmailPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/emails/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        }
    });

})(window);
