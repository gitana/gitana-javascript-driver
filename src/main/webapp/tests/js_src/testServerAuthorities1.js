(function($) {

    module("serverAuthorities1");

    // Test case : Server authorities
    test("Server authorities", function() {
        stop();

        expect(5);

        var userId1 = "testUser" + new Date().getTime() + "_1";
        var userId2 = "testUser" + new Date().getTime() + "_2";

        var user1 = null;
        var user2 = null;

        // set up the test as the admin user
        var setupTest = function()
        {
            var gitana = new Gitana();
            gitana.authenticate("admin", "admin").then(function() {

                // NOTE: this = server

                // grant the "COLLABORATOR" authority to the "everyone" group
                // normally this is granted but we want to make sure in case the test failed on a previous run
                this.grantAuthority(Gitana.EVERYONE, "collaborator");

                // create user 1
                this.createUser(userId1, {"password": "password"}).then(function() {
                    user1 = this;
                });

                // create user 2
                this.createUser(userId2, {"password": "password"}).then(function() {
                    user2 = this;
                });

                // after we've resolved references to user1 and user2
                this.then(function() {

                    // rescind the automatic "COLLABORATOR" authority for the "everyone" group against the server
                    this.revokeAllAuthorities(Gitana.EVERYONE);

                    // grant user1 collaborator rights to server
                    this.grantAuthority(user1, "collaborator").checkAuthority(user1, "collaborator", function(hasAuthority) {
                        ok(hasAuthority, "User 1 has collaborator authority!");
                    });

                    // grant user2 consumer rights to server
                    this.grantAuthority(user2, "consumer").checkAuthority(user2, "consumer", function(hasAuthority) {
                        ok(hasAuthority, "User 2 has consumer authority!");

                        test1();
                    });
                });
            });
        };

        // run as user1
        // user1 has "collaborator" rights to the server so they can create repos without a problem
        var test1 = function()
        {
            var gitana = new Gitana();
            gitana.authenticate(userId1, "password").then(function() {

                // NOTE: this = server

                // create repository
                var repo = null;
                this.createRepository().then(function() {
                    repo = this;
                });

                // pull back list
                this.listRepositories().count(function(count) {
                    ok(count > 0, "Repository list count > 0");
                    ok(this.get(repo.getId()), "Found repository");

                    test2();
                });
            })
        };

        // run as user 2
        // user2 has "consumer" rights to the server so they can connect but can't do anything.
        var test2 = function()
        {
            var gitana = new Gitana();
            gitana.authenticate(userId2, "password").then(function(){

                // NOTE: this = server

                var trap1 = function(err)
                {
                    // NOTE: this = server
                    // "this" gets set as the last place an error occurred which was during createRepository
                    // the repository didn't succeed in getting created, so we're stuck at server
                    ok(true, "User could not create repository");

                    success();
                };

                this.trap(trap1).createRepository().then(function() {
                    ok(false, "User should not be able to create repository!");

                    success();
                });
            });
        };

        var success = function() {

            var gitana = new Gitana();
            gitana.authenticate("admin", "admin").then(function() {

                // NOTE: this = server

                // grant the "COLLABORATOR" authority to the "everyone" group
                // normally this is granted but we want to make sure in case the test failed on a previous run
                this.grantAuthority(Gitana.EVERYONE, "collaborator");
            });

            start();
        };

        setupTest();
    });

}(jQuery) );
