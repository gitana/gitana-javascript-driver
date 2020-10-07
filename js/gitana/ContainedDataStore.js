(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ContainedDataStore = Gitana.DataStore.extend(
    /** @lends Gitana.ContainedDataStore.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.DataStore
         *
         * @class ContainedDataStore
         *
         * @param {Gitana.DataStore} container
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(container, object)
        {
            this.base(container.getDriver(), object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getContainer = function()
            {
                return container;
            };

            this.getContainerId = function()
            {
                return container.getId();
            };

        },

        /**
         * Delete
         *
         * @chained container datastore
         *
         * @public
         */
        del: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            // NOTE: pass control back to the container datastore instance
            return this.chainDelete(this.getContainer(), uriFunction);
        },

        /**
         * Reload
         *
         * @chained this
         *
         * @public
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainReload(null, uriFunction);
        },

        /**
         * Update
         *
         * @chained this
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainUpdate(null, uriFunction);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // TRANSFER
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Exports an archive.
         *
         * @chained job
         *
         * @param {Object} settings
         */
        exportArchive: function(settings)
        {
            var self = this;

            var vaultId = settings.vault;
            if (!Gitana.isString(vaultId))
            {
                vaultId = vaultId.getId();
            }
            var groupId = settings.group;
            var artifactId = settings.artifact;
            var versionId = settings.version;
            var configuration = (settings.configuration ? settings.configuration : {});
            var synchronous = (settings.async ? false : true);

            // archive additional properties
            var title = settings.title;
            var description = settings.description;
            var published = settings.published;

            // we continue the chain with a job
            var chainable = this.getFactory().job(this.getCluster(), {});

            // fire off import and job queue checking
            return this.subchain(chainable).then(function() {

                var chain = this;

                // create
                var params = {};
                params["vault"] = vaultId;
                params["group"] = groupId;
                params["artifact"] = artifactId;
                params["version"] = versionId;
                params["schedule"] = "ASYNCHRONOUS";
                if (title) {
                    params["title"] = title;
                }
                if (description) {
                    params["description"] = description;
                }
                if (published) {
                    params["published"] = published;
                }
                this.getDriver().gitanaPost(self.getUri() + "/export", params, configuration, function(response) {
                    Gitana.handleJobCompletion(chain, self.getCluster(), response.getId(), synchronous);
                }, function(http) {
                    self.httpError(http);
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        /**
         * Imports an archive.
         *
         * @chained job
         *
         * @param {Object} settings
         * @param [Function] report function
         */
        importArchive: function(settings, reportFn)
        {
            var self = this;

            var vaultId = settings.vault;
            if (!Gitana.isString(vaultId))
            {
                vaultId = vaultId.getId();
            }
            var groupId = settings.group;
            var artifactId = settings.artifact;
            var versionId = settings.version;
            var configuration = (settings.configuration ? settings.configuration : {});
            var synchronous = (settings.async ? false : true);

            // we continue the chain with a job
            var chainable = this.getFactory().job(this.getCluster(), "import");

            // fire off import and job queue checking
            return this.subchain(chainable).then(function() {

                var chain = this;

                // create
                this.getDriver().gitanaPost(self.getUri() + "/import?vault=" + vaultId + "&group=" + groupId + "&artifact=" + artifactId + "&version=" + versionId + "&schedule=ASYNCHRONOUS", {}, configuration, function(response) {

                    Gitana.handleJobCompletion(chain, self.getCluster(), response.getId(), synchronous, reportFn);

                }, function(http) {
                    self.httpError(http);
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });

        }

    });

})(window);
