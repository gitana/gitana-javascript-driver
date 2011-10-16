(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Changeset = Gitana.AbstractObject.extend(
    /** @lends Gitana.Changeset.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Changeset
         *
         * @param {Gitana.Repository} repository
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(repository, object)
        {
            this.base(repository.getServer(), object);

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
             * Gets the Gitana Server object.
             *
             * @inner
             *
             * @returns {Gitana.Server} The Gitana Server object
             */
            this.getServer = function() { return repository.getServer(); };
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
         * Reload.
         *
         * @chained changeset
         *
         * @public
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId()
            };

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update.
         *
         * @chained changeset
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId()
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },

        /**
         * Delete.
         *
         * @chained repository
         *
         * @public
         *
         * NOTE: not implemented but provided for NOOP consistency
         */
        del: function()
        {
            // TODO
            var chainable = this.subchain(this.getRepository());
            return this.subchain(chainable).then(function() {
            });
        },

        /**
         * Lists the nodes on this changeset.
         *
         * @chained node map
         */
        listNodes: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId() + "/nodes";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction);
        }

    });

})(window);
