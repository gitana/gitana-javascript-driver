(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.DeployedApplication = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.DeployedApplication.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class DeployedApplication
         *
         * @param {Gitana.WebHost} webhost
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(webhost, object)
        {
            this.base(webhost.getPlatform(), object);

            this.objectType = function() { return "Gitana.DeployedApplication"; };


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
         * @override
         */
        clone: function()
        {
            return this.getFactory().deployedApplication(this.getWebHost(), this);
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DEPLOYED_APPLICATION;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/webhosts/" + this.getWebHostId() + "/applications/" + this.getId();
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // DEPLOYMENT
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Undeploys the deployed application.
         *
         * @chained deployed application
         */
        undeploy: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/undeploy";
            };

            // NOTE: pass control back to the web host
            return this.chainPostEmpty(this.getWebHost(), uriFunction);
        },

        /**
         * Redeploys the deployed application.
         *
         * @chained deployed application
         */
        redeploy: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/redeploy";
            };

            // NOTE: pass control back to the web host
            return this.chainPostEmpty(this.getWebHost(), uriFunction);
        },

        /**
         * Starts the deployed application.
         *
         * @chained deployed application
         */
        start: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/start";
            };

            // NOTE: pass control back to the web host
            return this.chainPostEmpty(this.getWebHost(), uriFunction);
        },

        /**
         * Stops the deployed application.
         *
         * @chained deployed application
         */
        stop: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/stop";
            };

            // NOTE: pass control back to the web host
            return this.chainPostEmpty(this.getWebHost(), uriFunction);
        },

        /**
         * Undeploys the deployed application.
         *
         * @chained deployed application
         */
        restart: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/restart";
            };

            // NOTE: pass control back to the web host
            return this.chainPostEmpty(this.getWebHost(), uriFunction);
        }


    });

})(window);
