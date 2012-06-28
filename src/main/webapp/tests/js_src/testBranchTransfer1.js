(function() {

    module("branchTransfer1");

    // Test case : Branch Transfer 1
    test("Branch Transfer 1", function()
    {
        stop();

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
                        "clientId": clientConfig.getKey(),
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

                            // NOTE: this = platform

                            // create a repository
                            this.createRepository().then(function() {

                                // NOTE: this = repository

                                // populate master branch and export it
                                this.readBranch("master").then(function() {

                                    // NOTE: this = branch

                                    // create a few nodes
                                    this.createNode({"smoke": "on the water"});
                                    this.createNode({"so": "far from the clyde"});
                                    this.createNode({"comfortably": "numb"});
                                    this.createNode({"axl": "rose"});
                                    this.createNode({"slipped": "away"});
                                    this.createNode({"autumn": "years"});
                                    this.createNode({"hazel": "smoke"});
                                    this.createNode({"remembrance": "day"});

                                    // export archive (a "publication")
                                    // everything after 0:root
                                    this.exportArchive({
                                        "vault": vault.getId(),
                                        "group": "a",
                                        "artifact": "b",
                                        "version": "1",
                                        "configuration": {
                                            "startChangeset": "0:root",
                                            "payload": "publication"
                                        }
                                    });
                                });

                                // create a new branch
                                this.then(function() {

                                    this.createBranch("0:root").then(function() {

                                        // NOTE: this = branch

                                        // import the archive
                                        // since the archive starts at 0:root, it just contains the nodes from above
                                        this.importArchive({
                                            "vault": vault.getId(),
                                            "group": "a",
                                            "artifact": "b",
                                            "version": "1"
                                        });

                                        // query nodes to verify
                                        this.queryNodes({"comfortably": "numb"}).count(function(count) {
                                            equal(count, 1, "Found count of 1");

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

    });

}());
