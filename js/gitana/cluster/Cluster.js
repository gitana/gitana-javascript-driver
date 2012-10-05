(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Cluster = Gitana.DataStore.extend(
    /** @lends Gitana.Cluster.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.DataStore
         *
         * @class Cluster
         *
         * @param {Gitana.Driver} driver
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(driver, object)
        {
            this.objectType = "Gitana.Cluster";

            this.base(driver, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "";
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_CLUSTER;
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.Cluster(this.getDriver(), this.object);
        },

        /**
         * Loads the contained types for a type as a string array and passes it into a callback function.
         *
         * @param type
         * @param callback
         * @return this
         */
        loadContainedTypes: function(type, callback)
        {
            var uriFunction = function()
            {
                return "/tools/types/contained/" + type;
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["types"]);
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // JOB METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Queries for jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/query", params, query);
        },

        /**
         * Read a job.
         *
         * @chained job
         *
         * @param {String} jobId
         */
        readJob: function(jobId)
        {
            var chainable = this.getFactory().job(this);

            return this.chainGet(chainable, "/jobs/" + jobId);
        },

        /**
         * Kills a job
         *
         * @chained server
         *
         * @param {String} jobId
         */
        killJob: function(jobId)
        {
            return this.chainPostEmpty(this, "/jobs/" + jobId + "/kill");
        },

        /**
         * Queries for unstarted jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryUnstartedJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/unstarted/query", params, query);
        },

        /**
         * Queries for running jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryRunningJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/running/query", params, query);
        },

        /**
         * Queries for failed jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryFailedJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/failed/query", params, query);
        },

        /**
         * Queries for waiting jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryWaitingJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/waiting/query", params, query);
        },

        /**
         * Queries for finished jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryFinishedJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/finished/query", params, query);
        }

    });

})(window);
