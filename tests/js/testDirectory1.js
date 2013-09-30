(function($) {

    module("directory1");

    // Test case : Directory CRUD operations
    test("Directory CRUD operations", function()
    {
        stop();

        expect(6);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var directory = null;

            // first: create, update, reload directory
            this.createDirectory().then(function() {

                ok(true, "Successfully created");

                // set some properties
                this["title"] = "Test Title";
                this["description"] = "Test Description";
                this["custom"] = "Test Value";

                this.update().reload().then(function() {

                    equals(this["title"], "Test Title", "Property #1 match");
                    equals(this["description"], "Test Description", "Property #2 match");
                    equals(this["custom"], "Test Value", "Property #3 match");

                    directory = this;
                });
            });

            // then test out deletes
            this.listDirectories({
                "limit": -1
            }).then(function() {

                var directory2 = this.get(directory.getId());
                ok(directory2, "Successfully retrieved from list");

                this.subchain(directory2).del().then(function() {

                    ok(true, "Successfully deleted");

                    // signal end of test?
                    start();

                });
            });
        });
    });

}(jQuery) );
