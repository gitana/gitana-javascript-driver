(function($) {

    module("repositoryAuthorities1");

    // Test case : Repository authorities
    test("Repository authorities", function() {
        stop();

        expect(4);

        var domainId = null;

        var userName1 = "testUser" + new Date().getTime() + "_1";
        var userName2 = "testUser" + new Date().getTime() + "_2";

        var user1 = null;
        var user2 = null;

        var repository = null;

        // set up the test as the admin user
        var setupTest = function()
        {
            var platform = GitanaTest.authenticateFullOAuth();
            platform.then(function() {

                // NOTE: this = platform

                // create repository
                this.createRepository().then(function() {
                    repository = this;
                });

                // create two users in the default domain
                this.readPrimaryDomain().then(function() {

                    // NODE: this = domain
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

                // after we've resolved references to user1, user2 and repository
                this.then(function() {

                    // grant user1 collaborator rights to repository
                    this.subchain(repository).grantAuthority(user1, "collaborator").checkAuthority(user1, "collaborator", function(hasAuthority) {
                        ok(hasAuthority, "User 1 has collaborator authority!");
                    });

                    // grant user2 consumer rights to repository
                    this.subchain(repository).grantAuthority(user2, "consumer").checkAuthority(user2, "consumer", function(hasAuthority) {
                        ok(hasAuthority, "User 2 has consumer authority!");

                        test1();
                    });
                });
            });
        };

        // run as user1
        // user1 has "collaborator" rights to the repository so they can connect and create branches without a problem
        var test1 = function()
        {
            var gitana = GitanaTest.authenticate(userName1, "password", domainId);
            gitana.readRepository(repository.getId()).then(function() {

                // NOTE: this = repository

                // create a branch
                var branch = null;
                this.createBranch("0:root").then(function() {
                    ok(true, "User 1 created branch");

                    test2();
                })
            })
        };

        // run as user 2
        // user2 has "consumer" rights to the repository so they can connect but cannot create branches
        var test2 = function()
        {
            var gitana = GitanaTest.authenticate(userName2, "password", domainId);
            gitana.readRepository(repository.getId()).then(function(){

                // NOTE: this = repository

                var trap1 = function(err)
                {
                    // NOTE: this = repository
                    ok(true, "User not allowed to create branch");

                    success();
                };

                this.trap(trap1).createBranch("0:root").then(function() {
                    ok(false, "User should not be able to create branch!");
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
