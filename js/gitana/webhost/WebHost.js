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
            return this.getFactory().webHost(this.getPlatform(), this);
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
         * @param uri
         * @param applicationId
         * @param clientKey
         * @param [Object] object JSON object
         */
        createAutoClientMapping: function(uri, applicationId, clientKey, object)
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

            object["uri"] = uri;
            object["applicationId"] = applicationId;
            object["clientKey"] = clientKey;

            var chainable = this.getFactory().autoClientMapping(this);
            return this.chainCreate(chainable, object, this.getUri() + "/autoclientmappings");
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

            var chainable = this.getFactory().autoClientMappingMap(this);
            return this.chainGet(chainable, this.getUri() + "/autoclientmappings", params);
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
                return self.getUri() + "/autoclientmappings/" + autoClientMappingId
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
         * @chained auto client mappings map
         */
        listDeployedApplications: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().deployedApplicationMap(this);
            return this.chainGet(chainable, this.getUri() + "/applications", params);
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
            var chainable = this.getFactory().deployedApplication(this);
            return this.chainGet(chainable, this.getUri() + "/applications/" + deployedApplicationId);
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
        }

    });

})(window);
