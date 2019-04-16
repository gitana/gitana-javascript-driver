(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AbstractPlatformDataStore = Gitana.ContainedDataStore.extend(
    /** @lends Gitana.AbstractPlatformDataStore.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.DataStore
         *
         * @class AbstractPlatformDataStore
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getPlatform = function()
            {
                return platform;
            };

            this.getPlatformId = function()
            {
                return platform.getId();
            };

            this.getCluster = function()
            {
                return platform.getCluster();
            };

            this.getClusterId = function()
            {
                return platform.getClusterId();
            };
        },

        /**
         * @returns {String} a string denoting a reference to this platform datastore
         */
        ref: function()
        {
            return this.getType() + "://" + this.getPlatformId() + "/" + this.getId();
        },




        //////////////////////////////////////////////////////////////////////////////////////////////
        //
        // COPY
        //
        //////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Copies this object into the target.
         *
         * @chained job
         *
         * @param target
         * @param asynchronous
         * @param config
         */
        copy: function(target, asynchronous, config)
        {
            const self = this;

            const payload = {
                "sources": Gitana.toCopyDependencyChain(this),
                "targets": Gitana.toCopyDependencyChain(target)
            };

            if (config) {
                payload.configuration = config;
            }

            // we continue the chain with a job
            const chainable = this.getFactory().job(this.getCluster(), "copy");

            // fire off copy and job queue checking
            return this.subchain(chainable).then(function() {

                const chain = this;

                // create
                this.getDriver().gitanaPost("/tools/copy?schedule=ASYNCHRONOUS", {}, payload, function(response) {

                    Gitana.handleJobCompletion(chain, self.getCluster(), response.getId(), !asynchronous);

                }, function(http) {
                    self.httpError(http);
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        /**
         * Finds the stack for this data store.
         * @chained stack
         */
        findStack: function()
        {
            return this.subchain(this.getPlatform()).findStackForDataStore(this.getType(), this.getId());
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INFO
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Loads information about the datastore.
         *
         * @param callback
         */
        loadInfo: function(callback)
        {
            const uriFunction = function()
            {
                return this.getUri() +  "/info";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {
                callback(response);
            });
        }

    });

})(window);
