(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AbstractClusterObject = Gitana.AbstractObject.extend(
    /** @lends Gitana.AbstractClusterObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class AbstractClusterObject
         *
         * @param {Gitana.Cluster} cluster
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(cluster, object)
        {
            this.base(cluster.getDriver(), object);

            this.objectType = function() { return "Gitana.Job"; };

            this.getCluster = function()
            {
                return cluster;
            };
        },

        /**
         * @OVERRIDE
         */
        ref: function()
        {
            return this.getType() + "://" + this.getId();
        }

    });

})(window);
