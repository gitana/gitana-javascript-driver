import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication3", function() {

    it("Authentication 3", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY
            });

            gitana.authenticate({ "username": "admin", "password": "admin" }, function(err) {
                console.warn(err);
                start();
                return;
            }).then(function() {

                // NOTE: this = platform

                this.listRepositories({
                    "limit": -1
                }).then(function() {

                    t.assert.ok(true, "First authentication worked");
                    start();
                });
            });
        });
    });
});
