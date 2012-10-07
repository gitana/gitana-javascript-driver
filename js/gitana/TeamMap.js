(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.TeamMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.TeamMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of teams
         *
         * @param {Gitana.Cluster} cluster Gitana cluster instance.
         * @param {Object} teamable
         * @param [Object] object
         */
        constructor: function(cluster, teamable, object)
        {
            this.objectType = function() { return "Gitana.TeamMap"; };

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

            this.teamable = teamable;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().teamMap(this.getCluster(), this.teamable, this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            var teamKey = json["_doc"];

            return this.getFactory().team(this.getCluster(), this.teamable, teamKey, json);
        }

    });

})(window);
