(function(window)
{
    var Gitana = window.Gitana;

    Gitana.HasPermissionAssociation = Gitana.Association.extend(
    /** @lends Gitana.HasPermissionAssociation.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Association
         *
         * @class Has Permission Association
         *
         * @param {Gitana.Branch} branch Gitana branch
         * @param {Object} object the JSON object
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);
        },

        /**
         * Gets the operation described by this association.
         *
         * @public
         * 
         * @returns {String} operation string
         */
        getOperation: function()
        {
            return this["operation"];
        },

        /**
         * Sets the operation described by this association.
         *
         * @public
         *
         * @param operation
         */
        setOperation: function(operation)
        {
            this["operation"] = operation;
        }
    });

    Gitana.NodeFactory.register("a:has_permission", Gitana.HasPermissionAssociation);

})(window);
