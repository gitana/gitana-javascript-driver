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
         * @param {Gitana.Server} server Gitana server instance.
         * @param {bject} teamable
         * @param [Object] object
         */
        constructor: function(server, teamable, object)
        {
            this.objectType = "Gitana.TeamMap";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(server, object);

            this.teamable = teamable;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().teamMap(this.getServer(), this.teamable, this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            var teamKey = json["_doc"];

            return this.getFactory().team(this.getServer(), this.teamable, teamKey, json);
        }

    });

})(window);
