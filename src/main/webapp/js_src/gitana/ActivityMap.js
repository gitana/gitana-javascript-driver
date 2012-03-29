(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ActivityMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.ActivityMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of activities
         *
         * @param {Object} datastore Gitana datastore
         * @param [Object] object
         */
        constructor: function(datastore, object)
        {
            this.objectType = "Gitana.ActivityMap";

            this.getDataStore = function()
            {
                return datastore;
            };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(datastore.getDriver(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().activityMap(this.getDataStore(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().activity(this.getDataStore(), json);
        }

    });

})(window);
