(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Person = Gitana.Node.extend(
    /** @lends Gitana.Person.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Node
         *
         * @class Person
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.Person";
        },

        getPrincipalId: function()
        {
            return this.get("principal-id");
        },

        /**
         * Reads the user object for this person.
         *
         * @chained security user
         */
        readUser: function()
        {
            // what we're handing back
            var result = this.subchain(this.getFactory().securityUser(this.getServer()));

            // work
            result.subchain(this.getServer()).readUser(this.getPrincipalId()).then(function() {
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

    });

    Gitana.ObjectFactory.register("n:person", Gitana.Person);

})(window);
