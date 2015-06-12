(function($) {

    module("copy1");

    // Test case : Copy operations
    _asyncTest("Copy operations", function()
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
                        var platform = this;

                        // create a domain, create a user, export archive
                        var newDomainId = null;
                        this.createDomain().then(function() {

                            // NOTE: this = domain

                            // create a user
                            this.createUser({"name": "user1", "password": "pw123456"});

                            // copy back to platform
                            this.copy(platform).then(function() {
                                newDomainId = this.getSingleImportTargetId();
                            });
                        });

                        this.then(function() {

                            // NOTE: this = platform

                            // read the newly copied domain
                            this.readDomain(newDomainId).listUsers().count(function(count) {
                                equal(1, count, "Found one user");
                                start();
                            });
                        });
                    });
                });
            });
        });
    });

}(jQuery) );
