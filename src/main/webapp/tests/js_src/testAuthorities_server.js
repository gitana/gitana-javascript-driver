(function($) {

    module("authority");

    // Test case : Authority operations.
    test("Authority operations", function() {
        stop();

        expect(4);

        var user1 = null;
        var user2 = null;

        var setupTest1 = function() {
            var _this = this;

            var driver1 = new Gitana.Driver();

            // AUTHENTICATE as admin
            driver1.security().authenticate("admin", "admin", function() {
                // CREATE USER 1
                var userId1 = "testUser" + new Date().getTime() + "_1";
                driver1.users().create(userId1, {"password":"password"}, function(status) {
                    driver1.users().read(userId1, function(u) {
                        _this.user1 = u;

                        // CREATE USER 2
                        var userId2 = "testUser" + new Date().getTime() + "_2";
                        driver1.users().create(userId2, {"password":"password"}, function(status) {
                            driver1.users().read(userId2, function(u) {
                                _this.user2 = u;

                                // rescind the automatic "COLLABORATOR" authority for the "everyone" group
                                driver1.revokeAllAuthorities(Gitana.EVERYONE, function(status) {
                                    // grant user1: COLLABORATOR
                                    driver1.grantAuthority(_this.user1, "collaborator", function(status) {
                                        driver1.checkAuthority(_this.user1, "collaborator", function(has) {
                                            ok(has,"User 1 has collaborator authority.")
                                            test1();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        };

        var test1 = function() {
            var _this = this;

            var driver2 = new Gitana.Driver();

            // AUTHENTICATE as user1
            driver2.security().authenticate(_this.user1.getPrincipalId(), "password", function() {
                // try to create a repository
                // this should work
                driver2.repositories().create(function(status) {
                    ok(status.isOk(),"Status should be OK.");
                    // try to list repositories
                    // this should work
                    driver2.repositories().list(function(response) {
                        ok(response.rows.length > 0, "length should be greater than zero.");
                        test2();
                    });
                });
            });
        };

        var test2 = function() {
            var _this = this;

            var driver3 = new Gitana.Driver();

            // AUTHENTICATE as user2
            driver3.security().authenticate(_this.user2.getPrincipalId(), "password", function() {
                // try to create a repository
                // this should fail because user2 does not have CREATE_SUBOBJECTS for SERVER
                driver3.repositories().create(function() {
                    ok(false,"SHOULD NOT HIT THIS");
                    start();
                }, function(http) {

                    // try to list repositories
                    // this should fail because user 2 does not have READ for SERVER
                    /*
                     driver3.repositories().list(function() {
                     alert("E) SHOULD NOT HIT THIS");
                     }, function(http) {
                     success();
                     });
                     */

                    // NOTE: at present, it appears that even though user 2 doesn't have READ permissions against
                    // the server, he can still pull back an empty list of repositories.
                    // is this correct??

                    // try to list repositories
                    // get back size 0
                    driver3.repositories().list(function(response) {
                        ok(response.rows.length == 0, "length should be zero.");
                        success();

                    }, function(http) {
                        ok(false,"Got http error on final");
                        start();
                    });

                });
            });
        };

        var success = function() {
            start();
        };

        setupTest1();
    });

}(jQuery) );
