(function(window)
{
    Gitana = window.Gitana;

    Gitana.AbstractPlatformObject = Gitana.AbstractSelfableACLObject.extend(
    /** @lends Gitana.AbstractPlatformObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractSelfableACLObject
         *
         * @class AbstractPlatformObject
         *
         * @param {Gitana.Platform} platform
         * @param {Object} [object] json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform.getDriver(), object);


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
         * @OVERRIDE
         */
        ref: function()
        {
            return this.getType() + "://" + this.getPlatformId() + "/" + this.getId();
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
         * @param {Function} reportFn
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
        }


    });

})(window);
