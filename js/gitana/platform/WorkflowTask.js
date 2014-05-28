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

                return this.getUri() + "/resources/" + resourceId + "/remove"
            };

            return this.chainPostResponse(this, uriFunction);
        }

    });

})(window);
