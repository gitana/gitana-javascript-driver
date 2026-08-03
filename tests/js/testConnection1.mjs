import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("connection1", function() {

    it("Connection CRUD operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                // create a directory
                var directory = null;
                this.createDirectory().then(function() {
                    directory = this;
                });

                // create a domain
                var domain = null;
                var user = null;
                this.createDomain().then(function() {
                    domain = this;

                    this.createUser({
                        "name": "testuser",
                        "password": "password1234"
                    }).then(function() {
                        user = this;
                    });
                });

                this.then(function() {

                    this.subchain(directory).then(function() {

                        var cat = "cat-" + new Date().getTime();

                        // list connections
                        var initialCount = 0;
                        this.listConnections().count(function(count) {
                            initialCount = count;
                        });

                        // create a connection
                        this.createConnection({
                            "identity-id": user.getIdentityId(),
                            "providerUserId": "uzquiano",
                            "providerId": "twitter",
                            "cat": cat
                        });
                        this.createConnection({
                            "identity-id": user.getIdentityId(),
                            "providerUserId": "michael.uzquiano",
                            "providerId": "facebook",
                            "cat": cat
                        });

                        // list connections
                        this.listConnections().count(function(count) {
                            t.assert.equal(2, count - initialCount, "Found two connections");
                        });

                        this.queryConnections({
                            "providerId": "facebook",
                            "cat": cat
                        }).count(function(count) {
                            t.assert.equal(1, count, "Found one facebook cat match");

                            start();
                        });

                    });

                });

            });
        });
    });
});
