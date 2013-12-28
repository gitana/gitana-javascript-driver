(function($) {

    module("repository1");

    // Test case : Repository CRUD operations
    _asyncTest("Repository CRUD operations", function()
    {
        expect(6);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var repo = null;

            // first: create, update, reload repository
            this.createRepository().then(function() {

                ok(true, "Successfully created");

                // set some properties
                this["title"] = "Test Title";
                this["description"] = "Test Description";
                this["custom"] = "Test Value";

                this.update().reload().then(function() {

                    equal(this["title"], "Test Title", "Property #1 match");
                    equal(this["description"], "Test Description", "Property #2 match");
                    equal(this["custom"], "Test Value", "Property #3 match");

                    repo = this;
                });
            });

            // then test out deletes
            this.listRepositories({
                "limit": -1
            }).then(function() {

                var repo2 = this.get(repo.getId());
                ok(repo2, "Successfully retrieved from list");

                this.subchain(repo2).del().then(function() {

                    ok(true, "Successfully deleted");

                    // signal end of test?
                    start();

                });
            });
        });
    });


}(jQuery) );
