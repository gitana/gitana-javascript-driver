(function($) {

    module("security3");

    // Test case : User/Group Association.
    test("User/Group Association", function()
    {
        stop();

        expect(7);

        var test = this;

        // user ids
        var userId1 = "user1_" + new Date().getTime();
        var userId2 = "user2_" + new Date().getTime();
        var userId3 = "user3_" + new Date().getTime();
        var userId4 = "user4_" + new Date().getTime();
        var userId5 = "user5_" + new Date().getTime();
        var userId6 = "user6_" + new Date().getTime();

        // group ids
        var groupId1 = "group1_" + new Date().getTime();
        var groupId2 = "group2_" + new Date().getTime();
        var groupId3 = "group3_" + new Date().getTime();

        // start
        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            // count the number of users
            var userCount = 0;
            this.listUsers().count(function(count) {
                userCount = count;
            });

            // counter the number of groups
            var groupCount = 0;
            this.listUsers().count(function(count) {
                groupCount = count;
            });

            // create six users
            this.createUser(userId1);
            this.createUser(userId2);
            this.createUser(userId3);
            this.createUser(userId4);
            this.createUser(userId5);
            this.createUser(userId6);

            // create three groups
            this.createGroup(groupId1).then(function() { test.group1 = this });
            this.createGroup(groupId2).then(function() { test.group2 = this });
            this.createGroup(groupId3).then(function() { test.group3 = this });

            // read everyone back
            // NOTE: we do this for test purposes
            // the createUser functions above actually chain the user objects
            // as shown with createGroup above
            this.readUser(userId1).then(function() { test.user1 = this; });
            this.readUser(userId2).then(function() { test.user2 = this; });
            this.readUser(userId3).then(function() { test.user3 = this; });
            this.readUser(userId4).then(function() { test.user4 = this; });
            this.readUser(userId5).then(function() { test.user5 = this; });
            this.readUser(userId6).then(function() { test.user6 = this; });

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
                this.listUsers(test.group1).count(function(count) {
                    equal(count, 2, "Group 1 has two users");
                });
                this.listUsers(test.group2).count(function(count) {
                    equal(count, 1, "Group 2 has one child group");
                });
                this.listUsers(test.group2).count(function(count) {
                    equal(count, 1, "Group 2 has one user");
                });
                this.listUsers(test.group3).count(function(count) {
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

                this.then(function() {
                    success();
                });
            });

            var success = function()
            {
                start();
            };
        });
    });

}(jQuery) );
