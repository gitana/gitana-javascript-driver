import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("domainPrincipal8", function() {

    it("Domain Principal 8", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
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
                        "password": "pw123456"
                    }).then(function() {
                        user1 = this;
                    });
                });
                var user2 = null;
                this.createDomain().then(function() {
                    this.createPrincipal({
                        "type": "USER",
                        "name": userName2,
                        "password": "pw123456"
                    }).then(function() {
                        user2 = this;
                    });
                });
                var user3 = null;
                this.createDomain().then(function() {
                    this.createPrincipal({
                        "type": "USER",
                        "name": userName3,
                        "password": "pw123456"
                    }).then(function() {
                        user3 = this;
                    });
                });

                // create a group in yet another domain
                var group = null;
                this.createDomain().then(function() {
                    this.createPrincipal({
                        "type": "GROUP",
                        "name": groupName
                    }).then(function() {
                        group = this;
                    });
                });

                // now add cross-domain members into the group (on default domain)
                this.then(function() {

                    this.readDomain(group.getDomainId()).then(function() {

                        this.addMember(group, user1);
                        this.addMember(group, user2);
                        this.addMember(group.getId(), user3.getDomainQualifiedId());

                        // check that the group has the correct # of members
                        this.subchain(group).listMembers().count(function(count) {
                            t.assert.equal(count, 3, "Correct count #1");
                        });

                        this.subchain(group).removeMember(user3);

                        // check that the group has the correct # of members
                        this.subchain(group).listMembers().count(function(count) {
                            t.assert.equal(count, 2, "Correct count #2");
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
    });
});
