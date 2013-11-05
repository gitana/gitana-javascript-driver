(function($) {

    module("repositoryTeam1");

    // Test case : Repository Team
    _asyncTest("Repository Team 1", function()
    {


        expect(7);

        var test = this;

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function() {

            // NOTE: this = platform

            var user1 = null;
            var user2 = null;
            var user3 = null;

            // create three users in default domain
            this.readPrimaryDomain().then(function() {

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

            // create an repository
            this.createRepository().then(function() {

                // NOTE: this = repository

                // owners team members
                this.readOwnersTeam().then(function() {

                    // NOTE: this = team

                    this.listMembers().count(function(count) {
                        equal(count, 1, "Single default member to organization"); // admin
                    });

                    // add user1 as a member of "owners"
                    // add user2 as a member of "owners"
                    this.addMember(user1);
                    this.addMember(user2);
                    this.listMembers().count(function(count) {
                        equal(count, 3, "Three members in organization"); // admin, user1, user2
                    });

                    // remove user2 as a member of "owners"
                    this.removeMember(user2);
                    this.listMembers().count(function(count) {
                        equal(count, 2, "Two members in organization"); // admin, user1
                    });
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
