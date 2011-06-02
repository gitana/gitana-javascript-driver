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
        }

    });

    Gitana.ObjectFactory.register("n:person", Gitana.Person);

})(window);
