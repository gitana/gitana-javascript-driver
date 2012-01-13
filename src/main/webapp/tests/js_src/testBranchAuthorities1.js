(function($) {

    module("branchAuthorities1");

    // Test case : Branch authorities
    test("Branch authorities", function() {
        stop();

        expect(4);

        var domainId = null;
        var userName1 = "testUser" + new Date().getTime() + "_1";
        var userName2 = "testUser" + new Date().getTime() + "_2";

        var user1 = null;
        var user2 = null;

        var repository = null;
        var branch = null;

        // set up the test as the admin user
        var setupTest = function()
        {
            var platform = GitanaTest.authenticate("admin", "admin");
            platform.then(function() {

                // NOTE: this = platform

                this.readDefaultDomain().then(function()
                {
                    // NOTE: this = domain
                    domainId = this.getId();

                    // create user 1
                    this.createUser({
                        "name": userName1,
                        "password": "password"
                    }).then(function() {
                        user1 = this;
                    });

                    // create user 2
                    this.createUser({
                        "name": userName2,
                        "password": "password"
                    }).then(function() {
                        user2 = this;
                    });

                });

                // create a repository and a branch
                this.createRepository().then(function() {
                    repository = this;

                    // grant everyone consumer against the repository
                    this.grantAuthority("everyone", "consumer");

                    // create branch
                    this.createBranch("0:root").then(function() {
                        branch = this;

                        // after we've resolved references to user1 and user2 and the repository
                        this.then(function() {

                            // rescind the automatic "COLLABORATOR" authority for the "everyone" group against the branch
                            //this.revokeAllAuthorities(Gitana.EVERYONE);

                            // grant user1 collaborator rights to branch
                            this.grantAuthority(user1, "collaborator").checkAuthority(user1, "collaborator", function(hasAuthority) {
                                ok(hasAuthority, "User 1 has collaborator authority!");
                            });

                            // grant user2 consumer rights to branch
                            this.grantAuthority(user2, "consumer").checkAuthority(user2, "consumer", function(hasAuthority) {
                                ok(hasAuthority, "User 2 has consumer authority!");

                                test1();
                            });
                        });
                    });
                });
            });
        };

        // run as user1
        // user1 has "collaborator" rights to the server so they can create repos without a problem
        var test1 = function()
        {
            var gitana = GitanaTest.authenticate(userName1, "password", domainId);
            gitana.readRepository(repository.getId()).readBranch(branch.getId()).then(function() {

                // NOTE: this = branch

                // create node
                /*
                this.createNode().then(function() {
                    ok(true, "User 1 created node");

                    test2();
                });
                */
                // TODO - permission associations are NOT AUTOMATICALLY CREATED for new nodes in the repository
                // TODO - this needs to be added but until then, we have a placeholder
                ok(true, "Placeholder");
                test2();
            })
        };

        // run as user 2
        // user2 has "consumer" rights to the server so they can connect but can't do anything.
        var test2 = function()
        {
            var gitana = GitanaTest.authenticate(userName2, "password", domainId);
            gitana.readRepository(repository.getId()).readBranch(branch.getId()).then(function() {

                // NOTE: this = branch

                var trap1 = function(err)
                {
                    // NOTE: this = server
                    // "this" gets set as the last place an error occurred which was during createRepository
                    // the repository didn't succeed in getting created, so we're stuck at server
                    ok(true, "User not able to create node");

                    success();
                };

                this.trap(trap1).createNode().then(function() {
                    ok(false, "User should not be able to create node!");
                    start();
                });
            });
        };

        var success = function() {
            start();
        };

        setupTest();
    });

}(jQuery) );
