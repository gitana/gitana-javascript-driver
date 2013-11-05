(function($) {

    module("domainPrincipal1");

    // Test case : Domain Principal 1
    //
    // Tests out user crud operations against a domain
    //
    _asyncTest("Domain Principal 1", function()
    {


        expect(5);

        var platform = GitanaTest.authenticateFullOAuth();
        platform.readPrimaryDomain().then(function() {

            // NOTE: this = domain

            // manually count the number of users
            var count = 0;

            // first: list and count all of the users manually
            this.listUsers({
                "limit": -1
            }).count(function(c) {
                count = c;
            });

            // second: create a user
            var user1 = null;
            var userName1 = "user" + new Date().getTime();
            this.createUser({
                "name": userName1
            }).then(function() {
                user1 = this;
            });

            // third: list users again and verify size + 1
            // list users
            var recount = 0;
            this.listUsers({
                "limit": -1
            }).count(function(c) {
                recount = c;
                equals(recount, count + 1, "Size incremented by 1");
            });

            // at the end
            this.then(function()
            {
                // NOTE: this subchain gets wrapped into a then() above because the user1 variable resolves late

                // update user properties
                this.subchain(user1).then(function() {

                    // NOTE: this = user1

                    // update some properties
                    this["title"] = "Test Title";
                    this["description"] = "Test Description";
                    this["customProperty"] = "Custom Value";

                    this.update().reload().then(function() {

                        // NOTE: this = user1

                        // check properties
                        equals("Test Title", this["title"]);
                        equals("Test Description", this["description"]);
                        equals("Custom Value", this["customProperty"]);

                        // now delete
                        this.del().then(function() {
                            ok(true, "Successfully deleted");

                            success();
                        });
                    });
                });
            });


        });

        var success = function()
        {
            start();
        };

    });


}(jQuery) );