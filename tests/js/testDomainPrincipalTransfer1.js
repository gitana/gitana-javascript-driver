(function() {

    module("domainPrincipalTransfer1");

    // Test case : Domain Principal Transfer #1
    _asyncTest("Domain Principal Transfer #1", function()
    {
        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // create a user
            var user = null;
            var username = "user-" + new Date().getTime();
            this.readPrimaryDomain().createUser({
                "name": username,
                "password": "pw123456"
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
                        "password": "pw123456"
                    }).then(function() {

                        // NOTE: this = platform

                        // create a vault
                        var vault = null;
                        this.createVault().then(function() {
                            vault = this;
                        });

                        this.then(function() {

                            // NOTE: this = platform

                            // create a domain, create a user, export archive
                            this.createDomain().then(function() {

                                // NOTE: this = domain

                                // create a user
                                this.createUser({"name": "user1", "password": "pw123456", "property1": "value1"}).then(function() {

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

                                    // check the value
                                    equal(this.get("property1"), "value1", "Found correct imported property for user");
                                    equal(this.get("name"), "user1", "Found correct name for user");

                                    start();
                                });
                            });

                        });
                    });
                });
            });
        });
    });

}());
