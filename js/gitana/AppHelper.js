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
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.AppHelper"; };

            this.base(platform.getDriver(), object);

            this.getPlatform = function() {
                return platform;
            };

            this.getPlatformId = function() {
                return platform.getId();
            };

            this.getApplicationId = function() {
                return this["application"];
            };

            this.cache = Gitana.MemoryCache();
        },

        init: function(callback)
        {
            var self = this;

            Chain(self.getPlatform()).readApplication(self.getApplicationId()).then(function() {
                self.cache("application", this);

                Chain(self.getPlatform()).findStackForDataStore(Gitana.TypedIDConstants.TYPE_APPLICATION, self.getApplicationId()).then(function() {

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
            return this.subchain(this.getPlatform());
        },

        application: function()
        {
            return this.subchain(this.cache("application"));
        },

        stack: function()
        {
            return this.subchain(this.cache("stack"));
        },

        datastore: function(key)
        {
            return this.subchain(this.cache("stack.datastore." + key));
        }
    });

})(window);
