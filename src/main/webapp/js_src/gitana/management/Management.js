(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Management = Gitana.DataStore.extend(
    /** @lends Gitana.Management.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.DataStore
         *
         * @class Management
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = "Gitana.Management";

            this.base(platform, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().management(this.getPlatform(), this.object);
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
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().tenantMap(this);
            return this.chainGet(chainable, "/tenants", params);
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
            var chainable = this.getFactory().tenantMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/tenants/query", params, query);
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
            var chainable = this.getFactory().tenant(this);
            return this.chainGet(chainable, "/tenants/" + tenantId);
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
            var chainable = this.getFactory().tenant(this);
            return this.chainGet(chainable, "/tenants/lookup?id=" + principal.getDomainQualifiedId());
        },

        /**
         * Creates a tenant
         *
         * @chained tenant
         *
         * @param {Gitana.DomainPrincipal} principal
         * @param [Object] object JSON object
         */
        createTenant: function(principal, object)
        {
            if (!object)
            {
                object = {};
            }

            // set principal
            object["principalId"] = principal.getId();
            object["domainId"] = principal.getDomainId();

            // create
            var chainable = this.getFactory().tenant(this);
            return this.chainCreate(chainable, object, "/tenants");
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
            var chainable = this.getFactory().tenantMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            params["id"] = principal.getDomainQualifiedId();

            return this.chainPost(chainable, "/tenants/withmember", params);
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
            var uriFunction = function()
            {
                return "/tenants/permissions/check";
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
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().planMap(this);
            return this.chainGet(chainable, "/plans", params);
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
            var chainable = this.getFactory().planMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/plans/query", params, query);
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
            var chainable = this.getFactory().plan(this);
            return this.chainGet(chainable, "/plans/" + planId);
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
            var chainable = this.getFactory().plan(this);
            return this.chainCreate(chainable, object, "/plans");
        }

    });

})(window);
