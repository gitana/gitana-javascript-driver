(function($) {

    module("domainPrincipal5");

    // Test case : Domain Principal 5
    test("Domain Principal 5", function()
    {
        stop();

        expect(4);

        var tag = "sec5_" + new Date().getTime();

        // user ids
        var userName1 = "user1_" + new Date().getTime();
        var userName2 = "user2_" + new Date().getTime();
        var userName3 = "user3_" + new Date().getTime();
        var userName4 = "user4_" + new Date().getTime();

        // group ids
        var groupName1 = "group1_" + new Date().getTime();
        var groupName2 = "group2_" + new Date().getTime();
        var groupName3 = "group3_" + new Date().getTime();
        var groupName4 = "group4_" + new Date().getTime();

        // start
        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.readDomain("default").then(function() {

            // NOTE: this = domain

            // create four users
            this.createUser({
                "name": userName1,
                "tag": tag,
                "season": "summer",
                "month": "june"
            });
            this.createUser({
                "name": userName2,
                "tag": tag,
                "season": "summer",
                "month": "july"
            });
            this.createUser({
                "name": userName3,
                "tag": tag,
                "season": "summer",
                "month": "august"
            });
            this.createUser({
                "name": userName4,
                "tag": tag,
                "season": "autumn",
                "month": "august"
            });

            // create four groups
            this.createGroup({
                "name": groupName1,
                "tag": tag,
                "season": "summer",
                "month": "june"
            });
            this.createGroup({
                "name": groupName2,
                "tag": tag,
                "season": "summer",
                "month": "july"
            });
            this.createGroup({
                "name": groupName3,
                "tag": tag,
                "season": "summer",
                "month": "august"
            });
            this.createGroup({
                "name": groupName4,
                "tag": tag,
                "season": "autumn",
                "month": "august"
            });

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
