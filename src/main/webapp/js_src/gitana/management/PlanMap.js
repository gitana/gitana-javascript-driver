(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.PlanMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.PlanMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of plan objects
         *
         * @param {Gitana.Management} management Gitana management object
         * @param {Object} object
         */
        constructor: function(management, object)
        {
            this.objectType = "Gitana.PlanMap";

            this.getManagement = function()
            {
                return management;
            };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(management.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().planMap(this.getManagement(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().plan(this.getManagement(), json);
        }

    });

})(window);
