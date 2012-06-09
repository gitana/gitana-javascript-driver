(function() {

    module("domainTransfer1");

    // Test case : Domain Transfer #1
    test("Domain Transfer #1", function()
    {
        stop();

        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // create a vault
            var vault = null;
            this.createVault().then(function() {
                vault = this;
            });

            // create a domain, create a user, export archive
            this.createDomain().then(function() {

                // NOTE: this = domain

                // create a user
                this.createUser({"name": "user1", "password": "pw1"});

                // export archive
                this.exportArchive({
                    "vault": vault.getId(),
                    "group": "a",
                    "artifact": "b",
                    "version": "1"
                });
            });

            // create another domain, import archive
            this.createDomain().then(function() {

                // NOTE: this = domain

                // import the archive
                this.importArchive({
                    "vault": vault.getId(),
                    "group": "a",
                    "artifact": "b",
                    "version": "1"
                });

                // verify the user exists in this domain
                this.readPrincipal("user1").then(function() {
                    ok(true, "Found user");

                    start();
                });
            });
        });
    });

}());
