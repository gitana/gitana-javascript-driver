import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("context1", function() {

    it("Gitana Context #1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var key = "abc" + new Date().getTime();
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository({
                "key": key
            }).then(function() {

                // create a context
                Gitana.Context.create({
                    "repository": {
                        "key": key
                    },
                    "branch": "master",
                    "driver": {
                        "clientKey": GitanaTest.TEST_CLIENT_KEY,
                        "clientSecret": GitanaTest.TEST_CLIENT_SECRET
                    },
                    "authentication": {
                        "username": "admin",
                        "password": "admin"
                    }
                }).then(function() {

                    t.assert.ok(this.platform(), "Found platform");
                    t.assert.ok(this.repository(), "Found repository");
                    t.assert.ok(this.branch(), "Found branch");

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
