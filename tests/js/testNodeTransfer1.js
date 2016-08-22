(function() {

    module("nodeTransfer1");

    // Test case : Node Transfer 1
    _asyncTest("Node Transfer 1", function()
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

                            // create a repository
                            this.createRepository().then(function() {

                                // NOTE: this = repository

                                // populate master branch and export it
                                this.readBranch("master").then(function() {

                                    // NOTE: this = branch

                                    console.log("Master branch ID: " + this.getId());

                                    // create a root node
                                    var n1 = null;
                                    this.createNode({"title":"First"}).then(function() {
                                        n1 = this;
                                    });

                                    this.then(function() {

                                        // create a few nodes
                                        this.createNode({"smoke": "on the water", "cat": "abc"}).associateOf(n1, "a:child");
                                        this.createNode({"so": "far from the clyde", "cat": "abc"}).associateOf(n1, "a:child");
                                        this.createNode({"comfortably": "numb", "cat": "abc"}).associateOf(n1, "a:child");
                                        this.createNode({"axl": "rose", "cat": "abc"}).associateOf(n1, "a:child");
                                        this.createNode({"slipped": "away", "cat": "abc"}).associateOf(n1, "a:child");
                                        this.createNode({"autumn": "years", "cat": "abc"}).associateOf(n1, "a:child");
                                        this.createNode({"hazel": "smoke", "cat": "abc"}).associateOf(n1, "a:child");
                                        this.createNode({"remembrance": "day", "cat": "abc"}).associateOf(n1, "a:child");
                                    });

                                    this.then(function() {
                                        this.subchain(n1).then(function() {

                                            // NOTE: this = root node

                                            // export
                                            this.exportArchive({
                                                "vault": vault.getId(),
                                                "group": "a",
                                                "artifact": "b",
                                                "version": "1"
                                            });

                                        });
                                    });
                                });

                                // create a new branch
                                this.then(function() {

                                    this.createBranch("master", "0:root").then(function() {

                                        // NOTE: this = branch
                                        var newBranch = this;

                                        console.log("New branch ID: " + this.getId());

                                        // another root node
                                        this.createNode({"title": "Second"}).then(function() {

                                            // import
                                            this.importArchive({
                                                "vault": vault.getId(),
                                                "group": "a",
                                                "artifact": "b",
                                                "version": "1"
                                            }).then(function() {

                                                setTimeout(function() {

                                                    // query nodes to verify
                                                    Chain(newBranch).queryNodes({"cat": "abc"}).count(function(count) {
                                                        equal(count, 8, "Found count of 8");

                                                        start();
                                                    });

                                                }, 5000);

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

    });

}());
