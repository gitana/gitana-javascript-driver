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
         * @param {Gitana.Server} server Gitana server instance.
         * @param [Object] object
         */
        constructor: function(server, object)
        {
            this.objectType = "Gitana.PrincipalMap";


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
            return this.getFactory().principalMap(this.getServer(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            var o = null;

            var principalType = json["principal-type"];
            if (principalType)
            {
                principalType = principalType.toLowerCase();

                if (principalType == "user")
                {
                    o = this.getFactory().securityUser(this.getServer(), json);
                }
                else if (principalType == "group")
                {
                    o = this.getFactory().securityGroup(this.getServer(), json);
                }
            }

            return o;
        }

    });

})(window);
