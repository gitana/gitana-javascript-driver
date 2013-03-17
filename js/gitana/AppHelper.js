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

                    // could not locate the application in the stack
                    callback(err);

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
            return Chain(this.cache("application"));
        },

        stack: function()
        {
            return Chain(this.cache("stack"));
        },

        datastore: function(key)
        {
            return Chain(this.cache("stack.datastore." + key));
        }
    });

})(window);
