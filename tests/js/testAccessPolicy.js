(function ($) {

    module("accessPolicy");

    // Test case : Access Policy

    _asyncTest("Access Policy", function () 
    {
        expect(7);

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function () {

            // NOTE: this = platform

            // create a user
            var user = null;
            var username = "user-" + new Date().getTime();
            this.readPrimaryDomain().createUser({
                "name": username,
                "password": "pw123456"
            }).then(function () {
                user = this;
            });

            this.readRegistrar("default").then(function () {

                // NOTE: this = registrar

                // create a tenant for our user
                var clientConfig = null;
                this.createTenant(user, "unlimited").then(function () {

                    // NOTE: this = tenant

                    // read the default client
                    this.readDefaultAllocatedClientObject(function (theClientConfig) {
                        clientConfig = theClientConfig;
                    });

                });

                this.then(function () {

                    // sign in as the new tenant
                    new Gitana({
                        "clientKey": clientConfig.getKey(),
                        "clientSecret": clientConfig.getSecret()
                    }).authenticate({
                        "username": user.getName(),
                        "password": "pw123456"
                    }).then(function () {

                        // NOTE: this = platform

                        // create access policies
                        var accessPolicy1 = null;
                        var accessPolicy2 = null;
                        var accessPolicy3 = null;
                        this.createAccessPolicy({
                            "title": "Policy #1",
                            "statements": [{
                                "roles": ["consumer"],
                                "action": "grant",
                                "conditions": [{
                                    "type": "reference-matches",
                                    "config": {
                                        "reference": "^client://.*"
                                    }
                                }]
                            }]
                        }).then(function () {
                            accessPolicy1 = this;
                        });
                        this.createAccessPolicy({
                            "title": "Policy #2",
                            "statements": [{
                                "roles": ["consumer"],
                                "action": "grant",
                                "conditions": [{
                                    "type": "property-matches",
                                    "config": {
                                        "property": "phone",
                                        "value": "^414.*"
                                    }
                                }]
                            }, {
                                "roles": ["consumer"],
                                "action": "grant",
                                "conditions": [{
                                    "type": "property-matches",
                                    "config": {
                                        "property": "phone",
                                        "value": "^617.*"
                                    }
                                }]
                            }, {
                                "roles": ["consumer"],
                                "action": "revoke",
                                "conditions": [{
                                    "type": "property-matches",
                                    "config": {
                                        "property": "disabled",
                                        "value": true
                                    }
                                }]
                            }]
                        }).then(function () {
                            accessPolicy2 = this;
                        });
                        this.createAccessPolicy({
                            "title": "Policy #3",
                            "statements": [{
                                "roles": ["consumer"],
                                "action": "grant",
                                "conditions": [{
                                    "type": "node-has-feature",
                                    "config": {
                                        "qname": "f:thumbnailable"
                                    }
                                }]
                            }]
                        }).then(function () {
                            accessPolicy3 = this;
                        });

                        this.then(function () {
                            // list (should find 3)
                            this.listAccessPolicies().count(function (count) {
                                equal(count, 3, "Found 3 access policies");
                            });

                            // query
                            this.queryAccessPolicies({
                                "title": "Policy #3"
                            }).count(function(count) {
                                equal(count, 1, "Found 1 access policy");
                            });

                            // read and del
                            this.readAccessPolicy(accessPolicy3.getId()).del();

                            // list (should find 2)
                            this.listAccessPolicies().count(function (count) {
                                equal(count, 2, "Found 2 access policies");
                            });

                            // query
                            this.queryAccessPolicies({
                                "title": "Policy #3"
                            }).count(function(count) {
                                equal(count, 0, "Found no dummies (good)");
                            });

                            var userRef = user.ref().toLowerCase();

                            // assign
                            this.assignAccessPolicy(accessPolicy1.getId(), userRef);
                            this.assignAccessPolicy(accessPolicy2.getId(), userRef);

                            // find
                            this.findAccessPolicies(
                                userRef
                            ).count(function(count) {
                                equal(count, 2, "Found 2 access policy on this user");
                            });

                            // unassign
                            this.unassignAccessPolicy(accessPolicy2.getId(), userRef);

                            // find
                            this.findAccessPolicies(
                                userRef
                            ).count(function(count) {
                                equal(count, 1, "Found 1 access policy on this user");
                            });

                            // unassign all
                            this.unassignAllAccessPolicies(userRef);

                            // find
                            this.findAccessPolicies(
                                userRef
                            ).count(function(count) {
                                equal(count, 0, "Found 0 access policy on this user");
                            });

                            this.then(function () {
                                success();
                            });

                        });
                        
                    });

                });

            });

        });

        var success = function () {
            start();
        };

    });

}(jQuery));
