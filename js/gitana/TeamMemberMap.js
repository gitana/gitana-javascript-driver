(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.TeamMemberMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.TeamMemberMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of team members
         *
         * @param {Gitana.Team} team
         * @param {Object} object
         */
        constructor: function(team, object)
        {
            this.objectType = function() { return "Gitana.TeamMemberMap"; };

            this.getTeam = function()
            {
                return team;
            };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(team.getDriver(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.TeamMemberMap(this.getTeam(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return new Gitana.TeamMember(this.getTeam(), json);
        }

    });

})(window);
