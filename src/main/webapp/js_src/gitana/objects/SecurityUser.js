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
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/security/users/" + this.getId();
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
            // NOTE: pass control back to the server
            return this.chainDelete(this.getServer(), "/security/users/" + this.getId());
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
            return this.chainReload(this.clone(), "/security/users/" + this.getId());
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
            return this.chainUpdate(this.clone(), "/security/users/" + this.getId());
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
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // PROPERTIES
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////

        getFirstName: function()
        {
            return this.get("firstName");
        },

        setFirstName: function(firstName)
        {
            this.set("firstName", firstName);
        },

        getLastName: function()
        {
            return this.get("lastName");
        },

        setLastName: function(lastName)
        {
            this.set("lastName", lastName);
        },

        getCompanyName: function()
        {
            return this.get("companyName");
        },

        setCompanyName: function(companyName)
        {
            this.set("companyName", companyName);
        },

        getEmail: function()
        {
            return this.get("email");
        },

        setEmail: function(email)
        {
            this.set("email", email);
        }

    });

})(window);
