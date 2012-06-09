(function() {

    module("domainPrincipalTransfer1");

    // Test case : Domain Principal Transfer #1
    test("Domain Principal Transfer #1", function()
    {
        stop();

        expect(3);

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
                this.createUser({"name": "user1", "password": "pw1", "property1": "value1"}).then(function() {

                    // NOTE: this = user

                    // export archive
                    this.exportArchive({
                        "vault": vault.getId(),
                        "group": "a",
                        "artifact": "b",
                        "version": "1"
                    });
                });
            });

            // create another domain, import archive onto a principal
            this.createDomain().then(function() {

                // NOTE: this = domain

                // create a user
                this.createUser({"name": "user2", "password": "pw2"}).then(function() {

                    // NOTE: this = user

                    // import the archive
                    this.importArchive({
                        "vault": vault.getId(),
                        "group": "a",
                        "artifact": "b",
                        "version": "1"
                    });

                    // reload this user + verify
                    this.reload().then(function() {

                        // check the value
                        equal(this.get("property1"), "value1", "Found correct imported property for user");
                        equal(this.get("name"), "user1", "Found correct name for user");

                    });

                });
            });

            // create another domain, import archive onto domain (creating new principal)
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
