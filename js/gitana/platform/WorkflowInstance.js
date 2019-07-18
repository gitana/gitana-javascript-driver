(function(window)
{
    Gitana = window.Gitana;

    Gitana.WorkflowInstance = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.WorkflowInstance.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class WorkflowInstance
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.WorkflowInstance"; };

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
            return Gitana.TypedIDConstants.TYPE_WORKFLOW_INSTANCE;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/workflow/instances/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().workflowInstance(this.getPlatform(), this);
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

        /**
         * Starts the workflow.  The workflow can only be started once.  If already started,
         * an error will be thrown.
         *
         * @param {Object} data
         *
         * @returns {*}
         */
        start: function(data)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/start";
            };

            return this.chainPost(this, uriFunction, {}, data);
        },

        /**
         * Terminates the workflow.  A workflow can only be terminated once.  If already terminated,
         * an error will be thrown.
         *
         * @returns {*}
         */
        terminate: function()
        {
            const uriFunction = function()
            {
                return this.getUri() + "/terminate";
            };

            return this.chainPostResponse(this, uriFunction);
        },

        /**
         * Suspends the workflow.
         *
         * @returns {*}
         */
        suspend: function()
        {
            const uriFunction = function()
            {
                return this.getUri() + "/suspend";
            };

            return this.chainPostResponse(this, uriFunction);
        },

        /**
         * Resumes the workflow.
         *
         * @returns {*}
         */
        resume: function()
        {
            const uriFunction = function()
            {
                return this.getUri() + "/resume";
            };

            return this.chainPostResponse(this, uriFunction);
        },

        /**
         * Upgrades the model for this workflow.
         *
         * @returns {*}
         */
        upgradeModel: function(newModel, newModelVersion)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/upgrade";
            };

            const params = {
                "id": newModel,
                "version": newModelVersion
            };

            return this.chainPost(this, uriFunction, params);
        }

    });

})(window);
