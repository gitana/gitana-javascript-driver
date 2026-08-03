import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication2", function() {

    it("Authentication 2", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET
            });

            gitana.authenticate({
                "username": "admin",
                "password": "admin"
            }, function(err) {
                console.warn(err);
                start();
                return;
            }).then(function() {

                // NOTE: this = platform

                t.assert.ok(true, "Successfully authenticated");
                start();
            });
        });
    });
});
