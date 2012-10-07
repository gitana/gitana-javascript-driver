(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.JobMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.JobMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of jobs
         *
         * @param {Gitana.Cluster} cluster Gitana cluster instance.
         * @param [Object] object
         */
        constructor: function(cluster, object)
        {
            this.objectType = function() { return "Gitana.JobMap"; };

            this.getCluster = function()
            {
                return cluster;
            };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(cluster.getDriver(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().jobMap(this.getCluster(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().job(this.getCluster(), json);
        }

    });

})(window);
