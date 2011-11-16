(function($) {

    module("repositoryPermissions1");

    // Test case : Repository permissions
    test("Repository permissions", function() {
        stop();

        expect(36);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            // create three users
            var userId1 = null;
            this.createUser("user1-" + new Date().getTime()).then(function() {
                userId1 = this.getPrincipalId();
            });
            var userId2 = null;
            this.createUser("user2-" + new Date().getTime()).then(function() {
                userId2 = this.getPrincipalId();
            });
            var userId3 = null;
            this.createUser("user3-" + new Date().getTime()).then(function() {
                userId3 = this.getPrincipalId();
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

                // NOTE: this = server

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

                // NOTE: this = server

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
                    equals(results[0].result, true);
                    equals(results[1].result, true);
                    equals(results[2].result, true);
                    equals(results[3].result, true);
                    equals(results[4].result, false);
                    equals(results[5].result, false);
                    equals(results[6].result, false);
                    equals(results[7].result, false);
                    equals(results[8].result, false);

                    // repo2
                    equals(results[9].result, false);
                    equals(results[10].result, false);
                    equals(results[11].result, false);
                    equals(results[12].result, true);
                    equals(results[13].result, true);
                    equals(results[14].result, true);
                    equals(results[15].result, false);
                    equals(results[16].result, false);
                    equals(results[17].result, false);

                    // repo3
                    equals(results[18].result, false);
                    equals(results[19].result, false);
                    equals(results[20].result, false);
                    equals(results[21].result, false);
                    equals(results[22].result, false);
                    equals(results[23].result, false);
                    equals(results[24].result, true);
                    equals(results[25].result, false);
                    equals(results[26].result, false);
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
