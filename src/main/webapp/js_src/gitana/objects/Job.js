(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Job = Gitana.AbstractObject.extend(
    /** @lends Gitana.Job.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Job
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = "Gitana.Job";
        },

        /**
         * @returns {String} the type id of the job
         */
        getType: function()
        {
            return this.get("type");
        },

        /**
         * @returns {String} the principal that this job will run as
         */
        getRunAs: function()
        {
            return this.get("runAs");
        },

        /**
         * @returns {Boolean} whether the job has been submitted to the job queue
         */
        isSubmitted: function()
        {
            return this.get("is_submitted");
        },

        /**
         * @returns {Boolean} whether the job has been started
         */
        isStarted: function()
        {
            return this.get("is_started");
        },

        /**
         * @returns {Boolean} whether the job is running
         */
        isRunning: function()
        {
            return this.get("is_running");
        },

        /**
         * @returns {Boolean} whether the job finished
         */
        isFinished: function()
        {
            return this.get("is_finished");
        },

        /**
         * @returns {Boolean} whether the job errored out
         */
        isError: function()
        {
            return this.get("is_error");
        },

        /**
         * @returns {String} the principal that submitted the job
         */
        getSubmittedBy: function()
        {
            return this.get("submitted_by");
        },

        /**
         * @returns {String} when the job started
         */
        getStartTime: function()
        {
            return this.get("start_timestamp");
        },

        /**
         * @returns {String} the principal that started the job
         */
        getStartedBy: function()
        {
            return this.get("started_by");
        },

        /**
         * @returns {String} when the job stopped
         */
        getStopTime: function()
        {
            return this.get("stop_timestamp");
        },

        /**
         * @returns {String} the principal that stopped the job
         */
        getStoppedBy: function()
        {
            return this.get("stopped_by");
        },

        /**
         * @returns {Number} the priority of the job
         */
        getPriority: function()
        {
            return this.get("priority");
        },

        /**
         * @returns {Number} the number of attempts made to run this job
         */
        getAttempts: function()
        {
            return this.get("attempts");
        },

        /**
         * @returns {Object} when the job is scheduled to start (or null)
         */
        getScheduledStartTime: function()
        {
            return this.get("schedule_start_ms");
        },

        /**
         * @returns [Array] array of status log objects
         */
        getStatusLogs: function()
        {
            return this.get("log_entries");
        }

    });

})(window);
