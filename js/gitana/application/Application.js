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
            this.objectType = function() { return "Gitana.Application"; };

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
            return this.getFactory().application(this.getPlatform(), this);
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

        /**
         * Lists the trusted domain mappings maintained for this application.
         *
         * @param callback the callback function
         * @param pagination
         *
         * @chained this
         */
        listTrustedDomainMappingObjects: function(callback, pagination)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/trusteddomainmappings";
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
            var self = this;

            // Makes sure we have an empty settings key
            if (object["settings"] == null)
            {
                object["settings"] = {};
            }

            var uriFunction = function()
            {
                return self.getUri() + "/settings";
            };

            var chainable = this.getFactory().settings(this);
            return this.chainCreate(chainable, object, uriFunction);
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
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/settings";
            };

            var chainable = this.getFactory().settingsMap(this);
            return this.chainGet(chainable, uriFunction, params);
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/settings/" + settingId;
            };

            var chainable = this.getFactory().settings(this);
            return this.chainGet(chainable, uriFunction);
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
         * @param {String} scope (optional)
         * @param {String} key (optional)
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

            var result = this.subchain(new Gitana.Settings(this, object));
            return result.then(function() {

                var chain = this;
                var driver = self.getDriver();
                var createUri = self.getUri() + "/settings";
                var queryUri = self.getUri()  + "/settings/query";

                driver.gitanaPost(queryUri, {}, object, function(response) {
                    var settings = new Gitana.SettingsMap(self);
                    settings.handleResponse(response);
                    if (settings.__keys().length > 0)
                    {
                        var obj = settings[settings.__keys()[0]];
                        chain.loadFrom(obj);
                        chain.next();
                    }
                    else
                    {
                        object["settings"] = {};
                        driver.gitanaPost(createUri, null, object, function(status) {
                            driver.gitanaGet(createUri + "/" + status.getId(), null, {}, function(response) {
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
            var self = this;

            var chainable = this.getFactory().registration(this);

            var uriFunction = function()
            {
                return self.getUri() + "/registrations";
            };

            return this.chainCreate(chainable, object, uriFunction);
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
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/registrations";
            };

            var chainable = this.getFactory().registrationMap(this);
            return this.chainGet(chainable, uriFunction, params);
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
            var self = this;

            var chainable = this.getFactory().registration(this);

            var uriFunction = function()
            {
                return self.getUri() + "/registrations/" + registrationId;
            };

            return this.chainGet(chainable, uriFunction);
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
        // PAGE RENDITIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create page rendition
         *
         * @chained page rendition
         *
         * @param [Object] object JSON object
         */
        createPageRendition: function(object)
        {
            var self = this;

            var chainable = this.getFactory().pageRendition(this);

            var uriFunction = function()
            {
                return self.getUri() + "/pagerenditions";
            };

            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Lists the page renditions.
         *
         * @param pagination
         *
         * @chained page rendition map
         */
        listPageRenditions: function(pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/pagerenditions";
            };

            var chainable = this.getFactory().registrationMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a page rendition.
         *
         * @param pageRenditionIdOrKey
         *
         * @chained registration
         */
        readPageRendition: function(pageRenditionIdOrKey)
        {
            var self = this;

            var chainable = this.getFactory().pageRendition(this);

            var uriFunction = function()
            {
                return self.getUri() + "/pagerenditions/" + pageRenditionIdOrKey;
            };

            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Queries for page renditions.
         *
         * @chained page rendition map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryPageRenditions: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/pagerenditions/query";
            };

            var chainable = this.getFactory().pageRenditionMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type page rendition.
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
        checkPageRenditionPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/pagerenditions/permissions/check";
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
            var self = this;

            var chainable = this.getFactory().emailProvider(this);

            var uriFunction = function()
            {
                return self.getUri() + "/emailproviders";
            };

            return this.chainCreate(chainable, object, uriFunction);
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
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/emailproviders";
            };

            var chainable = this.getFactory().emailProviderMap(this);
            return this.chainGet(chainable, uriFunction, params);
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
            var self = this;

            var chainable = this.getFactory().emailProvider(this);

            var uriFunction = function()
            {
                return self.getUri() + "/emailproviders/" + emailProviderId;
            };

            return this.chainGet(chainable, uriFunction);
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
            var self = this;

            var chainable = this.getFactory().email(this);

            var uriFunction = function()
            {
                return self.getUri() + "/emails";
            };

            return this.chainCreate(chainable, object, uriFunction);
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
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/emails";
            };

            var chainable = this.getFactory().emailMap(this);
            return this.chainGet(chainable, uriFunction, params);
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
            var self = this;

            var chainable = this.getFactory().email(this);

            var uriFunction = function()
            {
                return self.getUri() + "/emails/" + emailId;
            };

            return this.chainGet(chainable, uriFunction);
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
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // DEPLOYMENT
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Deploys the application to the environment described by the deployment key.
         *
         * @chained deployed application
         *
         * @param deploymentKey
         */
        deploy: function(deploymentKey)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/deploy/" + deploymentKey;
            };

            // temp web host
            var webhost = new Gitana.WebHost(this.getPlatform());

            // we hand back a deployed application and preload some work
            var chainable = this.getFactory().deployedApplication(webhost);
            return this.chainPost(chainable, uriFunction).then(function() {

                // load the real web host
                var webhostId = self["deployments"][deploymentKey]["webhost"];
                this.subchain(this.getPlatform()).readWebHost(webhostId).then(function() {
                    webhost.loadFrom(this);
                });

            });
        },

        /**
         * Undeploys the application from the environment described by the deployment key.
         *
         * @chained application
         *
         * @param deploymentKey
         */
        undeploy: function(deploymentKey)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/undeploy/" + deploymentKey;
            };

            return this.chainPost(this, uriFunction);
        },

        /**
         * Finds the deployed application instance for a given target deployment key.
         *
         * @chained deployed application
         *
         * @param deploymentKey
         */
        findDeployedApplication: function(deploymentKey)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/deployed/" + deploymentKey;
            };

            // temp web host
            var webhost = new Gitana.WebHost(this.getPlatform());

            // we hand back a deployed application and preload some work
            var chainable = this.getFactory().deployedApplication(webhost);
            return this.chainGet(chainable, uriFunction).then(function() {

                // load the real web host
                var webhostId = self["deployments"][deploymentKey]["webhost"];
                this.subchain(this.getPlatform()).readWebHost(webhostId).then(function() {
                    webhost.loadFrom(this);
                });

            });
        },

        /**
         * Retrieves information about a deployed application.
         *
         * @param deploymentKey
         */
        loadDeploymentInfo: function(deploymentKey, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/deployed/" + deploymentKey + "/info";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {
                callback(response.info);
            });
        },

        refreshDeploymentKeys: function(deploymentKey)
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/deployments/" + deploymentKey + "/refreshkeys";
                self.getDriver().gitanaPost(uri, null, {}, function(response) {
                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        }


    });

})(window);
