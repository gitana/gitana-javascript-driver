(function($) {

    module("repositoryAuthorities1");

    // Test case : Repository authorities
    test("Repository authorities", function() {
        stop();

        expect(4);

        var userId1 = "testUser" + new Date().getTime() + "_1";
        var userId2 = "testUser" + new Date().getTime() + "_2";

        var user1 = null;
        var user2 = null;

        var repository = null;

        // set up the test as the admin user
        var setupTest = function()
        {
            var gitana = new Gitana();
            gitana.authenticate("admin", "admin").then(function() {

                // NOTE: this = server

                // create repository
                this.createRepository().then(function() {
                    repository = this;
                });

                // create user 1
                this.createUser(userId1, {"password": "password"}).then(function() {
                    user1 = this;
                });

                // create user 2
                this.createUser(userId2, {"password": "password"}).then(function() {
                    user2 = this;
                });

                // after we've resolved references to user1, user2 and repository
                this.then(function() {

                    // rescind the automatic "COLLABORATOR" authority for the "everyone" group against the repository
                    this.subchain(repository).revokeAllAuthorities(Gitana.EVERYONE);

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
            var gitana = new Gitana();
            gitana.authenticate(userId1, "password").readRepository(repository.getId()).then(function() {

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
            var gitana = new Gitana();
            gitana.authenticate(userId2, "password").readRepository(repository.getId()).then(function(){

                // NOTE: this = repository

                var trap1 = function(err)
                {
                    // NOTE: this = repository
                    ok(true, "User not allowed to create branch");

                    success();
                };

                this.trap(trap1).createBranch().then(function() {
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
