(function($) {

    module("security2");

    // Test case : User/Group Association.
    test("User/Group Association", function() {
        stop();

        expect(7);

        var driver = new Gitana.Driver();

        var userCount = 0;
        var groupCount = 0;

        // retrieve number of users and groups
        var setup0 = function() {
            var _this = this;

            driver.users().list(function(result1) {
                _this.userCount = result1.rows.length;

                driver.groups().list(function(result2) {
                    _this.groupCount = result2.rows.length;

                    setup1();
                });
            });
        };

        var setup1 = function() {
            var _this = this;

            // create six users

            // 1
            _this.userId1 = "user" + new Date().getTime();
            driver.users().create(_this.userId1, function(status) {
                // 2
                _this.userId2 = "user" + new Date().getTime();
                driver.users().create(_this.userId2, function(status) {
                    // 3
                    _this.userId3 = "user" + new Date().getTime();
                    driver.users().create(_this.userId3, function(status) {
                        // 4
                        _this.userId4 = "user" + new Date().getTime();
                        driver.users().create(_this.userId4, function(status) {
                            // 5
                            _this.userId5 = "user" + new Date().getTime();
                            driver.users().create(_this.userId5, function(status) {
                                // 6
                                _this.userId6 = "user" + new Date().getTime();
                                driver.users().create(_this.userId6, function(status) {
                                    setup2();
                                });
                            });
                        });
                    });
                });
            });
        };

        var setup2 = function() {
            var _this = this;

            // create three groups

            // 1
            _this.groupId1 = "group" + new Date().getTime();
            driver.groups().create(_this.groupId1, function(status) {
                // 2
                _this.groupId2 = "group" + new Date().getTime();
                driver.groups().create(_this.groupId2, function(status) {
                    // 3
                    _this.groupId3 = "group" + new Date().getTime();
                    driver.groups().create(_this.groupId3, function(status) {
                        setup3();
                    });
                });
            });
        };

        var setup3 = function() {
            var _this = this;

            // read everything back
            driver.users().read(_this.userId1, function(u) {
                _this.user1 = u;

                driver.users().read(_this.userId2, function(u) {
                    _this.user2 = u;

                    driver.users().read(_this.userId3, function(u) {
                        _this.user3 = u;

                        driver.users().read(_this.userId4, function(u) {
                            _this.user4 = u;

                            driver.users().read(_this.userId5, function(u) {
                                _this.user5 = u;

                                driver.users().read(_this.userId6, function(u) {
                                    _this.user6 = u;

                                    driver.groups().read(_this.groupId1, function(g) {
                                        _this.group1 = g;

                                        driver.groups().read(_this.groupId2, function(g) {
                                            _this.group2 = g;

                                            driver.groups().read(_this.groupId3, function(g) {
                                                _this.group3 = g;

                                                test1();

                                            });
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

            // build out the following principal tree

            /**
             *    group1
             *       -> user1
             *       -> user2
             *    group2
             *       -> group3
             *             -> user 4
             *             -> user 5
             *             -> user 6
             *       -> user3
             */

            _this.group1.addMember(_this.user1, function(status) {

                _this.group1.addMember(_this.user2, function(status) {

                    _this.group2.addMember(_this.group3, function(status) {

                        _this.group2.addMember(_this.user3, function(status) {

                            _this.group3.addMember(_this.user4, function(status) {

                                _this.group3.addMember(_this.user5, function(status) {

                                    _this.group3.addMember(_this.user6, function(status) {

                                        test2();

                                    });
                                });
                            });
                        });
                    });
                });
            });
        };

        var test2 = function() {
            var _this = this;

            // verify memberships
            _this.group1.listUsers(function(response1) {

                equal(response1.rows.length, 2, "Group 1 has two users.");

                _this.group2.listGroups(function(response2) {

                    equal(response2.rows.length, 1, "Group 2 has one child group.");

                    _this.group2.listUsers(function(response3) {

                        equal(response3.rows.length, 1, "Group 2 has one user.");

                        _this.group3.listUsers(function(response4) {

                            equal(response4.rows.length, 3, "Group 3 has three users.");

                            test3();
                        });
                    });
                });
            });
        };

        var test3 = function() {
            var _this = this;

            // remove a member from group 3 and validate
            _this.group3.removeMember(_this.user6, function(status) {

                _this.group3.listUsers(function(response5) {

                    equal(response5.rows.length, 2, "After removing one user, Group 3 now has two users.");

                    test4();
                });
            });
        };

        var test4 = function() {
            var _this = this;

            // check direct memberships for user5
            _this.user5.getMemberships(function(response6) {
                // NOTE: belongs directly to group 3
                equal(response6.rows.length, 1, "User 5 has direct membership of one group.");

                // check indirect memberships for user5
                _this.user5.getMemberships(true, function(response7) {
                    // NOTE: belongs indirectly to group 3 and group 1
                    equal(response7.rows.length, 2, "User 5 has indirect membership of two groups.");

                    success();
                });
            });
        };

        var success = function() {
            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            setup0();
        });

    });

}(jQuery) );
