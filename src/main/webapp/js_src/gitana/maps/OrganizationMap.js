(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.OrganizationMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.OrganizationMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of organizations
         *
         * @param {Gitana.Server} server Gitana server instance.
         * @param [Object] object
         */
        constructor: function(server, object)
        {
            this.objectType = "Gitana.OrganizationMap";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(server, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().organizationMap(this.getServer(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().organization(this.getServer(), json);
        }

    });

})(window);
