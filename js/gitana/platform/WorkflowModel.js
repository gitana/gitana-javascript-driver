(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.WorkflowModel = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.WorkflowModel.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class WorkflowModel
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.WorkflowModel"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_WORKFLOW_MODEL;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/workflow/models/" + this.id + "/versions/" + this.version;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().workflowModel(this.getPlatform(), this);
        },

        /**
         * Update the workflow model.
         *
         * @param [string] force whether to force the update if the model is already deployed
         *
         * @chained this
         *
         * @public
         */
        update: function(force)
        {
            var self = this;

            var params = {};

            if (force)
            {
                params.force = true;
            }

            var uriFunction = function()
            {
                return self.getUri();
            };

            return this.chainUpdate(null, uriFunction, params);
        },

        /**
         * Deploys this workflow model.
         *
         * @returns {*}
         */
        deploy: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/deploy";
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Undeploys this workflow model.
         *
         * @returns {*}
         */
        undeploy: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/undeploy";
            };

            return this.chainPostEmpty(null, uriFunction);
        }

    });

})(window);
