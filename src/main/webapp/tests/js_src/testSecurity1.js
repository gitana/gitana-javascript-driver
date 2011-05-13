(function($) {

    module("security1");

    // Test case : User CRUD
    test("User CRUD", function()
    {
        stop();

        expect(5);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            // manually count the number of users
            var count = 0;

            // first: list and count all of the users manually
            this.listUsers().count(function(c) {
                count = c;
            });

            // second: create a user
            var user1 = null;
            var userId1 = "user" + new Date().getTime();
            this.createUser(userId1).then(function() {
                user1 = this;
            });

            // third: list users again and verify size + 1
            // list users
            var recount = 0;
            this.listUsers().count(function(c) {
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
                    this.object["title"] = "Test Title";
                    this.object["description"] = "Test Description";
                    this.object["customProperty"] = "Custom Value";

                    this.update().reload().then(function() {

                        // NOTE: this = user1

                        // check properties
                        equals("Test Title", user1.object["title"]);
                        equals("Test Description", user1.object["description"]);
                        equals("Custom Value", user1.object["customProperty"]);

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