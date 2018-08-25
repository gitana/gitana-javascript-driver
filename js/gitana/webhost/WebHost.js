(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.WebHost = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.WebHost.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class WebHost
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.WebHost"; };

            this.base(platform, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/webhosts/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_WEB_HOST;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().webhost(this.getPlatform(), this);
        },

        getUrlPatterns: function()
        {
            return this.get("urlPatterns");
        },
        

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // AUTO CLIENT MAPPINGS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create auto client mapping
         *
         * @chained auto client mapping
         *
         * @param host
         * @param applicationId
         * @param clientKey
         * @param authGrantKey
         * @param [Object] object JSON object
         */
        createAutoClientMapping: function(host, applicationId, clientKey, authGrantKey, object)
        {
            if (!object)
            {
                object = {};
            }

            if (!Gitana.isString(applicationId))
            {
                applicationId = applicationId.getId();
            }

            if (!Gitana.isString(clientKey))
            {
                clientKey = clientKey.getKey();
            }

            if (!Gitana.isString(authGrantKey))
            {
                authGrantKey = authGrantKey.getKey();
            }

            object["host"] = host;
            object["applicationId"] = applicationId;
            object["clientKey"] = clientKey;
            object["authGrantKey"] = authGrantKey;

            var uriFunction = function()
            {
                return "/webhosts/" + this.getId() + "/autoclientmappings";
            };

            var chainable = this.getFactory().autoClientMapping(this);
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Lists the auto client mappings.
         *
         * @param pagination
         *
         * @chained auto client mappings map
         */
        listAutoClientMappings: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/webhosts/" + this.getId() + "/autoclientmappings";
            };

            var chainable = this.getFactory().autoClientMappingMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads an auto client mapping.
         *
         * @param autoClientMappingId
         *
         * @chained auto client mapping
         */
        readAutoClientMapping: function(autoClientMappingId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/autoclientmappings/" + autoClientMappingId;
            };

            var chainable = this.getFactory().autoClientMapping(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Queries for auto client mappings.
         *
         * @chained auto client mappings map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryAutoClientMappings: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/autoclientmappings/query";
            };

            var chainable = this.getFactory().autoClientMappingMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type stack.
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
        checkAutoClientMappingsPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/autoclientmappings/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type stack.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkAutoClientMappingsAuthorities: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/autoclientmappings/authorities/check";
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
        // TRUSTED DOMAIN MAPPINGS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create trusted domain mapping
         *
         * @chained trusted domain mapping
         *
         * @param host
         * @param scope
         * @param platformId
         * @param [Object] object JSON object
         */
        createTrustedDomainMapping: function(host, scope, platformId, object)
        {
            if (!object)
            {
                object = {};
            }

            if (!Gitana.isString(platformId))
            {
                platformId = platformId.getId();
            }

            object["host"] = host;
            object["scope"] = scope;
            object["platformId"] = platformId;

            var uriFunction = function()
            {
                return "/webhosts/" + this.getId() + "/trusteddomainmappings";
            };

            var chainable = this.getFactory().trustedDomainMapping(this);
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Lists the trusted domain mappings.
         *
         * @param pagination
         *
         * @chained trusted domain mappings map
         */
        listTrustedDomainMappings: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/webhosts/" + this.getId() + "/trusteddomainmappings";
            };

            var chainable = this.getFactory().trustedDomainMappingMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a trusted domain mapping.
         *
         * @param trustedDomainMappingId
         *
         * @chained trusted domain mapping
         */
        readTrustedDomainMapping: function(trustedDomainMappingId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/trusteddomainmappings/" + trustedDomainMappingId;
            };

            var chainable = this.getFactory().trustedDomainMapping(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Queries for trusted domain mappings.
         *
         * @chained trusted domain mappings map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryTrustedDomainMappings: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/trusteddomainmappings/query";
            };

            var chainable = this.getFactory().trustedDomainMappingMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type stack.
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
        checkTrustedDomainMappingsPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/trusteddomainmappings/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type stack.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkTrustedDomainMappingsAuthorities: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/trusteddomainmappings/authorities/check";
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
        // DEPLOYED APPLICATIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the deployed applications.
         *
         * @param pagination
         *
         * @chained deployed application mappings map
         */
        listDeployedApplications: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/webhosts/" + this.getId() + "/applications";
            };

            var chainable = this.getFactory().deployedApplicationMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a deployed application.
         *
         * @param deployedApplicationId
         *
         * @chained deployed application
         */
        readDeployedApplication: function(deployedApplicationId)
        {
            var uriFunction = function()
            {
                return "/webhosts/" + this.getId() + "/applications/" + deployedApplicationId;
            };

            var chainable = this.getFactory().deployedApplication(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Queries for deployed applications
         *
         * @chained deployed applications map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryDeployedApplications: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/applications/query";
            };

            var chainable = this.getFactory().deployedApplicationMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type stack.
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
        checkDeployedApplicationsPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/applications/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type stack.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkDeployedApplicationsAuthorities: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/applications/authorities/check";
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
