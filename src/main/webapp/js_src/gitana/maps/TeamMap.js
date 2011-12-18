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
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {bject} teamable
         * @param [Object] object
         */
        constructor: function(platform, teamable, object)
        {
            this.objectType = "Gitana.TeamMap";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(platform, object);

            this.teamable = teamable;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().teamMap(this.getPlatform(), this.teamable, this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            var teamKey = json["_doc"];

            return this.getFactory().team(this.getPlatform(), this.teamable, teamKey, json);
        }

    });

})(window);
