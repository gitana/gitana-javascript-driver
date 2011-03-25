(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractService = Gitana.Abstract.extend(
    /** @lends Gitana.AbstractService.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Abstract
         *
         * @class Abstract base class for all driver services.
         *
         * @param {Gitana.Driver} driver Gitana driver instance.
         */
        constructor: function(driver)
        {
            this.base();

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Hands back the Gitana driver for this instance.
             *
             * @inner
             *
             * @returns {Gitana.Driver} the Gitana driver instance.
             */
            this.getDriver = function() { return driver; };
        }

    });

})(window);
