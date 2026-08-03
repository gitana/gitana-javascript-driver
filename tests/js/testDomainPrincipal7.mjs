import { describe, it } from "node:test";
import { Gitana, GitanaTest, Chain, guard } from "../support.mjs";

describe("domainPrincipal7", function() {

    it("Domain Principal 7", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(16);

        return guard(t, function(start) {
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
                    t.assert.equal(user.TYPE, "USER", "User 1 has USER type");
                    t.assert.ok(user.getFirstName, "User 1 has getFirstName method");

                    // group ok
                    t.assert.equal(group.TYPE, "GROUP", "Group 1 has GROUP type");
                    t.assert.ok(group.listMembers, "Group 1 has listMembers method");

                    this.then(function() {

                        // read user
                        this.readPrincipal(user.getId()).then(function() {
                            t.assert.equal(this.TYPE, "USER", "User 2 has USER type");
                            t.assert.ok(this.getFirstName, "User 2 has getFirstName method");
                        });

                        // read group
                        this.readPrincipal(group.getId()).then(function() {
                            t.assert.equal(this.TYPE, "GROUP", "Group 2 has GROUP type");
                            t.assert.ok(this.listMembers, "Group 2 has listMembers method");
                        });

                    });

                    // ensure the same things work if we wrap into a Chain() method
                    this.then(function() {

                        // read user
                        this.readPrincipal(user.getId()).then(function() {
                            Chain(this).then(function() {
                                t.assert.equal(this.TYPE, "USER", "User 3 has USER type");
                                t.assert.ok(this.getFirstName, "User 3 has getFirstName method");
                            });
                        });

                        // read group
                        this.readPrincipal(group.getId()).then(function() {
                            Chain(this).then(function() {
                                t.assert.equal(this.TYPE, "GROUP", "Group 3 has GROUP type");
                                t.assert.ok(this.listMembers, "Group 3 has listMembers method");
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
                                t.assert.equal(this.TYPE, "USER", "User 4 has USER type");
                                t.assert.ok(this.getFirstName, "User 4 has getFirstName method");
                            });
                        });

                        // subchain group
                        this.then(function() {
                            this.subchain(y).then(function() {
                                t.assert.equal(this.TYPE, "GROUP", "Group 4 has GROUP type");
                                t.assert.ok(this.listMembers, "Group 4 has listMembers method");
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
    });
});
