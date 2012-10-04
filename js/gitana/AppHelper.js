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
            this.objectType = "Gitana.AppHelper";

            this.base(platform.getDriver(), object);

            this.getPlatform = function() {
                return platform;
            };

            this.getPlatformId = function() {
                return platform.getId();
            };

            this.getApplicationId = function() {
                return this.object["application"];
            };

            this.cache = Gitana.MemoryCache();
        },

        platform: function()
        {
            return this.subchain(this.getPlatform());
        },

        application: function()
        {
            var self = this;

            var application = self.cache("application");
            if (application)
            {
                return this.subchain(application);
            }

            return this.platform().readApplication(this.getApplicationId()).then(function() {
                self.cache("application", this);
            });
        },

        stack: function()
        {
            var self = this;

            var stack = self.cache("stack");
            if (stack)
            {
                return this.subchain(stack);
            }

            return this.platform().findStackForDataStore(Gitana.TypedIDConstants.TYPE_APPLICATION, this.getApplicationId()).then(function() {
                self.cache("stack", this);
            });
        },

        datastore: function(key, callback)
        {
            var self = this;

            var datastore = self.cache("stack.datastore." + key);
            if (datastore)
            {
                callback.call(Chain(datastore));
            }
            else
            {
                this.stack().existsDataStore(key, function(exists) {

                    if (exists) {
                        this.readDataStore(key, function() {
                            self.cache("stack.datastore." + key, this);
                            callback.call(this);
                        });
                    }
                    else
                    {
                        callback.call(self, new Error("No datastore: " + key));
                    }
                });
            }

            return self;
        }
    });

})(window);
