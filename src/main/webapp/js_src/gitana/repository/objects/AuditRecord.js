(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AuditRecord = Gitana.AbstractGitanaObject.extend(
    /** @lends Gitana.AuditRecord.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractGitanaObject
         *
         * @class AuditRecord
         *
         * @param {Gitana.Driver} driver Gitana driver 
         * @param {Object} object the JSON object
         */
        constructor: function(driver, object)
        {
            this.base(driver, object);
        },

        /**
         * @returns {String} the scope of the audit record (i.e. "NODE")
         */
        getScope: function()
        {
            return this["scope"];
        },

        /**
         * @returns {String} the action of the audit record ("CREATE", "READ", "UPDATE", "DELETE", "MOVE", "COPY", "EXISTS")
         */
        getAction: function()
        {
            return this["action"];
        },

        /**
         * @returns {String} the principal for the audit record
         */
        getPrincipalId: function()
        {
            return this["principal"];
        },

        /**
         * @returns {String} method that was invoked
         */
        getMethod: function()
        {
            return this["method"];
        },

        /**
         * @returns {String} handler
         */
        getHandler: function()
        {
            return this["handler"];
        },

        /**
         * @returns {Object} argument descriptors
         */
        getArgs: function()
        {
            return this["args"];
        },

        /**
         * @returns {Object} return value descriptor
         */
        getReturn: function()
        {
            return this["return"];
        }

    });

})(window);
