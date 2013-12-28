(function($) {

    module("vault1");

    // Test case : Vault CRUD operations
    _asyncTest("Vault CRUD operations", function()
    {
        expect(6);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            var vault = null;

            // first: create, update, reload domain
            this.createVault().then(function() {

                ok(true, "Successfully created");

                // set some properties
                this["title"] = "Test Title";
                this["description"] = "Test Description";
                this["custom"] = "Test Value";

                this.update().reload().then(function() {

                    equal(this["title"], "Test Title", "Property #1 match");
                    equal(this["description"], "Test Description", "Property #2 match");
                    equal(this["custom"], "Test Value", "Property #3 match");

                    vault = this;
                });
            });

            // then test out deletes
            this.listVaults({
                "limit": -1
            }).then(function() {

                var vault2 = this.get(vault.getId());
                ok(vault2, "Successfully retrieved from list");

                this.subchain(vault2).del().then(function() {

                    ok(true, "Successfully deleted");

                    // signal end of test?
                    start();

                });
            });
        });
    });

}(jQuery) );
