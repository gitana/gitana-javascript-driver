(function($) {

    module("platformAuthorities1");

    // Test case : Platform authorities
    test("Platform authorities", function() {
        stop();

        expect(7);

        var domainId = null;
        var userName1 = "testUser" + new Date().getTime() + "_1";
        var userName2 = "testUser" + new Date().getTime() + "_2";

        var user1 = null;
        var user2 = null;

        // set up the test as the admin user
        var setupTest = function()
        {
            var platform = GitanaTest.authenticateFullOAuth();
            platform.then(function() {

                // NOTE: this = platform

                // grant the "CONNECTOR" authority to the "everyone" group
                // normally this is granted but we want to make sure in case the test failed on a previous run
                this.grantAuthority(Gitana.EVERYONE, "connector");

                // create two users in the default domain
                this.readPrimaryDomain().then(function() {

                    // NOTE: domain = this
                    domainId = this.getId();

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

                    // NOTE: domain = this

                    // rescind the automatic "CONNECTOR" authority for the "everyone" group against the server
                    this.revokeAllAuthorities(Gitana.EVERYONE);

                    // grant user1 collaborator rights to server
                    this.grantAuthority(user1, "collaborator").checkAuthority(user1, "collaborator", function(hasAuthority) {
                        ok(hasAuthority, "User 1 has collaborator authority!");
                    });

                    // grant user2 consumer rights to server
                    this.grantAuthority(user2, "consumer").checkAuthority(user2, "consumer", function(hasAuthority) {
                        ok(hasAuthority, "User 2 has consumer authority!");

                        test1();
                    });
                });
            });
        };

        // run as user1
        // user1 has "collaborator" rights to the server so they can create repos without a problem
        var test1 = function()
        {
            var platform = GitanaTest.authenticate(userName1, "password", domainId);
            platform.then(function() {

                // NOTE: this = platform

                // create repository
                var repo = null;
                this.createRepository().then(function() {
                    repo = this;
                });

                // pull back list
                this.listRepositories().count(function(count) {
                    ok(count > 0, "Repository list count > 0");
                    ok(this.get(repo.getId()), "Found repository");

                    test2();
                });
            })
        };

        // run as user 2
        // user2 has "consumer" rights to the server so they can connect but can't do anything.
        var test2 = function()
        {
            var platform = GitanaTest.authenticate(userName2, "password", domainId);
            platform.then(function(){

                // NOTE: this = platform

                var trap1 = function(err)
                {
                    // NOTE: this = platform
                    // "this" gets set as the last place an error occurred which was during createRepository
                    // the repository didn't succeed in getting created, so we're stuck at server
                    ok(true, "User could not create repository");

                    test3();
                };

                this.trap(trap1).createRepository().then(function() {
                    ok(false, "User should not be able to create repository!");

                    success();
                });
            });
        };

        // run as admin
        var test3 = function()
        {
            var platform = GitanaTest.authenticate("admin", "admin");
            platform.then(function() {

                // NOTE: this = platform

                // grab the authority list for the server
                this.loadAuthorityGrants([user1.getDomainQualifiedId(), user2.getDomainQualifiedId()], function(principalAuthorityGrants) {

                    // for user 1
                    report(principalAuthorityGrants, user1.getId());
                    ok(true);

                    // for user 2
                    report(principalAuthorityGrants, user2.getId());
                    ok(true);

                    success();
                })
            });
        };

        var report = function(principalAuthorityGrants, principalId)
        {
            var authorityGrants = principalAuthorityGrants[principalId];
            for (var grantId in authorityGrants)
            {
                var grant = authorityGrants[grantId];

                // the "role key" of the authority (i.e. consumer, collaborator)
                var grantRoleKey = grant["role-key"];

                // the id of the principal who was granted the right
                var grantPrincipalId = grant["principal"];

                // the id of the object that was granted against (i.e. server id, repo id)
                var grantPermissionedId = grant["permissioned"];

                // NOTE: if the grant was made directly, then grantPrincipalId == userId1
                // otherwise, grantPrincipalId == the id of the security group that was granted the authority
                // and to which the principal userId1 belongs
                var indirect = (grantPrincipalId != principalId);

                var text = "Principal: " + principalId + " was granted: " + grantId;
                text += "\n\trole: " + grantRoleKey;
                text += "\n\tprincipal: " + grantPrincipalId;
                text += "\n\tpermissioned: " + grantPermissionedId;
                text += "\n\tindirect: " + indirect;

                // NOTE: in the case of nodes, authorities may also be inherited (i.e. propagated) due to
                // authorities being assigned to a node on the other side of an association that propagates
                // authorities (like the a:child association).

                var inheritsFrom = grant["inheritsFrom"];
                text += "\n\tinherited: " + (!Gitana.isEmpty(inheritsFrom));
                if (inheritsFrom)
                {
                    // the id of the grant being masked
                    // this is usually the original association id that our propagated association is masking
                    var inheritedGrantId = inheritsFrom["id"];

                    // the id of the original principal
                    // this should be the same as userId1
                    var inheritedPrincipalId = inheritsFrom["principal"];

                    // the id of the original permissioned
                    // this may be something like the folder that our document sits inside of
                    var inheritedPermissionedId = inheritsFrom["permissioned"];

                    text += "\n\t\tid: " + inheritedGrantId;
                    text += "\n\t\tprincipal: " + inheritedPrincipalId;
                    text += "\n\t\tpermissioned: " + inheritedPermissionedId;
                }

                if (console)
                {
                    console.log(text);
                }
            }
        };

        var success = function() {

            var platform = GitanaTest.authenticate("admin", "admin");
            platform.then(function() {

                // NOTE: this = platform

                // grant the "CONNECTOR" authority to the "everyone" group
                // normally this is granted but we want to make sure in case the test failed on a previous run
                this.grantAuthority(Gitana.EVERYONE, "connector");
            });

            start();
        };

        setupTest();
    });

}(jQuery) );
