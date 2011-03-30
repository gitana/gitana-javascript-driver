(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Principal = Gitana.AbstractGitanaObject.extend(
    /** @lends Gitana.Principal.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractGitanaObject
         *
         * @class Principal
         *
         * @param {Gitana.Driver} driver Gitana driver 
         * @param {Object} object the JSON object
         */
        constructor: function(driver, object)
        {
            this.base(driver, object);
        },

        /**
         * @returns {String} the principal id
         */
        getPrincipalId: function()
        {
            return this["principal-id"];
        },

        /**
         * @returns {String} the principal type ("user" or "group")
         */
        getPrincipalType: function()
        {
            return this["principal-type"];
        }

    });

})(window);
