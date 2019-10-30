(function(window)
{
    Gitana = window.Gitana;
    
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
         * @param {Object} object
         */
        constructor: function(cluster, teamable, object)
        {
            this.__teamable = (function() {
                let _teamable = null;
                return function(teamable) {
                    if (!Gitana.isUndefined(teamable)) { _teamable = teamable; }
                    return _teamable;
                };
            })();

            this.__teamable(teamable);

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
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().teamMap(this.getCluster(), this.__teamable(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().team(this.getCluster(), this.__teamable(), json);
        }

    });

})(window);
