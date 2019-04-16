(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AbstractWebHostObject = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AbstractWebHostObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class AbstractWebHostObject
         *
         * @param {Gitana.WebHost} webhost
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(webhost, object)
        {
            this.base(webhost.getPlatform(), object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Web Host object.
             *
             * @inner
             *
             * @returns {Gitana.WebHost} The Gitana Web Host object
             */
            this.getWebHost = function() { return webhost; };

            /**
             * Gets the Gitana Web Host id.
             *
             * @inner
             *
             * @returns {String} The Gitana Web Host id
             */
            this.getWebHostId = function() { return webhost.getId(); };
        },

        /**
         * @OVERRIDE
         */
        ref: function()
        {
            return this.getType() + "://" + this.getPlatformId() + "/" + this.getWebHostId() + "/" + this.getId();
        }

    });

})(window);
