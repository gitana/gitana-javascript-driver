(function(window)
{
    var Gitana = window.Gitana;

    Gitana.HasBehaviorAssociation = Gitana.Association.extend(
    /** @lends Gitana.HasBehaviorAssociation.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Association
         *
         * @class Has Behavior Association
         *
         * @param {Gitana.Branch} branch Gitana branch
         * @param {Object} object the JSON object
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);
        }
    });

    Gitana.NodeFactory.register("a:has_behavior", Gitana.HasBehaviorAssociation);

})(window);
