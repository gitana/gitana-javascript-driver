(function($) {

    module("domain1");

    // Test case : Domain CRUD operations
    _asyncTest("Domain CRUD operations", function()
    {
        expect(6);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var domain = null;

            // first: create, update, reload domain
            this.createDomain().then(function() {

                ok(true, "Successfully created");

                // set some properties
                this["title"] = "Test Title";
                this["description"] = "Test Description";
                this["custom"] = "Test Value";

                this.update().reload().then(function() {

                    equal(this["title"], "Test Title", "Property #1 match");
                    equal(this["description"], "Test Description", "Property #2 match");
                    equal(this["custom"], "Test Value", "Property #3 match");

                    domain = this;
                });
            });

            // then test out deletes
            this.listDomains({
                "limit": -1
            }).then(function() {

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
