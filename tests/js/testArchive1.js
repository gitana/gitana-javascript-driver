(function($) {

    module("archive1");

    // Test case : Archive CRUD operations
    _asyncTest("Archive CRUD operations", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            var vault = null;

            // create a vault
            this.createVault().then(function() {

                ok(true, "Successfully created");

                // TODO: how to test archive operations if we can't upload archives...?

                start();
            });

        });
    });

}(jQuery) );
