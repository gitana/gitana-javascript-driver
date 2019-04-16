(function(window)
{
    const Gitana = window.Gitana;

    Gitana.Changeset = Gitana.AbstractRepositoryObject.extend(
    /** @lends Gitana.Changeset.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRepositoryObject
         *
         * @class Changeset
         *
         * @param {Gitana.Repository} repository
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(repository, object)
        {
            this.base(repository, object);

            this.objectType = function() { return "Gitana.Changeset"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_CHANGESET;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().changeset(this.getRepository(), this);
        },

        /**
         * Lists the nodes on this changeset.
         *
         * @chained node map
         *
         * @param {Object} pagination optional pagination
         */
        listNodes: function(pagination)
        {
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId() + "/nodes";
            };

            const chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction, params);
        }

    });

})(window);
