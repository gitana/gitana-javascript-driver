(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Role = Gitana.AbstractObject.extend(
    /** @lends Gitana.Role.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Role
         *
         * @param {Gitana.Cluster} cluster
         * @param {Object} roleContainer
         * @param {String} roleKey
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(cluster, roleContainer, object)
        {
            this.base(cluster.getDriver(), object);

            this.objectType = function() { return "Gitana.Role"; };

            this.roleContainer = roleContainer;

            this.getCluster = function()
            {
                return cluster;
            };
        },

        getUri: function()
        {
            return this.roleContainer.getUri() + "/roles/" + this.getId();
        },

        getType: function()
        {
            return "role";
        },

        /**
         * Delete
         *
         * @chained team
         *
         * @public
         */
        del: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            // NOTE: pass control back to the role container
            return this.chainDelete(this.roleContainer, uriFunction);
        },

        /**
         * Reload
         *
         * @chained role
         *
         * @public
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainReload(null, uriFunction);
        },

        /**
         * Update
         *
         * @chained team
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainUpdate(null, uriFunction);
        },

        //////////////////////////////////////////////////////////////////////////////////////
        //
        // ACCESSORS
        //
        //////////////////////////////////////////////////////////////////////////////////////

        /**
         * Returns the role key
         */
        getRoleKey: function()
        {
            return this.roleKey;
        },

        getPermissions: function()
        {
            return this.object["permissions"];
        }
    });

})(window);
