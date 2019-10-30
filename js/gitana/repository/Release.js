(function(window)
{
    Gitana = window.Gitana;

    Gitana.Release = Gitana.AbstractRepositoryObject.extend(
    /** @lends Gitana.Release.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRepositoryObject
         *
         * @class Release
         *
         * @param {Gitana.Repository} repository
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(repository, object)
        {
            this.base(repository, object);

            this.objectType = function() { return "Gitana.Release"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_RELEASE;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/releases/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().release(this.getRepository(), this);
        },

        /**
         * Finalizes the release.
         *
         * @param object
         * @param callback
         * @returns {*}
         */
        finalize: function(object, callback)
        {
            if (typeof(object) === "function")
            {
                callback = object;
                object = null;
            }

            if (!object) {
                object = {};
            }

            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/finalize";
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback(response);
            });
        },

        /**
         * Unfinalizes the release.
         *
         * @param callback
         * @returns {*}
         */
        unfinalize: function(callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/unfinalize";
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback(response);
            });
        },

        /**
         * Loads information about the release.
         *
         * @param callback
         */
        loadInfo: function(callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/info";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {
                callback(response);
            });
        },

        /**
         * Starts the finalization of a release.
         * This runs a background job to do the actual finalization and hands back a job ID.
         *
         * @chained release
         *
         * @param {Object} object JSON object
         * @param callback
         */
        startFinalize: function(object, callback)
        {
            const self = this;

            if (typeof(object) === "function") {
                callback = object;
                object = null;
            }

            const uriFunction = function()
            {
                return self.getUri() + "/finalize/start";
            };

            if (!object)
            {
                object = {};
            }

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {

                const jobId = response._doc;

                callback(jobId);
            });
        },

        /**
         * Archives the release.
         *
         * @param callback
         * @returns {*}
         */
        archive: function(callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/archive";
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback(response);
            });
        },

        /**
         * Unarchives the release.
         *
         * @param callback
         * @returns {*}
         */
        unarchive: function(callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/unarchive";
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback(response);
            });
        },

        /**
         * Releases immediately.
         *
         * @param callback
         * @returns {*}
         */
        releaseImmediately: function(callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/releaseimmediately";
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback(response);
            });
        }

    });

})(window);
