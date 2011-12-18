(function($) {

    module("domain1");

    // Test case : Domain CRUD operations
    test("Domain CRUD operations", function()
    {
        stop();

        expect(6);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            var domain = null;

            // first: create, update, reload domain
            this.createDomain().then(function() {

                ok(true, "Successfully created");

                // set some properties
                this.object["title"] = "Test Title";
                this.object["description"] = "Test Description";
                this.object["custom"] = "Test Value";

                this.update().reload().then(function() {

                    equals(this.object["title"], "Test Title", "Property #1 match");
                    equals(this.object["description"], "Test Description", "Property #2 match");
                    equals(this.object["custom"], "Test Value", "Property #3 match");

                    domain = this;
                });
            });

            // then test out deletes
            this.listDomains().then(function() {

                var domain2 = this.get(domain.getId());
                ok(domain2, "Successfully retrieved from list");

                this.subchain(domain2).del().then(function() {

                    ok(true, "Successfully deleted");

                    // signal end of test?
                    start();

                });
            });
        });
    });

}(jQuery) );
