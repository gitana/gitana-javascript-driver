(function(window)
{
    var Gitana = window.Gitana;
    
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
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = "Gitana.Registrar";

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
            return "registrar";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().registrar(this.getPlatform(), this.object);
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
         * @param [Object] pagination pagination (optional)
         */
        listTenants: function(pagination)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/tenants";
            };

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().tenantMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for a tenant.
         *
         * @chained tenant map
         *
         * @param {Object} query Query for finding a tenant.
         * @param [Object] pagination pagination (optional)
         */
        queryTenants: function(query, pagination)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/tenants/query";
            };

            var chainable = this.getFactory().tenantMap(this);

            // prepare params (with pagination)
            var params = {};
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/tenants/" + tenantId;
            };

            var chainable = this.getFactory().tenant(this);
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/tenants/lookup?id=" + principal.getDomainQualifiedId();
            };

            var chainable = this.getFactory().tenant(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a tenant
         *
         * @chained tenant
         *
         * @param {Gitana.DomainPrincipal} principal
         * @param {String} planKey
         */
        createTenant: function(principal, planKey)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/tenants";
            };

            // set up object
            var object = {};
            object["principalId"] = principal.getId();
            object["domainId"] = principal.getDomainId();
            object["planKey"] = planKey;

            // create
            var chainable = this.getFactory().tenant(this);
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Finds any tenants that have the given principal as a team member.
         *
         * @chained principal map
         *
         * @param {Gitana.DomainPrincipal} principal
         * @param [Pagination] pagination optional pagination
         */
        findTenantsWithPrincipalTeamMember: function(principal, pagination)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/tenants/withmember";
            };

            var chainable = this.getFactory().tenantMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            params["id"] = principal.getDomainQualifiedId();

            return this.chainPost(chainable, uriFunction, params);
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/tenants/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
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
         * @param [Object] pagination pagination (optional)
         */
        listPlans: function(pagination)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/plans";
            };

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().planMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for plans.
         *
         * @chained plan map
         *
         * @param {Object} query Query for finding a tenant.
         * @param [Object] pagination pagination (optional)
         */
        queryPlans: function(query, pagination)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/plans/query";
            };

            var chainable = this.getFactory().planMap(this);

            // prepare params (with pagination)
            var params = {};
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/plans/" + planId;
            };

            var chainable = this.getFactory().plan(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a plan
         *
         * @chained plan
         *
         * @param [Object] object JSON object
         */
        createPlan: function(object)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/plans";
            };

            var chainable = this.getFactory().plan(this);
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
        checkPlanPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/plans/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
            });
        }

    });

})(window);
