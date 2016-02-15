(function($) {

    module("multipleAuthorities2");

    // Test case : Multiple Authorities 2
    _asyncTest("Multiple Authorities 2", function()
    {
        expect(5);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform
            var platform = this;

            // create a user
            this.readPrimaryDomain().then(function() {

                // create user
                var user = null;
                this.createUser({
                    "name": "test-" + new Date().getTime()
                }).then(function () {
                    user = this;
                });

                this.subchain(platform).then(function() {

                    // create a repository
                    this.createRepository().then(function() {

                        // NOTE: this = repository

                        // create a custom ROLE: "AHA"
                        this.createRole("AHA");

                        // read master branch
                        this.readBranch("master").then(function() {

                            // NOTE: this = branch

                            // create 5 nodes
                            var nodes = [];
                            this.createNode().then(function() {
                                nodes.push(this);
                            });
                            this.createNode().then(function() {
                                nodes.push(this);
                            });
                            this.createNode().then(function() {
                                nodes.push(this);
                            });
                            this.createNode().then(function() {
                                nodes.push(this);
                            });
                            this.createNode().then(function() {
                                nodes.push(this);
                            });

                            // grant user the COLLABORATOR role to first three stacks for the user
                            // use our custom role
                            this.then(function() {
                                this.subchain(nodes[0]).grantAuthority(user, "AHA");
                                this.subchain(nodes[1]).grantAuthority(user, "AHA");
                                this.subchain(nodes[2]).grantAuthority(user, "AHA");
                            });

                            // now bulk check authorities
                            this.then(function() {

                                this.checkNodeAuthorities([{
                                    "permissionedId": nodes[0].getId(),
                                    "principalId": user.getDomainQualifiedId(),
                                    "authorityId": "AHA"
                                }, {
                                    "permissionedId": nodes[1].getId(),
                                    "principalId": user.getDomainQualifiedId(),
                                    "authorityId": "AHA"
                                }, {
                                    "permissionedId": nodes[2].getId(),
                                    "principalId": user.getDomainQualifiedId(),
                                    "authorityId": "AHA"
                                }, {
                                    "permissionedId": nodes[3].getId(),
                                    "principalId": user.getDomainQualifiedId(),
                                    "authorityId": "AHA"
                                }, {
                                    "permissionedId": nodes[4].getId(),
                                    "principalId": user.getDomainQualifiedId(),
                                    "authorityId": "AHA"
                                }], function (results) {

                                    // copy into map keyed by permissioned ID
                                    var map = {};
                                    for (var i = 0; i < results.length; i++)
                                    {
                                        map[results[i].permissionedId] = results[i].result;
                                    }

                                    ok(map[nodes[0].getId()], "Node 1 has authority");
                                    ok(map[nodes[1].getId()], "Node 2 has authority");
                                    ok(map[nodes[2].getId()], "Node 3 has authority");
                                    ok(!map[nodes[3].getId()], "Node 4 has no authority");
                                    ok(!map[nodes[4].getId()], "Node 5 has no authority");

                                    success();
                                });
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
