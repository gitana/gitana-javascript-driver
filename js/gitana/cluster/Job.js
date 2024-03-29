(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Job = Gitana.AbstractClusterObject.extend(
    /** @lends Gitana.Job.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractClusterObject
         *
         * @class Job
         *
         * @param {Gitana.Cluster} cluster
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(cluster, object)
        {
            this.base(cluster, object);

            this.objectType = function() { return "Gitana.Job"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.Job(this.getCluster(), this);
        },

        /**
         * @override
         */
        getUri: function()
        {
            return "/jobs/" + this.getId();
        },

        /**
         * @returns {String} the type id of the job
         */
        getJobType: function()
        {
            return this.get("type");
        },

        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_JOB;
        },

        /**
         * @returns {String} the id of the principal that this job will run as
         */
        getRunAsPrincipalId: function()
        {
            return this.get("runAsPrincipal");
        },

        /**
         * @returns {String} the domain of the principal that this job will run as
         */
        getRunAsPrincipalDomainId: function()
        {
            return this.get("runAsPrincipalDomain");
        },

        /**
         * @returns {String} the state of the job
         */
        getState: function()
        {
            return this.get("state");
        },

        /**
         * @returns {String} the platform id
         */
        getPlatformId: function()
        {
            return this.get("platformId");
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
        getLogEntries: function()
        {
            return this.get("log_entries");
        },

        getCurrentThread: function()
        {
            return this.get("current_thread");
        },

        getCurrentServer: function()
        {
            return this.get("current_server");
        },

        getCurrentServerTimeStamp: function()
        {
            return this.get("current_server_timestamp");
        },

        getSubmittedBy: function()
        {
            return this.get("submitted_by");
        },

        getSubmittedTimestamp: function()
        {
            return this.get("submitted_timestamp");
        },

        getStarted: function()
        {
            return this.get("started");
        },

        getStartedBy: function()
        {
            return this.get("started_by");
        },

        getStartedTimestamp: function()
        {
            return this.get("started_timestamp");
        },

        getStopped: function()
        {
            return this.get("stopped");
        },

        getStoppedTimestamp: function()
        {
            return this.get("stopped_timestamp");
        },

        getPaused: function()
        {
            return this.get("paused");
        },

        getPausedBy: function()
        {
            return this.get("paused_by");
        },

        getPausedTimestamp: function()
        {
            return this.get("paused_timestamp");
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ATTACHMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back an attachments map.
         *
         * @chained attachment map
         *
         * @param local
         *
         * @public
         */
        listAttachments: Gitana.Methods.listAttachments(),

        /**
         * Picks off a single attachment
         *
         * @chained attachment
         *
         * @param attachmentId
         */
        attachment: function(attachmentId)
        {
            return this.listAttachments().select(attachmentId);
        },

        /**
         * Creates an attachment.
         *
         * When using this method from within the JS driver, it really only works for text-based content such
         * as JSON or text.
         *
         * @chained attachment
         *
         * @param attachmentId (use null or false for default attachment)
         * @param contentType
         * @param data
         */
        attach: Gitana.Methods.attach(),

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: Gitana.Methods.unattach(),

        /**
         * Generates a URI to a preview resource.
         */
        getPreviewUri: Gitana.Methods.getPreviewUri()
    });

})(window);
