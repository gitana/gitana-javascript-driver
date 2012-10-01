(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Changeset = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Changeset.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Changeset
         *
         * @param {Gitana.Repository} repository
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(repository, object)
        {
            this.base(repository.getPlatform(), object);

            this.objectType = "Gitana.Changeset";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return repository; };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return repository.getId(); };

            /**
             * Gets the Gitana Platform object.
             *
             * @inner
             *
             * @returns {Gitana.Platform} The Gitana Platform object
             */
            this.getPlatform = function() { return repository.getPlatform(); };
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
            return this.getFactory().changeset(this.getRepository(), this.object);
        },

        /**
         * Lists the nodes on this changeset.
         *
         * @chained node map
         *
         * @param [Object] pagination optional pagination
         */
        listNodes: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId() + "/nodes";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction, params);
        }

    });

})(window);
