(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.Registrar = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.Registrar.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformDataStore
         *
         * @class Registrar
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.Registrar"; };

            this.base(platform, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/registrars/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_REGISTRAR;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().registrar(this.getPlatform(), this);
        },




        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // TENANTS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists all of the tenants.
         *
         * @chained tenant map
         *
         * @param {Object} pagination pagination (optional)
         */
        listTenants: function(pagination)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/tenants";
            };

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const chainable = this.getFactory().tenantMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for a tenant.
         *
         * @chained tenant map
         *
         * @param {Object} query Query for finding a tenant.
         * @param {Object} pagination pagination (optional)
         */
        queryTenants: function(query, pagination)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/tenants/query";
            };

            const chainable = this.getFactory().tenantMap(this);

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Reads a tenant.
         *
         * @chained tenant
         *
         * @param {String} tenantId the tenant id
         */
        readTenant: function(tenantId)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/tenants/" + tenantId;
            };

            const chainable = this.getFactory().tenant(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Lookup a tenant for a principal.
         *
         * @chained tenant
         *
         * @param {Gitana.Principal} principal
         */
        lookupTenantForPrincipal: function(principal)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/tenants/lookup?id=" + principal.getDomainQualifiedId();
            };

            const chainable = this.getFactory().tenant(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a tenant
         *
         * @chained tenant
         *
         * @param {Gitana.DomainPrincipal} principal
         * @param {String} planKey
         * @param {Object} paymentMethod method (required if plan requires a payment method)
         */
        createTenant: function(principal, planKey, paymentMethod)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/tenants";
            };

            // set up object
            const object = {};
            object["principalId"] = principal.getId();
            object["domainId"] = principal.getDomainId();
            object["planKey"] = planKey;
            if (paymentMethod)
            {
                object["paymentMethod"] = paymentMethod;
            }

            // create
            const chainable = this.getFactory().tenant(this);
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type tenant.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
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
        checkTenantPermissions: function(checks, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/tenants/permissions/check";
            };

            const object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type tenant.
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
        checkTenantAuthorities: function(checks, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/tenants/authorities/check";
            };

            const object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },





        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // PLANS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists all of the plans.
         *
         * @chained plan map
         *
         * @param {Object} pagination pagination (optional)
         */
        listPlans: function(pagination)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/plans";
            };

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const chainable = this.getFactory().planMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for plans.
         *
         * @chained plan map
         *
         * @param {Object} query Query for finding a tenant.
         * @param {Object} pagination pagination (optional)
         */
        queryPlans: function(query, pagination)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/plans/query";
            };

            const chainable = this.getFactory().planMap(this);

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Reads a plan.
         *
         * @chained plan
         *
         * @param {String} planId the plan id
         */
        readPlan: function(planId)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/plans/" + planId;
            };

            const chainable = this.getFactory().plan(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a plan
         *
         * @chained plan
         *
         * @param {Object} object JSON object
         */
        createPlan: function(object)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/plans";
            };

            const chainable = this.getFactory().plan(this);
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type plan.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
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
        checkPlanPermissions: function(checks, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/plans/permissions/check";
            };

            const object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type plan.
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
        checkPlanAuthorities: function(checks, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/plans/authorities/check";
            };

            const object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },




        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // METERS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists all of the meters.
         *
         * @chained meter map
         *
         * @param {Object} pagination pagination (optional)
         */
        listMeters: function(pagination)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/meters";
            };

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const chainable = this.getFactory().meterMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for meters.
         *
         * @chained meter map
         *
         * @param {Object} query Query for finding a tenant.
         * @param {Object} pagination pagination (optional)
         */
        queryMeters: function(query, pagination)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/meters/query";
            };

            const chainable = this.getFactory().meterMap(this);

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Reads a meter.
         *
         * @chained meter
         *
         * @param {String} meterId the meter id
         */
        readMeter: function(meterId)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/meters/" + meterId;
            };

            const chainable = this.getFactory().meter(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a meter
         *
         * @chained meter
         *
         * @param {Object} object JSON object
         */
        createMeter: function(object)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/meters";
            };

            const chainable = this.getFactory().meter(this);
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type meter.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
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
        checkMeterPermissions: function(checks, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/meters/permissions/check";
            };

            const object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type meter.
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
        checkMeterAuthorities: function(checks, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/meters/authorities/check";
            };

            const object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        }

    });

})(window);
