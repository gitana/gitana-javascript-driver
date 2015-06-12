(function($) {

    module("domainPrincipalTeamMemberships1");

    // Test case : Tests out team memberships
    _asyncTest("Domain Principal Team Memberships", function()
    {
        expect(2);

        var user = null;
        var userName = "user_" + new Date().getTime();

        // start
        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            // create a domain and a user
            this.createDomain().then(function() {

                // NOTE: this = domain
                var domain = this;

                // create a user and then change their password right away
                this.createPrincipal({
                    "type": "USER",
                    "name": userName,
                    "password": "abc12345"
                }).then(function() {

                    // NOTE: this = user
                    user = this;
                });

                this.then(function() {

                    // create ten teams
                    var team1 = null;
                    this.createTeam("team1").then(function() {
                        team1 = this;
                    });
                    var team2 = null;
                    this.createTeam("team2").then(function() {
                        team2 = this;
                    });
                    var team3 = null;
                    this.createTeam("team3").then(function() {
                        team3 = this;
                    });
                    var team4 = null;
                    this.createTeam("team4").then(function() {
                        team4 = this;
                    });
                    var team5 = null;
                    this.createTeam("team5").then(function() {
                        team5 = this;
                    });
                    var team6 = null;
                    this.createTeam("team6").then(function() {
                        team6 = this;
                    });
                    var team7 = null;
                    this.createTeam("team7").then(function() {
                        team7 = this;
                    });
                    var team8 = null;
                    this.createTeam("team8").then(function() {
                        team8 = this;
                    });
                    var team9 = null;
                    this.createTeam("team9").then(function() {
                        team9 = this;
                    });
                    var team10 = null;
                    this.createTeam("team10").then(function() {
                        team10 = this;
                    });

                    // retrieve the teams that the user belongs to
                    var originalCount = 0;
                    this.then(function() {
                        this.subchain(user).listTeamMemberships(domain).count(function(count) {
                            originalCount = count;
                        });

                        // add to six teams
                        this.then(function() {
                            this.readTeam("team1").addMember(user);
                            this.readTeam("team2").addMember(user);
                            this.readTeam("team3").addMember(user);
                            this.readTeam("team4").addMember(user);
                            this.readTeam("team5").addMember(user);
                            this.readTeam("team6").addMember(user);
                        });

                        // retrieve the teams that the user belongs to
                        this.then(function() {
                            this.subchain(user).listTeamMemberships(domain).count(function(count) {
                                ok(count == originalCount + 6, "User belongs to six more teams");
                            });
                        });

                        // remove from team 6
                        this.then(function() {
                            this.readTeam("team6").removeMember(user);
                        });

                        // retrieve the teams that the user belongs to
                        // should be -1
                        this.then(function() {
                            this.subchain(user).listTeamMemberships(domain).count(function(count) {
                                ok(count == originalCount + 5, "User belongs to five more teams");

                                success();
                            });
                        });
                    });
                });
            });
        });

        var success = function()
        {
            start();
        };
    });

}(jQuery) );
