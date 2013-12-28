(function($) {

    module("repositoryPermissions1");

    // Test case : Repository permissions
    _asyncTest("Repository permissions", function()
    {
        expect(36);

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function() {

            // NOTE: this = platform

            var userId1 = null;
            var userId2 = null;
            var userId3 = null;

            // create three users in default domain
            this.readPrimaryDomain().then(function() {

                this.createUser({
                    "name": "user1-" + new Date().getTime()
                }).then(function() {
                    userId1 = this.getDomainQualifiedId();
                });

                this.createUser({
                    "name": "user2-" + new Date().getTime()
                }).then(function() {
                    userId2 = this.getDomainQualifiedId();
                });

                this.createUser({
                    "name": "user3-" + new Date().getTime()
                }).then(function() {
                    userId3 = this.getDomainQualifiedId();
                });

            });

            // create three repositories
            // grant authorities
            var repository1 = null;
            this.createRepository().then(function() {
                repository1 = this;

                this.grantAuthority(userId1, "manager");
                this.grantAuthority(userId2, "consumer");
            });
            var repository2 = null;
            this.createRepository().then(function() {
                repository2 = this;

                this.grantAuthority(userId2, "editor");
            });
            var repository3 = null;
            this.createRepository().then(function() {
                repository3 = this;

                this.grantAuthority(userId3, "consumer");
            });

            // simple repository permission checks
            this.then(function() {

                // NOTE: this = platform

                // check repository 1
                this.subchain(repository1).then(function () {

                    // NOTE: this = repository 1

                    this.checkPermission(userId1, "read", function(check) { equal(check, true); });
                    this.checkPermission(userId1, "update", function(check) { equal(check, true); });
                    this.checkPermission(userId1, "delete", function(check) { equal(check, true); });

                    this.checkPermission(userId2, "read", function(check) { equal(check, true); });
                    this.checkPermission(userId2, "update", function(check) { equal(check, false); });
                    this.checkPermission(userId2, "delete", function(check) { equal(check, false); });

                    this.checkPermission(userId3, "read", function(check) { equal(check, false); });
                    this.checkPermission(userId3, "update", function(check) { equal(check, false); });
                    this.checkPermission(userId3, "delete", function(check) { equal(check, false); });

                });
            });

            // bulk repository permission checks
            this.then(function() {

                // NOTE: this = platform

                this.checkRepositoryPermissions([

                        // repository 1
                {
                    "permissionedId": repository1.getId(),
                    "principalId": userId1,
                    "permissionId": "read"
                },{
                    "permissionedId": repository1.getId(),
                    "principalId": userId1,
                    "permissionId": "update"
                },{
                    "permissionedId": repository1.getId(),
                    "principalId": userId1,
                    "permissionId": "delete"
                },{
                    "permissionedId": repository1.getId(),
                    "principalId": userId2,
                    "permissionId": "read"
                },{
                    "permissionedId": repository1.getId(),
                    "principalId": userId2,
                    "permissionId": "update"
                },{
                    "permissionedId": repository1.getId(),
                    "principalId": userId2,
                    "permissionId": "delete"
                },{
                    "permissionedId": repository1.getId(),
                    "principalId": userId3,
                    "permissionId": "read"
                },{
                    "permissionedId": repository1.getId(),
                    "principalId": userId3,
                    "permissionId": "update"
                },{
                    "permissionedId": repository1.getId(),
                    "principalId": userId3,
                    "permissionId": "delete"
                },

                        // repository 2
                {
                    "permissionedId": repository2.getId(),
                    "principalId": userId1,
                    "permissionId": "read"
                },{
                    "permissionedId": repository2.getId(),
                    "principalId": userId1,
                    "permissionId": "update"
                },{
                    "permissionedId": repository2.getId(),
                    "principalId": userId1,
                    "permissionId": "delete"
                },{
                    "permissionedId": repository2.getId(),
                    "principalId": userId2,
                    "permissionId": "read"
                },{
                    "permissionedId": repository2.getId(),
                    "principalId": userId2,
                    "permissionId": "update"
                },{
                    "permissionedId": repository2.getId(),
                    "principalId": userId2,
                    "permissionId": "delete"
                },{
                    "permissionedId": repository2.getId(),
                    "principalId": userId3,
                    "permissionId": "read"
                },{
                    "permissionedId": repository2.getId(),
                    "principalId": userId3,
                    "permissionId": "update"
                },{
                    "permissionedId": repository2.getId(),
                    "principalId": userId3,
                    "permissionId": "delete"
                },

                        // repository 3
                {
                    "permissionedId": repository3.getId(),
                    "principalId": userId1,
                    "permissionId": "read"
                },{
                    "permissionedId": repository3.getId(),
                    "principalId": userId1,
                    "permissionId": "update"
                },{
                    "permissionedId": repository3.getId(),
                    "principalId": userId1,
                    "permissionId": "delete"
                },{
                    "permissionedId": repository3.getId(),
                    "principalId": userId2,
                    "permissionId": "read"
                },{
                    "permissionedId": repository3.getId(),
                    "principalId": userId2,
                    "permissionId": "update"
                },{
                    "permissionedId": repository3.getId(),
                    "principalId": userId2,
                    "permissionId": "delete"
                },{
                    "permissionedId": repository3.getId(),
                    "principalId": userId3,
                    "permissionId": "read"
                },{
                    "permissionedId": repository3.getId(),
                    "principalId": userId3,
                    "permissionId": "update"
                },{
                    "permissionedId": repository3.getId(),
                    "principalId": userId3,
                    "permissionId": "delete"
                }], function(results) {

                    // repo1
                    equal(results[0].result, true);
                    equal(results[1].result, true);
                    equal(results[2].result, true);
                    equal(results[3].result, true);
                    equal(results[4].result, false);
                    equal(results[5].result, false);
                    equal(results[6].result, false);
                    equal(results[7].result, false);
                    equal(results[8].result, false);

                    // repo2
                    equal(results[9].result, false);
                    equal(results[10].result, false);
                    equal(results[11].result, false);
                    equal(results[12].result, true);
                    equal(results[13].result, true);
                    equal(results[14].result, true);
                    equal(results[15].result, false);
                    equal(results[16].result, false);
                    equal(results[17].result, false);

                    // repo3
                    equal(results[18].result, false);
                    equal(results[19].result, false);
                    equal(results[20].result, false);
                    equal(results[21].result, false);
                    equal(results[22].result, false);
                    equal(results[23].result, false);
                    equal(results[24].result, true);
                    equal(results[25].result, false);
                    equal(results[26].result, false);
                });
            });

            this.then(function() {
                success();
            });
        });

        var success = function() {
            start();
        };
    });

}(jQuery) );
