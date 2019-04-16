(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AppHelper = Gitana.AbstractObject.extend(
    /** @lends Gitana.AppHelper.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class AppHelper
         *
         * @param {Gitana.Platform} platform
         * @param {object} config the configuration object (.application)
         */
        constructor: function(platform, config)
        {
            this.objectType = function() { return "Gitana.AppHelper"; };

            this.base(platform.getDriver());

            this.getPlatform = function() {
                return platform;
            };

            this.getPlatformId = function() {
                return platform.getId();
            };

            this.getApplicationId = function() {
                return config["application"];
            };

            this.cache = Gitana.MemoryCache();

            this.chainedCacheItem = function(key)
            {
                let chained = null;

                if (this.cache(key))
                {
                    chained = Chain(this.cache(key));
                }

                return chained;
            };
        },

        init: function(callback)
        {
            const self = this;

            const p = function(application)
            {
                // THIS = application

                const projectId = application["projectId"];
                if (projectId)
                {
                    // read the project
                    Chain(self.getPlatform()).trap(function() {

                        // could not find the project for the application
                        // this is fine... we are done
                        callback();

                    }).readProject(projectId).then(function() {

                        self.cache("project", this);

                        callback();

                    });
                }
                else
                {
                    callback();
                }
            };

            Chain(self.getPlatform()).trap(function(err) {

                // ERROR: application not found

                callback(err);

            }).readApplication(self.getApplicationId()).then(function() {
                self.cache("application", this);

                const application = this;

                this.subchain(self.getPlatform()).trap(function() {

                    // could not locate the stack for the application
                    // this is perfectly fine (just means an application isn't allocated to a stack)
                    p(application);

                }).findStackForDataStore(Gitana.TypedIDConstants.TYPE_APPLICATION, self.getApplicationId()).then(function() {

                    // this = stack
                    self.cache("stack", this);

                    this.listDataStores().each(function(key) {
                        this["_doc"] = this["datastoreId"];
                        delete this["datastoreTypeId"];
                        self.cache("stack.datastore." + key, this);
                    });

                    this.then(function() {
                        p(application);
                    });
                });

            });
        },

        platform: function()
        {
            return Chain(this.getPlatform());
        },

        application: function()
        {
            return this.chainedCacheItem("application");
        },

        stack: function()
        {
            return this.chainedCacheItem("stack");
        },

        datastore: function(key)
        {
            return this.chainedCacheItem("stack.datastore." + key);
        },

        project: function()
        {
            return this.chainedCacheItem("project");
        }

    });

})(window);
