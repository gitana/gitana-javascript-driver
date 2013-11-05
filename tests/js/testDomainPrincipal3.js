(function($) {

    module("domainPrincipal3");

    // Test case : Domain Principal 3
    _asyncTest("Domain Principal 3", function()
    {


        expect(10);

        var test = this;

        // user ids
        var userName1 = "user1_" + new Date().getTime();
        var userName2 = "user2_" + new Date().getTime();
        var userName3 = "user3_" + new Date().getTime();
        var userName4 = "user4_" + new Date().getTime();
        var userName5 = "user5_" + new Date().getTime();
        var userName6 = "user6_" + new Date().getTime();

        // group ids
        var groupName1 = "group1_" + new Date().getTime();
        var groupName2 = "group2_" + new Date().getTime();
        var groupName3 = "group3_" + new Date().getTime();

        // start
        var platform = GitanaTest.authenticateFullOAuth();
        platform.readPrimaryDomain().then(function() {

            // NOTE: this = domain

            // count the number of users
            var userCount = 0;
            this.listUsers({
                "limit": -1
            }).count(function(count) {
                userCount = count;
            });

            // counter the number of groups
            var groupCount = 0;
            this.listUsers({
                "limit": -1
            }).count(function(count) {
                groupCount = count;
            });

            // create six users
            this.createUser({
                "name": userName1
            });
            this.createUser({
                "name": userName2
            });
            this.createUser({
                "name": userName3
            });
            this.createUser({
                "name": userName4
            });
            this.createUser({
                "name": userName5
            });
            this.createUser({
                "name": userName6
            });

            // create three groups
            this.createGroup({
                "name": groupName1
            }).then(function() { test.group1 = this });
            this.createGroup({
                "name": groupName2
            }).then(function() { test.group2 = this });
            this.createGroup({
                "name": groupName3
            }).then(function() { test.group3 = this });

            // read everyone back (by name)
            // NOTE: we do this for test purposes
            // the createUser functions above actually chain the user objects
            // as shown with createGroup above
            this.readPrincipal(userName1).then(function() { test.user1 = this; });
            this.readPrincipal(userName2).then(function() { test.user2 = this; });
            this.readPrincipal(userName3).then(function() { test.user3 = this; });
            this.readPrincipal(userName4).then(function() { test.user4 = this; });
            this.readPrincipal(userName5).then(function() { test.user5 = this; });
            this.readPrincipal(userName6).then(function() { test.user6 = this; });

            //
            // NOTE: we let all of the functions above run
            // they're responsible for populating various user and group instances on the test
            // we want to wait for all of them to finish so that we can continue doing things
            // the functions below depend on these finishing, so we put them into a subchain for isolation
            //
            this.then(function() {

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
                this.addMember(test.group1, test.user1);
                this.addMember(test.group1, test.user2);
                this.addMember(test.group2, test.group3);
                this.addMember(test.group2, test.user3);
                this.addMember(test.group3, test.user4);
                this.addMember(test.group3, test.user5);
                this.addMember(test.group3, test.user6);

                // verify memberships
                this.listMembers(test.group1, "user", {
                    "limit": -1
                }).count(function(count) {
                    equal(count, 2, "Group 1 has two users");
                });
                this.listMembers(test.group2, "group", {
                    "limit": -1
                }).count(function(count) {
                    equal(count, 1, "Group 2 has one child group");
                });
                this.listMembers(test.group2, "user", {
                    "limit": -1
                }).count(function(count) {
                    equal(count, 1, "Group 2 has one user");
                });
                this.listMembers(test.group3, "user", {
                    "limit": -1
                }).count(function(count) {
                    equal(count, 3, "Group 3 has three users");
                });

                // remove a member from group 3 and validate
                // note: we'll do this on a subchain to have some fun
                this.subchain(test.group3).removeMember(test.user6).listUsers().count(function(count) {
                    equal(count, 2, "After removing one user, Group 3 now has two users");
                });

                // check memberships
                this.subchain(test.user5).listMemberships().count(function(count) {
                    equal(count, 1, "User 5 has direct membership to one group");
                });
                this.subchain(test.user5).listMemberships(true).count(function(count) {
                    equal(count, 2, "User 5 has indirect membership to two groups");
                });


                //
                // add a group (group 10) and a group user (user 10) to group 3
                // then check the memberships for user10 using pagination
                //
                this.then(function() {

                    var userName10 = "user10_" + new Date().getTime();
                    var user10 = null;
                    this.createUser({
                        "name": userName10
                    }).then(function() {
                        user10 = this;
                    });

                    var groupName10 = "group10_" + new Date().getTime();
                    var group10 = null;
                    this.createGroup({
                        "name": groupName10
                    }).then(function() {
                        group10 = this;
                    });

                    this.then(function() {

                        this.addMember(test.group3, group10);
                        this.addMember(group10, user10);

                        /**
                         * The lineage is now:
                         *
                         *    group2
                         *       -> group3
                         *             -> group10
                         *                   -> user10
                         */

                        this.subchain(user10).listMemberships(true, {
                            "skip": 0,
                            "limit": 1
                        }).count(function(count) {
                            equal(count, 1, "User 10 passes paginated check 1");
                        });
                        this.subchain(user10).listMemberships(true, {
                            "skip": 0,
                            "limit": 4
                        }).count(function(count) {
                            equal(count, 3, "User 10 passes paginated check 2");
                        });

                        this.subchain(user10).listMemberships(true, {
                            "skip": 2,
                            "limit": 2
                        }).count(function(count) {
                            equal(count, 1, "User 10 passes paginated check 3");
                        });

                        this.then(function() {
                            success();
                        });

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
