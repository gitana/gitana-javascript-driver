(function($) {

    module("repository1");

    // Test case : Repository CRUD operations
    test("Repository CRUD operations", function()
    {
        stop();

        expect(6);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            var repo = null;

            // first: create, update, reload repository
            this.createRepository().then(function() {

                ok(true, "Successfully created");

                // set some properties
                this.object["title"] = "Test Title";
                this.object["description"] = "Test Description";
                this.object["custom"] = "Test Value";

                this.update().reload().then(function() {

                    equals(this.object["title"], "Test Title", "Property #1 match");
                    equals(this.object["description"], "Test Description", "Property #2 match");
                    equals(this.object["custom"], "Test Value", "Property #3 match");

                    repo = this;
                });
            });

            // then test out deletes
            this.listRepositories().then(function() {

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
