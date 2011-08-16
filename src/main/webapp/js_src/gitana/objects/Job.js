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
         * @param {Gitana.Server} server
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.Job";
        },

        /**
         * @returns {Boolean} whether the job is started
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
         * @returns {Boolean} whether the job errored out
         */
        isError: function()
        {
            return this.get("is_error");
        },

        /**
         * @returns {Boolean} whether the job finished
         */
        isFinished: function()
        {
            return this.get("is_finished");
        },

        /**
         * @returns {String} the principal that started the job
         */
        getStartedBy: function()
        {
            return this.get("started_by");
        },

        /**
         * @returns {String} the principal that stopped the job
         */
        getStoppedBy: function()
        {
            return this.get("stopped_by");
        },

        /**
         * @returns {String} when the job started
         */
        getStartTime: function()
        {
            return this.get("start_timestamp");
        },

        /**
         * @returns {String} when the job stopped
         */
        getStopTime: function()
        {
            return this.get("stop_timestamp");
        },

        /**
         * @returns {String} the stack trace (in the event of an error)
         */
        getStackTrace: function()
        {
            return this.get("stacktrace");
        },

        /**
         * @returns {String} message (in the event of an error)
         */
        getMessage: function()
        {
            return this.get("message");
        }

    });

})(window);
