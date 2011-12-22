(function($) {

    module("domainPrincipal7");

    // Test case : Tests out DomainUser/DomainGroup extends
    test("Domain Principal 7", function()
    {
        stop();

        expect(8);

        var userName = "user_" + new Date().getTime();
        var groupName = "group_" + new Date().getTime();

        // start
        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.readDefaultDomain().then(function() {

            // NOTE: this = domain

            // create a user
            var user = null;
            this.createUser({
                "name": userName,
                "password": "test"
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
