(function($) {

    module("domainPrincipal7");

    // Test case : Tests out DomainUser/DomainGroup extends
    _asyncTest("Domain Principal 7", function()
    {
        expect(16);

        var userName = "user_" + new Date().getTime();
        var groupName = "group_" + new Date().getTime();

        // start
        var platform = GitanaTest.authenticateFullOAuth();
        platform.readPrimaryDomain().then(function() {

            // NOTE: this = domain

            // create a user
            var user = null;
            this.createUser({
                "name": userName,
                "password": "test1234"
            }).then(function() {
                user = this;
            });

            // create a group
            var group = this;
            this.createGroup({
                "name": groupName
            }).then(function() {
                group = this;
            });

            this.then(function() {

                // NOTE: this = domain

                // user ok
                equal(user.TYPE, "USER", "User 1 has USER type");
                ok(user.getFirstName, "User 1 has getFirstName method");

                // group ok
                equal(group.TYPE, "GROUP", "Group 1 has GROUP type");
                ok(group.listMembers, "Group 1 has listMembers method");

                this.then(function() {

                    // read user
                    this.readPrincipal(user.getId()).then(function() {
                        equal(this.TYPE, "USER", "User 2 has USER type");
                        ok(this.getFirstName, "User 2 has getFirstName method");
                    });

                    // read group
                    this.readPrincipal(group.getId()).then(function() {
                        equal(this.TYPE, "GROUP", "Group 2 has GROUP type");
                        ok(this.listMembers, "Group 2 has listMembers method");
                    });

                });

                // ensure the same things work if we wrap into a Chain() method
                this.then(function() {

                    // read user
                    this.readPrincipal(user.getId()).then(function() {
                        Chain(this).then(function() {
                            equal(this.TYPE, "USER", "User 3 has USER type");
                            ok(this.getFirstName, "User 3 has getFirstName method");
                        });
                    });

                    // read group
                    this.readPrincipal(group.getId()).then(function() {
                        Chain(this).then(function() {
                            equal(this.TYPE, "GROUP", "Group 3 has GROUP type");
                            ok(this.listMembers, "Group 3 has listMembers method");
                        });
                    });

                });

                // ensure the same things work if we use subchain()
                this.then(function() {

                    // read user
                    var x = null;
                    this.readPrincipal(user.getId()).then(function() {
                        x = this;
                    });

                    // read group
                    var y = null;
                    this.readPrincipal(group.getId()).then(function() {
                        y = this;
                    });

                    // subchain user
                    this.then(function() {
                        this.subchain(x).then(function() {
                            equal(this.TYPE, "USER", "User 4 has USER type");
                            ok(this.getFirstName, "User 4 has getFirstName method");
                        });
                    });

                    // subchain group
                    this.then(function() {
                        this.subchain(y).then(function() {
                            equal(this.TYPE, "GROUP", "Group 4 has GROUP type");
                            ok(this.listMembers, "Group 4 has listMembers method");
                        });

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
    });

}(jQuery) );
