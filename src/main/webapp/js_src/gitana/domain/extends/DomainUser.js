(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.DomainUser =
    {
        TYPE: "USER",

        /**
         * Reads the person node for this user.
         *
         * @param branch
         * @param createIfNotFound
         *
         * @chained person
         * @public
         */
        readPersonNode: function(branch, createIfNotFound)
        {
            // what we hand back
            var result = this.subchain(this.getFactory().node(branch, "n:person"));

            // work
            result.subchain(branch).readPersonNode(this.getDomainQualifiedId(), createIfNotFound).then(function() {
                result.handleResponse(this.object);
            });

            return result;
        },

        /**
         * Changes the password for this user.
         *
         * @param newPassword
         *
         * @chained this
         * @public
         */
        changePassword: function(newPassword)
        {
            var object = {
                "password": newPassword
            };

            return this.chainPostEmpty(this, this.getUri() + "/changepassword", {}, object);
        },

        hasIdentity: function()
        {
            return (this.getDirectoryId() && this.getIdentityId());
        },

        getDirectoryId: function()
        {
            return this.get("directoryId");
        },

        getIdentityId: function()
        {
            return this.get("identityId");
        },

        readDirectory: function()
        {
            var directory = this.getFactory().directory(this.getPlatform(), {
                "_doc": this.getDirectoryId()
            });

            // what we hand back
            var result = this.subchain(directory);

            // work
            result.subchain(this.getPlatform()).readDirectory(this.getDirectoryId()).then(function() {
                result.handleResponse(this.object);
            });

            return result;
        },

        readIdentity: function()
        {
            var self = this;

            var directory = this.getFactory().directory(this.getPlatform(), {
                "_doc": this.getDirectoryId()
            });

            var identity = this.getFactory().identity(directory, {
                "_doc": this.getIdentityId()
            });


            // what we hand back
            var result = this.subchain(identity);

            // work
            result.subchain(this.getPlatform()).readDirectory(self.getDirectoryId()).then(function() {

                // NOTE: this = directory

                directory.handleResponse(this.object);

                this.readIdentity(self.getIdentityId()).then(function() {

                    // NOTE: this = identity

                    identity.handleResponse(this.object);

                    // all done
                });

                //return false;
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
        },

        getJobTitle: function()
        {
            return this.get("jobTitle");
        },

        setJobTitle: function(jobTitle)
        {
            this.set("jobTitle", jobTitle);
        },

        getAddress: function()
        {
            return this.get("address");
        },

        setAddress: function(address)
        {
            this.set("address", address);
        },

        getCity: function()
        {
            return this.get("city");
        },

        setCity: function(city)
        {
            this.set("city", city);
        },

        getState: function()
        {
            return this.get("state");
        },

        setState: function(state)
        {
            this.set("state", state);
        },

        getZipcode: function()
        {
            return this.get("zipcode");
        },

        setZipcode: function(zipcode)
        {
            this.set("zipcode", zipcode);
        },

        getPhoneNumber: function()
        {
            return this.get("phoneNumber");
        },

        setPhoneNumber: function(phoneNumber)
        {
            this.set("phoneNumber", phoneNumber);
        }

    };

})(window);
