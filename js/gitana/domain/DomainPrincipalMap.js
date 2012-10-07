(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.PrincipalMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.PrincipalMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of principal objects
         *
         * @param {Gitana.Cluster} cluster Gitana cluster instance.
         * @param [Object] object
         */
        constructor: function(cluster, object)
        {
            this.objectType = function() { return "Gitana.PrincipalMap"; };

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
            return this.getFactory().domainPrincipalMap(this.getCluster(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            var domainId = json["domainId"];

            // TODO - what do we do it the principals in the group are in domains that are NOT part of this platform?
            var platform = this.getDriver().currentPlatform;

            // TODO - this is a pretty big hack at the moment
            var domain = this.getFactory().domain(platform, {
                "_doc": domainId
            });

            return this.getFactory().domainPrincipal(domain, json);
        }

    });

})(window);
