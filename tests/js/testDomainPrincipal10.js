(function($) {

    module("domainPrincipal10");

    // Test case : Tests out user creation with automatic group assignment
    _asyncTest("Domain Principal 10", function()
    {


        expect(3);

        var group1 = null;
        var group1Name = "group1_" + new Date().getTime();
        var group2 = null;
        var group2Name = "group2_" + new Date().getTime();
        var group3 = null;
        var group3Name = "group3_" + new Date().getTime();
        var user1 = null;
        var user1Name = "user1_" + new Date().getTime();

        // start
        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            // create a domain
            this.createDomain().then(function() {

                // NOTE: this = domain

                // create group 1
                this.createPrincipal({
                    "type": "GROUP",
                    "name": group1Name
                }).then(function() {
                    group1 = this;
                });

                // create group 2
                this.createPrincipal({
                    "type": "GROUP",
                    "name": group2Name
                }).then(function() {
                    group2 = this;
                });

                // create group 3
                this.createPrincipal({
                    "type": "GROUP",
                    "name": group3Name
                }).then(function() {
                    group3 = this;
                });

                this.then(function() {

                    // create user1 and auto-assign to groups
                    this.createPrincipal({
                        "type": "USER",
                        "name": user1Name,
                        "groups": [
                            group1Name,
                            group2.getId(),
                            group3.getDomainQualifiedId()
                        ]
                    }).then(function() {
                        user1 = this;
                    });

                    // validate the memberships
                    this.then(function() {

                        this.listMembers(group1).count(function(count) {
                            ok(count == 1, "Found 1 member for group 1");
                        });
                        this.listMembers(group2).count(function(count) {
                            ok(count == 1, "Found 1 member for group 2");
                        });
                        this.listMembers(group3).count(function(count) {
                            ok(count == 1, "Found 1 member for group 3");
                        });

                        this.then(function() {
                            success();
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
