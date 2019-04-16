(function(window)
{
    const Gitana = window.Gitana;
    
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
         * @param {Object} object json object (if no callback required for populating)
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
            const uriFunction = function()
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
            const uriFunction = function()
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
            const uriFunction = function()
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
            const self = this;

            let vaultId = settings.vault;
            if (!Gitana.isString(vaultId))
            {
                vaultId = vaultId.getId();
            }
            const groupId = settings.group;
            const artifactId = settings.artifact;
            const versionId = settings.version;
            const configuration = (settings.configuration ? settings.configuration : {});
            const synchronous = !settings.async;

            // archive additional properties
            const title = settings.title;
            const description = settings.description;
            const published = settings.published;

            // we continue the chain with a job
            const chainable = this.getFactory().job(this.getCluster(), "export");

            // fire off import and job queue checking
            return this.subchain(chainable).then(function() {

                const chain = this;

                // create
                const params = {};
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
         * @param {Function} reportFn function
         */
        importArchive: function(settings, reportFn)
        {
            const self = this;

            let vaultId = settings.vault;
            if (!Gitana.isString(vaultId))
            {
                vaultId = vaultId.getId();
            }
            const groupId = settings.group;
            const artifactId = settings.artifact;
            const versionId = settings.version;
            const configuration = (settings.configuration ? settings.configuration : {});
            const synchronous = !settings.async;

            // we continue the chain with a job
            const chainable = this.getFactory().job(this.getCluster(), "import");

            // fire off import and job queue checking
            return this.subchain(chainable).then(function() {

                const chain = this;

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
