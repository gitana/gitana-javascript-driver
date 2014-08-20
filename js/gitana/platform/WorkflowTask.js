(function(window)
{
    var Gitana = window.Gitana;

    Gitana.WorkflowTask = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.WorkflowTask.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class WorkflowTask
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.WorkflowTask"; };

            this.toReference = function(resource)
            {
                return resource.ref();
            };

            this.toResourceId = function(resource)
            {
                var id = null;

                if (resource && resource.getId)
                {
                    id = resource.getId();
                }

                return id;
            };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_WORKFLOW_TASK;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/workflow/tasks/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().workflowTask(this.getPlatform(), this);
        },

        //////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACCESSORS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////

        loadResourceList: function(callback)
        {
            var uriFunction = function()
            {
                return this.getUri() + "/resources";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["rows"]);
            });
        },

        loadResource: function(id, callback)
        {
            var uriFunction = function()
            {
                return this.getUri() + "/resources/" + id;
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response);
            });
        },

        addResource: function(resource)
        {
            var uriFunction = function()
            {
                return this.getUri() + "/resources/add";
            };

            var reference = this.toReference(resource);

            var params = {
                "reference": reference
            };

            return this.chainPostResponse(this, uriFunction, params);
        },

        removeResource: function(resource)
        {
            var uriFunction = function()
            {
                var resourceId = this.toResourceId(resource);

                return this.getUri() + "/resources/" + resourceId + "/remove";
            };

            return this.chainPostResponse(this, uriFunction);
        },

        //////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DELEGATION
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Claims this task for the current user.
         *
         * @chained next task
         *
         * @public
         */
        claim: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/claim";
            };

            var chainable = this.getFactory().workflowTask(this.getPlatform());
            return this.chainPost(chainable, uriFunction, {}, {});
        },

        /**
         * Unclaims this task for the current user.
         *
         * @chained next task
         *
         * @public
         */
        unclaim: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/unclaim";
            };

            var chainable = this.getFactory().workflowTask(this.getPlatform());
            return this.chainPost(chainable, uriFunction, {}, {});
        },

        /**
         * Delegates this task from the current user to another user.
         *
         * @chained next task
         *
         * @param user
         *
         * @public
         */
        delegate: function(user)
        {
            var userDomainQualifiedId = this.extractPrincipalDomainQualifiedId(user);

            var uriFunction = function()
            {
                return this.getUri() + "/delegate";
            };

            var params = {
                "userId": userDomainQualifiedId
            };

            var chainable = this.getFactory().workflowTask(this.getPlatform());
            return this.chainPost(chainable, uriFunction, params, {});
        },

        /**
         * Acquires a list of delegates to whom the current task can be assigned.
         *
         * @chained principal map
         *
         * @param [Pagination] pagination pagination (optional)
         */
        listDelegates: function(pagination)
        {
            var self = this;

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/delegates";
            };

            // get to work
            var chainable = this.getFactory().domainPrincipalMap(this);

            // all groups
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Completes this task.
         *
         * @param routeId
         * @param data
         *
         * @chained next task
         *
         * @public
         */
        complete: function(routeId, data)
        {
            var uriFunction = function()
            {
                return this.getUri() + "/complete";
            };

            var params = {
                "routeId": routeId
            };

            var chainable = this.getFactory().workflowTask(this.getPlatform());
            return this.chainPost(chainable, uriFunction, params, data);
        },

        loadRoutes: function(callback)
        {
            var uriFunction = function()
            {
                return this.getUri() + "/routes";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["routes"]);
            });
        }

    });

})(window);
