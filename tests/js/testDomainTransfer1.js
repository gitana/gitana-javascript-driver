(function() {

    module("domainTransfer1");

    // Test case : Domain Transfer #1
    _asyncTest("Domain Transfer #1", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // create a user
            var user = null;
            var username = "user-" + new Date().getTime();
            this.readPrimaryDomain().createUser({
                "name": username,
                "password": "pw"
            }).then(function() {
                user = this;
            });

            this.readRegistrar("default").then(function() {

                // NOTE: this = registrar

                // create a tenant for our user
                var clientConfig = null;
                this.createTenant(user, "unlimited").then(function() {

                    // NOTE: this = tenant

                    // read the default client
                    this.readDefaultAllocatedClientObject(function(theClientConfig) {
                        clientConfig = theClientConfig;
                    });

                });

                this.then(function() {

                    // sign in as the new tenant
                    new Gitana({
                        "clientKey": clientConfig.getKey(),
                        "clientSecret": clientConfig.getSecret()
                    }).authenticate({
                        "username": user.getName(),
                        "password": "pw"
                    }).then(function() {

                        // NOTE: this = platform

                        // create a vault
                        var vault = null;
                        this.createVault().then(function() {
                            vault = this;
                        });

                        this.then(function() {

                            // create a domain, create a user, export archive
                            this.createDomain().then(function() {

                                // NOTE: this = domain

                                // create a user
                                this.createUser({"name": "user1", "password": "pw1"});

                                // export the archive
                                this.exportArchive({
                                    "vault": vault.getId(),
                                    "group": "a",
                                    "artifact": "b",
                                    "version": "1"
                                });
                            });

                            // import onto platform
                            var newDomainId = null;
                            this.importArchive({
                                "vault": vault.getId(),
                                "group": "a",
                                "artifact": "b",
                                "version": "1"
                            }).then(function() {

                                // NOTE: this = job
                                newDomainId = this.getSingleImportTargetId();
                            });

                            this.then(function() {

                                // NOTE: this = platform
                                this.readDomain(newDomainId).then(function() {

                                    // verify the user exists in this domain
                                    this.readPrincipal("user1").then(function() {
                                        ok(true, "Found user (2)");

                                        start();
                                    });

                                });
                            });
                        });

                    });
                });
            });
        });
    });

}());
