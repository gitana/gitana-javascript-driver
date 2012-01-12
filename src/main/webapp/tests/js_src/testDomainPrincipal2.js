(function($) {

    module("domainPrincipal2");

    // Test case : Domain Principal 1
    //
    // Tests out user crud operations against a domain
    //

    test("Domain Principal 2", function()
    {
        stop();

        expect(5);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.readDomain("default").then(function() {

            // NOTE: this = domain

            // count the number of groups
            var count = 0;
            this.listGroups().each(function() {
                count++;
            });

            // create a group
            var group1 = null;
            var groupName1 = "group" + new Date().getTime();
            this.createGroup({
                "name": groupName1
            }).then(function() {
                group1 = this;
            });

            // list groups and verify size + 1
            var recount = 0;
            this.listGroups().each(function() {
                recount++;
            }).then(function() {
                equals(recount, count + 1, "Size incremented by 1");
            });

            // updates
            this.then(function() {

                this.subchain(group1).then(function() {

                    // update some properties
                    this.object["title"] = "Test Title";
                    this.object["description"] = "Test Description";
                    this.object["customProperty"] = "Custom Value";

                    this.update().reload().then(function() {

                        // check properties
                        equals("Test Title", group1.object["title"]);
                        equals("Test Description", group1.object["description"]);
                        equals("Custom Value", group1.object["customProperty"]);

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