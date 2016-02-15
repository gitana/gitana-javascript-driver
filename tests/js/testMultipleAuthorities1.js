(function($) {

    module("multipleAuthorities1");

    // Test case : Multiple Authorities 1
    _asyncTest("Multiple Authorities 1", function()
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

                    // create 5 stacks
                    var stacks = [];
                    this.createStack().then(function() {
                        stacks.push(this);
                    });
                    this.createStack().then(function() {
                        stacks.push(this);
                    });
                    this.createStack().then(function() {
                        stacks.push(this);
                    });
                    this.createStack().then(function() {
                        stacks.push(this);
                    });
                    this.createStack().then(function() {
                        stacks.push(this);
                    });

                    // grant user the COLLABORATOR role to first three stacks for the user
                    this.then(function() {
                        this.subchain(stacks[0]).grantAuthority(user, "COLLABORATOR");
                        this.subchain(stacks[1]).grantAuthority(user, "COLLABORATOR");
                        this.subchain(stacks[2]).grantAuthority(user, "COLLABORATOR");
                    });

                    // now bulk check authorities
                    this.then(function() {

                        this.checkStackAuthorities([{
                            "permissionedId": stacks[0].getId(),
                            "principalId": user.getDomainQualifiedId(),
                            "authorityId": "COLLABORATOR"
                        }, {
                            "permissionedId": stacks[1].getId(),
                            "principalId": user.getDomainQualifiedId(),
                            "authorityId": "COLLABORATOR"
                        }, {
                            "permissionedId": stacks[2].getId(),
                            "principalId": user.getDomainQualifiedId(),
                            "authorityId": "COLLABORATOR"
                        }, {
                            "permissionedId": stacks[3].getId(),
                            "principalId": user.getDomainQualifiedId(),
                            "authorityId": "COLLABORATOR"
                        }, {
                            "permissionedId": stacks[4].getId(),
                            "principalId": user.getDomainQualifiedId(),
                            "authorityId": "COLLABORATOR"
                        }], function (results) {

                            // copy into map keyed by permissioned ID
                            var map = {};
                            for (var i = 0; i < results.length; i++)
                            {
                                map[results[i].permissionedId] = results[i].result;
                            }

                            ok(map[stacks[0].getId()], "Stack 1 has authority");
                            ok(map[stacks[1].getId()], "Stack 2 has authority");
                            ok(map[stacks[2].getId()], "Stack 3 has authority");
                            ok(!map[stacks[3].getId()], "Stack 4 has no authority");
                            ok(!map[stacks[4].getId()], "Stack 5 has no authority");

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
