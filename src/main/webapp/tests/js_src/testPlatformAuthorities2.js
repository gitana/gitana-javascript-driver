(function($) {

    module("platformAuthorities2");

    // Test case : Platform authorities (direct)
    test("Platform authorities 2 (direct)", function() {
        stop();

        expect(7);

        var userName1 = "testUser" + new Date().getTime() + "_1";
        var userName2 = "testUser" + new Date().getTime() + "_2";

        var user1 = null;
        var user2 = null;

        // set up the test as the admin user
        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // grant the "CONNECTOR" authority to the "everyone" group
            // normally this is granted but we want to make sure in case the test failed on a previous run
            this.grantAuthority(Gitana.EVERYONE, "connector");

            // create two users in the default domain
            this.readDomain("default").then(function() {

                // create user 1
                this.createUser({
                    "name": userName1,
                    "password": "password"
                }).then(function() {
                    user1 = this;
                });

                // create user 2
                this.createUser({
                    "name": userName2,
                    "password": "password"
                }).then(function() {
                    user2 = this;
                });

            });

            // after we've resolved references to user1 and user2
            this.then(function() {

                // check who has direct authorities against the platform
                // verify that "default/everyone" has "connector" (which we just assigned above)
                var initial = -1;
                this.loadACL(function(acl) {

                    ok(acl.rows.length >= 1, "More than one initial direct ACL");

                    initial = acl.rows.length;

                    // verify
                    var found = false;
                    for (var i = 0; i < acl.rows.length; i++)
                    {
                        var row = acl.rows[i];

                        var domainId = row["domainId"];
                        var principalId = row["_doc"];
                        var principalName = row["name"];
                        var principalType = row["type"];
                        var authorities = row["authorities"]; // list

                        if (domainId == "default" && principalName == "everyone" && principalType == "GROUP" && principalId)
                        {
                            if (authorities[0] == "connector")
                            {
                                found = true;
                                break;
                            }
                        }
                    }

                    ok(found, "Found the default/everyone ACL entry");
                });

                // grant user1 collaborator rights to server
                this.grantAuthority(user1, "collaborator").checkAuthority(user1, "collaborator", function(hasAuthority) {
                    ok(hasAuthority, "User 1 has collaborator authority!");
                });

                // check acl
                this.loadACL(function(acl) {
                    equal(acl.rows.length, initial + 1, "Found +1 direct authorities");
                });

                // grant user2 consumer rights to server
                this.grantAuthority(user2, "consumer").checkAuthority(user2, "consumer", function(hasAuthority) {
                    ok(hasAuthority, "User 2 has consumer authority!");
                });

                // check acl
                this.loadACL(function(acl) {
                    equal(acl.rows.length, initial + 2, "Found +2 direct authorities");
                });

                // revoke both user's rights
                this.revokeAuthority(user1, "collaborator");
                this.revokeAuthority(user2, "consumer");

                // check acl
                this.loadACL(function(acl) {
                    equal(acl.rows.length, initial, "Found restored direct authority count");
                });

                this.then(function() {
                    success();
                });

            });
        });

        var success = function() {

            start();
        };
    });

}(jQuery) );
