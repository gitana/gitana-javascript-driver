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
