(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.SecurityUser = Gitana.Principal.extend(
    /** @lends Gitana.SecurityUser.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Principal
         *
         * @class User
         *
         * @param {Gitana.Server} server
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.SecurityUser";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().securityUser(this.getServer(), this.object);
        },

        /**
         * Delete
         *
         * @chained server
         *
         * @public
         */
        del: function()
        {
            var chainable = this.getServer().cloneSameChain();
            return this.chainDelete(chainable, "/security/users/" + this.getId());
        },

        /**
         * Reload
         *
         * @chained security user
         *
         * @public
         */
        reload: function()
        {
            var chainable = this.cloneSameChain();
            return this.chainReload(chainable, "/security/users/" + this.getId());
        },

        /**
         * Update
         *
         * @chained security user
         *
         * @public
         */
        update: function()
        {
            var chainable = this.cloneSameChain();
            return this.chainUpdate(chainable, "/security/users/" + this.getId());
        },

        /**
         * Reads the person object for this user.
         *
         * @param branch
         * @param createIfNotFound
         *
         * @chained person
         * @public
         */
        readPerson: function(branch, createIfNotFound)
        {
            // what we hand back
            var result = this.subchain(this.getFactory().node(branch, "n:person"));

            // work
            result.subchain(branch).readPerson(this.getPrincipalId(), createIfNotFound).then(function() {
                result.handleResponse(this.object);
            });

            return result;
        }

    });

})(window);
