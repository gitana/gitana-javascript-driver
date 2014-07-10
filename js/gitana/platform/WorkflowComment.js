(function(window)
{
    var Gitana = window.Gitana;

    Gitana.WorkflowComment = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.WorkflowComment.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class WorkflowComment
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.WorkflowComment"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_WORKFLOW_COMMENT;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/workflow/comments/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().workflowComment(this.getPlatform(), this);
        }

    });

})(window);
