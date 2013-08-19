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

                if (this.cache(key))
                {
                    chained = Chain(this.cache(key));
                }

                return chained;
            }
        },

        init: function(callback)
        {
            var self = this;

            var p = function(application)
            {
                // THIS = application

                var projectId = application["projectId"];
                if (projectId)
                {
                    // read the project
                    Chain(self.getPlatform()).trap(function(err) {

                        // could not find the project for the application
                        // this is fine... we are done
                        callback();

                    }).readProject(projectId).then(function() {

                        self.cache("project", this);

                        self.datastore("content").readBranch("master").queryOne({
                            "_type": "n:project",
                            "projectId": projectId
                        }).then(function() {

                            self.cache("projectSpace", this);

                            callback();
                        });
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

                var application = this;

                this.subchain(self.getPlatform()).trap(function(err) {

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
        },

        projectSpace: function()
        {
            return this.chainedCacheItem("projectSpace");
        },

        projectFilename: function()
        {
            var filename = null;

            if (this.projectSpace())
            {
                var filenameFeature = this.projectSpace().__features()["f:filename"];
                if (filenameFeature)
                {
                    filename = filenameFeature["filename"];
                }
            }

            return filename;
        }

    });

})(window);
