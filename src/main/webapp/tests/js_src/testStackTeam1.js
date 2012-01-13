(function($) {

    module("stackTeam1");

    // Test case : Stack Team
    test("Stack Team 1", function()
    {
        stop();

        expect(12);

        var test = this;

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function() {

            // NOTE: this = platform

            // create three users
            var user1 = null;
            var user2 = null;
            var user3 = null;
            this.readDefaultDomain().then(function() {

                this.createUser({
                    "name": "user1-" + new Date().getTime()
                }).then(function() {
                    user1 = this;
                });
                this.createUser({
                    "name": "user2-" + new Date().getTime()
                }).then(function() {
                    user2 = this;
                });
                this.createUser({
                    "name": "user3-" + new Date().getTime()
                }).then(function() {
                    user3 = this;
                });
            });

            // create a stack
            this.createStack().then(function() {

                // NOTE: this = stack

                // owners team members
                this.readOwnersTeam().then(function() {

                    // NOTE: this = team

                    this.listMembers().count(function(count) {
                        equal(count, 1, "Single default member to stack"); // admin
                    });

                    // add user1 as a member of "owners"
                    // add user2 as a member of "owners"
                    this.addMember(user1);
                    this.addMember(user2);
                    this.listMembers().count(function(count) {
                        equal(count, 3, "Three members in stack"); // admin, user1, user2
                    });

                    // TODO: START
                    // count the # of organizations user1 belongs to
                    this.subchain(user1).listOrganizations().count(function(count) {
                        equal(count, 1, "User 1 in 1 organization (First)");
                    });
                    // count the # of organizations user2 belongs to
                    this.subchain(user2).listOrganizations().count(function(count) {
                        equal(count, 1, "User 2 in 1 organization (First)");
                    });

                    // remove user2 as a member of "owners"
                    this.removeMember(user2);
                    this.listMembers().count(function(count) {
                        equal(count, 2, "Two members in organization"); // admin, user1
                    });

                    // count the # of organizations user1 belongs to
                    this.subchain(user1).listOrganizations().count(function(count) {
                        equal(count, 1, "User 1 in 1 organization (Second)");
                    });

                    // count the # of organizations user2 belongs to
                    this.subchain(user2).listOrganizations().count(function(count) {
                        equal(count, 0, "User 2 in 0 organization (Second)");
                    });
                    // TODO: END

                });

                // create a new team: "grifters"
                // add user2 as a member of grifters
                // grant grifters the "consumer" authority
                this.createTeam("grifters").addMember(user2).then(function() {

                    // NOTE: this = team

                    // grant an authority
                    this.grant("consumer");

                    // verify
                    this.loadAuthorities(function(authorities) {
                        equal(authorities.length, 1, "Single consumer authority");
                    });

                    // revoke an authority
                    this.revoke("consumer");

                    // verify
                    this.loadAuthorities(function(authorities) {
                        equal(authorities.length, 0, "Single consumer authority");
                    });
                });

                // list teams
                this.listTeams().count(function(count) {
                    equal(count, 2, "Two teams - owners and grifters");
                });

                // delete team
                this.readTeam("grifters").del();
                this.listTeams().count(function(count) {
                    equal(count, 1, "Single team - owners");
                });

                this.createTeam("cougars").then(function() {
                    var groupId = this.getGroupId();
                    ok(groupId != null, "Retrieve new team group id.");
                });
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

}(jQuery) );
