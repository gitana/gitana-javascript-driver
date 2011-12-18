(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.LogEntry = Gitana.AbstractObject.extend(
    /** @lends Gitana.LogEntry.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class LogEntry
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = "Gitana.LogEntry";
        },

        /**
         * @returns {String} the id of the principal that logged this entry
         */
        getPrincipalId: function()
        {
            return this.get("principalId");
        },

        /**
         * @returns {String} the id of the repository against which this log entry was logged (or null)
         */
        getRepositoryId: function()
        {
            return this.get("repositoryId");
        },

        /**
         * @returns {String} the id of the branch against which this log entry was logged (or null)
         */
        getBranchId: function()
        {
            return this.get("branchId");
        },

        /**
         * @returns {String} log level
         */
        getLevel: function()
        {
            return this.get("level");
        },

        /**
         * @returns {String} thread id
         */
        getThread: function()
        {
            return this.get("thread");
        },

        /**
         * @returns {Object} timestamp
         */
        getTimestamp: function()
        {
            return this.get("timestamp");
        },

        /**
         * @returns {String} message
         */
        getMessage: function()
        {
            return this.get("message");
        },

        /**
         * @returns {String} filename
         */
        getFilename: function()
        {
            return this.get("filename");
        },

        /**
         * @returns {String} method
         */
        getMethod: function()
        {
            return this.get("method");
        },

        /**
         * @returns {Number} line number
         */
        getLineNumber: function()
        {
            return this.get("line");
        },

        /**
         * @returns {Object} class descriptor
         */
        getClassDescriptor: function()
        {
            return this.get("class");
        },

        /**
         * @returns [Array] throwables
         */
        getThrowables: function()
        {
            return this.get("throwables");
        }

    });

})(window);
