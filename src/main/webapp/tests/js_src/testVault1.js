(function($) {

    module("vault1");

    // Test case : Vault CRUD operations
    test("Vault CRUD operations", function()
    {
        stop();

        expect(6);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            var vault = null;

            // first: create, update, reload domain
            this.createVault().then(function() {

                ok(true, "Successfully created");

                // set some properties
                this.object["title"] = "Test Title";
                this.object["description"] = "Test Description";
                this.object["custom"] = "Test Value";

                this.update().reload().then(function() {

                    equals(this.object["title"], "Test Title", "Property #1 match");
                    equals(this.object["description"], "Test Description", "Property #2 match");
                    equals(this.object["custom"], "Test Value", "Property #3 match");

                    vault = this;
                });
            });

            // then test out deletes
            this.listVaults().then(function() {

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
