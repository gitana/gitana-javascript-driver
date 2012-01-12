(function($) {

    module("domainPrincipal6");

    // Test case : Principal ACL
    test("Test Principal 6", function()
    {
        stop();

        expect(9);

        var tag = "sec6_" + new Date().getTime();

        // user names
        var userName1 = "user1_" + new Date().getTime();
        var userName2 = "user2_" + new Date().getTime();
        var userName3 = "user3_" + new Date().getTime();

        // group names
        var groupName1 = "group1_" + new Date().getTime();
        var groupName2 = "group2_" + new Date().getTime();

        // start
        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.readDomain("default").then(function() {

            // NOTE: this = domain

            // create users
            var user1 = null;
            this.createUser({
                "name": userName1,
                "tag": tag,
                "password": "test"
            }).then(function() {
                user1 = this;
            });

            var user2 = null;
            this.createUser({
                "name": userName2,
                "tag": tag,
                "password": "test"
            }).then(function() {
                user2 = this;
            });

            var user3 = null;
            this.createUser({
                "name": userName3,
                "tag": tag,
                "password": "test"
            }).then(function() {
                user3 = this;
            });

            // create groups
            var group1 = this;
            this.createGroup({
                "name": groupName1,
                "tag": tag
            }).then(function() {
                group1 = this;
            });
            var group2 = this;
            this.createGroup({
                "name": groupName2,
                "tag": tag
            }).then(function() {
                group2 = this;
            });

            this.then(function() {

                // add user1 to group1
                group1.addMember(user1);

                // add user3 to group2
                group2.addMember(user3);

                this.then(function() {

                    // grant MANAGER rights for members of group1 to manage user3
                    this.subchain(user3).then(function() {

                        // NOTE: this = user3

                        this.grantAuthority(group1, "manager").then(function() {

                            var f1 = function()
                            {
                                // NOTE: this = user3

                                // verify that user1 can see user3 and can update user3
                                var gitanaUser1 = GitanaTest.authenticate(userName1, "test");
                                gitanaUser1.readDomain("default").readPrincipal(userName3).then(function() {

                                    // NOTE: this = user3
                                    ok(true, "User 1 was able to see User 3");

                                    this.update();
                                    ok(true, "User 1 was able to update User 3");

                                    f2.call(this);
                                });
                            };

                            var f2 = function()
                            {
                                // NOTE: this = user3

                                // verify that user2 can see user3 but cannot update user3
                                var gitanaUser2 = GitanaTest.authenticate(userName2, "test");
                                gitanaUser2.readDomain("default").readPrincipal(userName3).then(function() {

                                    // NOTE: this = user3
                                    ok(true, "User 2 was able to see User 3");

                                    this.trap(function() {
                                        ok(true, "User 2 was not able to update User 3");

                                        f3.call(this);

                                    }).update().then(function() {
                                        ok(false, "User 2 should not be able to update User 3");
                                    })
                                });
                            };

                            var f3 = function()
                            {
                                // NOTE: this = user3

                                // verify that user3 can see user3 and can update user 3 (self MANAGER rights)
                                var gitanaUser3 = GitanaTest.authenticate(userName3, "test");
                                gitanaUser3.readDomain("default").readPrincipal(userName3).then(function() {

                                    // NOTE: this = user3
                                    ok(true, "User 3 was able to see User 3");

                                    this.update();
                                    ok(true, "User 3 was able to update User 3");

                                    f4.call(this);
                                });
                            };

                            var f4 = function()
                            {
                                // NOTE: this = user3

                                // revoke EVERYONE rights (CONSUMER) for user3
                                this.revokeAllAuthorities("everyone").then(function() {

                                    var f5 = function()
                                    {
                                        // NOTE: this = user3

                                        // verify that user2 cannot see user3
                                        var gitanaUser2 = GitanaTest.authenticate(userName2, "test");
                                        gitanaUser2.readDomain("default").trap(function() {
                                            ok(true, "User 2 cannot see User 3");

                                            f6.call(this);

                                        }).readPrincipal(userName3).then(function() {
                                            ok(false, "User 2 should not be able to see User 3");
                                        });
                                    };

                                    var f6 = function()
                                    {
                                        // NOTE: this = user3

                                        // verify that user3 can still see user3 since they are inherently a MANAGER of themselves
                                        var gitanaUser3 = GitanaTest.authenticate(userName3, "test");
                                        gitanaUser3.readDomain("default").readPrincipal(userName3).then(function() {

                                            // NOTE: this = user3
                                            ok(true, "User 3 was able to see User 3");

                                            this.update();
                                            ok(true, "User 3 was able to update User 3");

                                            success();
                                        });
                                    };

                                    f5.call(this);
                                });
                            };

                            f1.call(this);
                        })
                    });
                });
            });

            var success = function()
            {
                start();
            };
        });
    });

}(jQuery) );
