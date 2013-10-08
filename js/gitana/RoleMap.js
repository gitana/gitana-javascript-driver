(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.RoleMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.RoleMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of roles
         *
         * @param {Gitana.Cluster} cluster Gitana cluster instance.
         * @param {Object} role container
         * @param [Object] object
         */
        constructor: function(cluster, roleContainer, object)
        {
            this.objectType = function() { return "Gitana.RoleMap"; };

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

            this.roleContainer = roleContainer;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().roleMap(this.getCluster(), this.roleContainer, this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().role(this.getCluster(), this.roleContainer, json);
        }

    });

})(window);
