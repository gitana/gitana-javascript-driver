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
            return "cluster";
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.Cluster(this.getDriver(), this.object);
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
         * Queries for candidate jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryCandidateJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/candidate/query", params, query);
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
