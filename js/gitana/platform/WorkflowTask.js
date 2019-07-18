(function(window)
{
    Gitana = window.Gitana;

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
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.WorkflowTask"; };

            this.toReference = function(resource)
            {
                return resource.ref();
            };

            this.toResourceId = function(resourceOrResourceId)
            {
                let id = resourceOrResourceId;

                if (resourceOrResourceId && resourceOrResourceId.getId)
                {
                    id = resourceOrResourceId.getId();
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
            const uriFunction = function()
            {
                return this.getUri() + "/resources";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["rows"]);
            });
        },

        loadResource: function(id, callback)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/resources/" + id;
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response);
            });
        },

        addResource: function(resource)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/resources/add";
            };

            const reference = this.toReference(resource);

            const params = {
                "reference": reference
            };

            return this.chainPostResponse(this, uriFunction, params);
        },

        removeResource: function(resourceOrResourceId)
        {
            const uriFunction = function()
            {
                const resourceId = this.toResourceId(resourceOrResourceId);

                return this.getUri() + "/resources/" + resourceId + "/remove";
            };

            return this.chainPostResponse(this, uriFunction);
        },

        removeAllResources: function()
        {
            const uriFunction = function()
            {
                return this.getUri() + "/resources/removeall";
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
            const uriFunction = function()
            {
                return this.getUri() + "/claim";
            };

            const chainable = this.getFactory().workflowTask(this.getPlatform());
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
            const uriFunction = function()
            {
                return this.getUri() + "/unclaim";
            };

            const chainable = this.getFactory().workflowTask(this.getPlatform());
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
            const userDomainQualifiedId = this.extractPrincipalDomainQualifiedId(user);

            const uriFunction = function()
            {
                return this.getUri() + "/delegate";
            };

            const params = {
                "userId": userDomainQualifiedId
            };

            const chainable = this.getFactory().workflowTask(this.getPlatform());
            return this.chainPost(chainable, uriFunction, params, {});
        },

        /**
         * Acquires a list of delegates to whom the current task can be assigned.
         *
         * @chained principal map
         *
         * @param {Object} pagination pagination (optional)
         */
        listDelegates: function(pagination)
        {
            const self = this;

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/delegates";
            };

            // get to work
            const chainable = this.getFactory().domainPrincipalMap(this);

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
            const uriFunction = function()
            {
                return this.getUri() + "/complete";
            };

            const params = {
                "routeId": routeId
            };

            const chainable = this.getFactory().workflowTask(this.getPlatform());
            return this.chainPost(chainable, uriFunction, params, data);
        },

        /**
         * Moves this task.  This function requires the current user to have admin or manager rights over
         * the workflow instance.
         *
         * @param workflowNodeId the workflow model node id to move to next
         * @param data (optional)
         *
         * @chained next task
         *
         * @public
         */
        move: function(workflowNodeId, data)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/move";
            };

            const params = {
                "id": workflowNodeId
            };

            const chainable = this.getFactory().workflowTask(this.getPlatform());
            return this.chainPost(chainable, uriFunction, params, data);
        },

        loadRoutes: function(callback)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/routes";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["routes"]);
            });
        }

    });

})(window);
