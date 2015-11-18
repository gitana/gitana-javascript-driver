(function(window)
{
    var Gitana = window.Gitana;

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
         * @param [Object] object json object (if no callback required for populating)
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
        }

    });

})(window);
