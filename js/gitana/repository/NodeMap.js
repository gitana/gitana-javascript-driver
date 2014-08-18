(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.NodeMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.NodeMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of node objects
         *
         * @param {Gitana.Branch} branch Gitana branch instance.
         * @param [Object] object
         */
        constructor: function(branch, object)
        {
            this.objectType = function() { return "Gitana.NodeMap"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return branch.getRepository(); };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return branch.getRepository().getId(); };

            /**
             * Gets the Gitana Branch object.
             *
             * @inner
             *
             * @returns {Gitana.Branch} The Gitana Branch object
             */
            this.getBranch = function() { return branch; };

            /**
             * Gets the Gitana Branch id.
             *
             * @inner
             *
             * @returns {String} The Gitana Branch id
             */
            this.getBranchId = function() { return branch.getId(); };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(branch.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().nodeMap(this.getBranch(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().node(this.getBranch(), json);
        },

        /**
         * Delete
         *
         * @chained this
         *
         * @public
         */
        del: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getBranch().getUri() + "/nodes/delete";
            };

            return this.subchain().then(function() {

                var nodeIds = this.__keys();

                return this.chainPost(this, uriFunction, {}, {
                    "_docs": nodeIds
                });
            });
        },

        /**
         * Starts an export and hands back the exportId in the callback.
         *
         * @param configuration
         * @param callback
         * @returns {*}
         */
        startExport: function(configuration, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return "/ref/exports/start";
            };

            return this.subchain().then(function() {

                var map = this;

                var references = [];
                for (var i = 0; i < this.__keys().length; i++)
                {
                    var nodeId = this.__keys()[i];

                    var node = map[nodeId];
                    references.push("node://" + node.getPlatformId() + "/" + node.getRepositoryId() + "/" + node.getBranchId() + "/" + node.getId());
                }

                if (!configuration)
                {
                    configuration = {};
                }

                configuration.references = references;
                configuration.pdfTemplateRepositoryId = self.getBranch().getRepositoryId();
                configuration.pdfTemplateBranchId = self.getBranch().getId();

                var params = {};

                return this.chainPostResponse(this, uriFunction, params, configuration).then(function(response) {

                    var exportId = response._doc;

                    callback(exportId);

                });
            });
        },

        /**
         * Retrieves the status for a running export job.
         * The status includes the "fileCount" field which indicates the total number of exported files.
         *
         * @param exportId
         * @param callback
         * @returns {*}
         */
        readExportStatus: function(exportId, callback)
        {
            var uriFunction = function()
            {
                return "/ref/exports/" + exportId + "/status";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback(response);
            });
        },

        /**
         * Waits for an export to complete.
         *
         * The callback is fired with the exportId and status.
         *
         * @param exportId
         * @param callback
         */
        waitForExport: function(exportId, callback)
        {
            var self = this;

            return this.then(function() {

                var chainable = this;

                // wait for the export to finish...
                var f = function()
                {
                    window.setTimeout(function() {

                        Chain(chainable).readExportStatus(exportId, function(status) {
                            if (status.state == "FINISHED") {
                                callback(exportId, status);
                                chainable.next();
                            } else {
                                f();
                            }
                        });

                    }, 1000);
                };
                f();

                return false;
            });
        },

        /**
         * Gets the download URL for a completed export.
         *
         * @param exportId
         * @param index
         * @param useDispositionHeader
         * @returns {string}
         */
        exportDownloadUrl: function(exportId, index, useDispositionHeader)
        {
            var url = "/ref/exports/" + exportId + "/download";

            if (index)
            {
                url += "/" + index;
            }

            if (useDispositionHeader)
            {
                url += "?a=true";
            }

            return url;
        },

        exportCreateNode: function(exportId, config, callback)
        {
            var self = this

            if (!config)
            {
                config = {};
            }

            if (!config.repositoryId)
            {
                config.repositoryId = self.getRepositoryId();
            }
            if (!config.branchId)
            {
                config.branchId = self.getBranchId();
            }
            if (!config.properties)
            {
                config.properties = {};
            }
            if (!config.parentFolderPath)
            {
                config.parentFolderPath = {};
            }

            var uriFunction = function()
            {
                return "/ref/exports/" + exportId + "/generate";
            };

            var params = {};

            return this.chainPostResponse(this, uriFunction, params, config).then(function(response) {
                callback(response);
            });
        },

        exportEmail: function(exportId, applicationId, emailProviderId, emailConfig, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return "/ref/exports/" + exportId + "/email";
            };

            var params = {};

            var payload = {
                "applicationId": applicationId,
                "emailProviderId": emailProviderId,
                "email": emailConfig
            };

            return this.chainPostResponse(this, uriFunction, params, payload).then(function(response) {
                callback(response);
            });
        }

    });

})(window);
