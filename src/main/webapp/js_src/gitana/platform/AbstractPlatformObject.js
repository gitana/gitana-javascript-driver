(function(window)
{
    var Gitana = window.Gitana;
    
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
         * @param [Object] object json object (if no callback required for populating)
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
            var schedule = (settings.async ? "ASYNCHRONOUS" : "SYNCHRONOUS");

            // we continue the chain with a job
            var chainable = this.getFactory().job(this.getCluster());

            // fire off import and job queue checking
            return this.link(chainable).then(function() {

                var chain = this;

                // create
                this.getDriver().gitanaPost(self.getUri() + "/export?vault=" + vaultId + "&group=" + groupId + "&artifact=" + artifactId + "&version=" + versionId + "&schedule=" + schedule, {}, configuration, function(response) {

                    // put in a 500ms delay to wait on reading the job back
                    var jobId = response.getId();
                    var jobFinalizer = function() {

                        return Chain(self.getCluster()).readJob(jobId).then(function() {

                            // success, continue the chain
                            chain.loadFrom(this);
                            chain.next();
                        });
                    };

                    // reset timeout
                    window.setTimeout(jobFinalizer, 500);

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
         */
        importArchive: function(settings)
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
            var schedule = (settings.async ? "ASYNCHRONOUS" : "SYNCHRONOUS");

            // we continue the chain with a job
            var chainable = this.getFactory().job(this.getCluster());

            // fire off import and job queue checking
            return this.link(chainable).then(function() {

                var chain = this;

                // create
                this.getDriver().gitanaPost(self.getUri() + "/import?vault=" + vaultId + "&group=" + groupId + "&artifact=" + artifactId + "&version=" + versionId + "&schedule=" + schedule, {}, configuration, function(response) {

                    // put in a 500ms delay to wait on reading the job back
                    var jobId = response.getId();
                    var jobFinalizer = function() {

                        return Chain(self.getCluster()).readJob(jobId).then(function() {

                            // success, continue the chain
                            chain.loadFrom(this);
                            chain.next();
                        });
                    };

                    // reset timeout
                    window.setTimeout(jobFinalizer, 500);

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
         */
        copy: function(target, asynchronous)
        {
            var self = this;

            var schedule = (asynchronous ? "ASYNCHRONOUS" : "SYNCHRONOUS");

            var payload = {
                "sources": Gitana.toCopyDependencyChain(this),
                "targets": Gitana.toCopyDependencyChain(target)
            };

            // we continue the chain with a job
            var chainable = this.getFactory().job(this.getCluster());

            // fire off copy and job queue checking
            return this.link(chainable).then(function() {

                var chain = this;

                // create
                this.getDriver().gitanaPost("/tools/copy?schedule=" + schedule, {}, payload, function(response) {

                    // put in a 500ms delay to wait on reading the job back
                    var jobId = response.getId();
                    var jobFinalizer = function() {

                        return Chain(self.getCluster()).readJob(jobId).then(function() {

                            // success, continue the chain
                            chain.loadFrom(this);
                            chain.next();
                        });
                    };

                    // reset timeout
                    window.setTimeout(jobFinalizer, 500);

                }, function(http) {
                    self.httpError(http);
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        }


    });

})(window);
