(function($) {

    module("security1");

    // Test case : User/group operations.
    test("User/group operations", function() {
        stop();

        expect(6);

        var driver = new Gitana.Driver();

        var userCount = 0;
        var groupCount = 0;

        // retrieve number of users and groups
        var test0 = function() {
            var _this = this;

            driver.users().list(function(result) {
                _this.userCount = result.rows.length;

                driver.groups().list(function(result2) {
                    _this.groupCount = result2.rows.length;

                    test1();
                });
            });
        };

        // tests user create, read, list and delete
        var test1 = function() {
            var _this = this;

            // create a test user
            var userId1 = "user" + new Date().getTime();
            driver.users().create(userId1, function(status) {
                driver.users().read(userId1, function(user1) {

                    equal(user1.getId(), userId1, "New user id matches.");

                    driver.users().list(function(result3) {

                        equal(result3.rows.length, _this.userCount + 1, "Number of users is correct after creating a new user.");

                        driver.users().del(userId1, function(status) {
                            driver.users().list(function(result4) {

                                equal(result4.rows.length, _this.userCount, "Number of users is correct after deleting the newly created user.");

                                test2();

                            });
                        });
                    })
                });
            });
        };

        // tests group create, read, list and delete
        var test2 = function() {
            var _this = this;

            // create a test group
            var groupId1 = "group" + new Date().getTime();
            driver.groups().create(groupId1, function(status) {
                driver.groups().read(groupId1, function(group1) {

                    equal(group1.getId(), groupId1, "New group id matches.");

                    driver.groups().list(function(result5) {

                        equal(result5.rows.length, _this.groupCount + 1, "Number of groups is correct after creating a new user.");

                        driver.groups().del(groupId1, function(status) {
                            driver.groups().list(function(result6) {

                                equal(result6.rows.length, _this.groupCount, "Number of groups is correct after deleting the newly created user.");

                                success();

                            });
                        });
                    })
                });
            });
        };

        var success = function() {
            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            test0();
        });
    });

}(jQuery) );