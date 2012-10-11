(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.DeployedApplicationMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.DeployedApplicationMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class DeployedApplicationMap
         *
         * @param {Gitana.WebHost} webhost Gitana Web Host instance.
         * @param [Object] object
         */
        constructor: function(webhost, object)
        {
            this.objectType = function() { return "Gitana.DeployedApplicationMap"; };


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


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(webhost.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().deployedApplicationMap(this.getWebHost(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().deployedApplication(this.getWebHost(), json);
        }

    });

})(window);
