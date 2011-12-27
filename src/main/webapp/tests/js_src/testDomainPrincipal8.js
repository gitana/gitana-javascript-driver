(function($) {

    module("domainPrincipal8");

    // Test case : Tests out cross-domain membership
    test("Domain Principal 8", function()
    {
        stop();

        expect(2);

        var userName1 = "user_1_" + new Date().getTime();
        var userName2 = "user_2_" + new Date().getTime();
        var userName3 = "user_3_" + new Date().getTime();
        var groupName = "group_" + new Date().getTime();

        // start
        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // create three domains and a user in each
            var user1 = null;
            this.createDomain().then(function() {
                this.createPrincipal({
                    "type": "USER",
                    "name": userName1,
                    "password": "pw"
                }).then(function() {
                    user1 = this;
                });
            });
            var user2 = null;
            this.createDomain().then(function() {
                this.createPrincipal({
                    "type": "USER",
                    "name": userName2,
                    "password": "pw"
                }).then(function() {
                    user2 = this;
                });
            });
            var user3 = null;
            this.createDomain().then(function() {
                this.createPrincipal({
                    "type": "USER",
                    "name": userName3,
                    "password": "pw"
                }).then(function() {
                    user3 = this;
                });
            });

            // create a group in default domain
            var group = null;
            this.readDefaultDomain().then(function() {
                this.createPrincipal({
                    "type": "GROUP",
                    "name": groupName
                }).then(function() {
                    group = this;
                });
            });

            // now add cross-domain members into the group (on default domain)
            this.then(function() {

                this.readDefaultDomain().then(function() {

                    this.addMember(group, user1);
                    this.addMember(group, user2);
                    this.addMember(group, user3);

                    // check that the group has the correct # of members
                    this.subchain(group).listMembers().count(function(count) {
                        equal(count, 3, "Correct count #1");
                    });

                    this.subchain(group).removeMember(user3);

                    // check that the group has the correct # of members
                    this.subchain(group).listMembers().count(function(count) {
                        equal(count, 2, "Correct count #2");
                    });

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
