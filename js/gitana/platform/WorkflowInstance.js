(function(window)
{
    var Gitana = window.Gitana;
    
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
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.WorkflowInstance"; };

            this.toReference = function(resource)
            {
                var reference = null;

                if (resource.objectType() == "Gitana.Node")
                {
                    reference = "node://" + resource.getPlatformId() + "/" + resource.getRepositoryId() + "/" + resource.getBranchId() + "/" + resource.getId();
                }

                return reference;
            };

            this.toResourceId = function(resource)
            {
                var id = null;

                if (resource.objectType() == "Gitana.Node")
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

                return this.getUri() + "/resources/" + resourceId + "/remove"
            };

            return this.chainPostResponse(this, uriFunction);
        },

        /**
         * Starts the workflow.  The workflow can only be started once.  If already started,
         * an error will be thrown.
         *
         * @param [Object] data
         *
         * @returns {*}
         */
        start: function(data)
        {
            var uriFunction = function()
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
            var uriFunction = function()
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
            var uriFunction = function()
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
            var uriFunction = function()
            {
                return this.getUri() + "/resume";
            };

            return this.chainPostResponse(this, uriFunction);
        }

    });

})(window);
