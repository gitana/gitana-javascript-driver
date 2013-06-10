(function(window)
{
    var Gitana = window.Gitana;
    
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
                var chained = null;

                if (this.cache[key])
                {
                    chained = Chain(this.cache[key]);
                }

                return chained;
            }
        },

        init: function(callback)
        {
            var self = this;

            Chain(self.getPlatform()).trap(function(err) {

                // application not found
                callback(err);

            }).readApplication(self.getApplicationId()).then(function() {
                self.cache("application", this);

                Chain(self.getPlatform()).trap(function(err) {

                    // could not locate the stack for the application
                    // this is perfectly fine (just means no application isn't allocated to a stack)
                    callback();

                }).findStackForDataStore(Gitana.TypedIDConstants.TYPE_APPLICATION, self.getApplicationId()).then(function() {

                    // this = stack
                    self.cache("stack", this);

                    this.listDataStores().each(function(key) {
                        this["_doc"] = this["datastoreId"];
                        delete this["datastoreTypeId"];
                        self.cache("stack.datastore." + key, this);
                    }).then(function() {

                        callback();

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
            //return Chain(this.cache("application"));
            return this.chainedCacheItem("application");
        },

        stack: function()
        {
            //return Chain(this.cache("stack"));
            return this.chainedCacheItem("stack");
        },

        datastore: function(key)
        {
            //return Chain(this.cache("stack.datastore." + key));
            return this.chainedCacheItem("stack.datastore." + key);
        }
    });

})(window);
