(function($) {

    module("security5");

    // Test case : User and Group Query
    test("User/Group Query", function()
    {
        stop();

        expect(4);

        var tag = "sec5_" + new Date().getTime();

        // user ids
        var userId1 = "user1_" + new Date().getTime();
        var userId2 = "user2_" + new Date().getTime();
        var userId3 = "user3_" + new Date().getTime();
        var userId4 = "user4_" + new Date().getTime();

        // group ids
        var groupId1 = "group1_" + new Date().getTime();
        var groupId2 = "group2_" + new Date().getTime();
        var groupId3 = "group3_" + new Date().getTime();
        var groupId4 = "group4_" + new Date().getTime();

        // start
        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            // create four users
            this.createUser(userId1, {"tag": tag, "season": "summer", "month": "june"});
            this.createUser(userId2, {"tag": tag, "season": "summer", "month": "july"});
            this.createUser(userId3, {"tag": tag, "season": "summer", "month": "august"});
            this.createUser(userId4, {"tag": tag, "season": "autumn", "month": "august"});

            // create four groups
            this.createGroup(groupId1, {"tag": tag, "season": "summer", "month": "june"});
            this.createGroup(groupId2, {"tag": tag, "season": "summer", "month": "july"});
            this.createGroup(groupId3, {"tag": tag, "season": "summer", "month": "august"});
            this.createGroup(groupId4, {"tag": tag, "season": "autumn", "month": "august"});

            this.then(function() {

                // query for users #1
                this.queryUsers({"tag": tag, "season": "summer"}).count(function(count) {
                    equal(3, count, "Counted 3 user summers");
                });

                // query for users #2
                this.queryUsers({"tag": tag, "season": "autumn"}).count(function(count) {
                    equal(1, count, "Counted 1 user autumns");
                });

                // query for groups #1
                this.queryGroups({"tag": tag, "season": "summer"}).count(function(count) {
                    equal(3, count, "Counted 3 group summers");
                });

                // query for groups #2
                this.queryGroups({"tag": tag, "season": "autumn"}).count(function(count) {
                    equal(1, count, "Counted 1 group autumns");
                });
            });

            this.then(function() {
                success();
            });

            var success = function()
            {
                start();
            };
        });
    });

}(jQuery) );
