(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.ResultMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.ResultMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Generalized result maps
         *
         * @param {Gitana} driver
         * @param {Object} resultMap
         */
        constructor: function(driver, resultMap)
        {
            this.objectType = function() { return "Gitana.ResultMap"; };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(driver, resultMap);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().resultMap(this.getDriver(), this);
        },

        /**
         * @param object
         */
        buildObject: function(object)
        {
            return object;
        }

    });

})(window);
