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

        getScope: function()
        {
            return this["scope"];
        },

        getAction: function()
        {
            return this["action"];
        },

        getTimestamp: function()
        {
            return this["timestamp"];
        },

        getPrincipalId: function()
        {
            return this["principalId"];
        },

        getArguments: function()
        {
            return this["args"];
        }




    });

})(window);
