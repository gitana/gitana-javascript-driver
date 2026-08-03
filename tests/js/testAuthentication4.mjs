import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication4", function() {

    it("Authentication 4", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY
            });

            gitana.authenticate({
                "username": GitanaTest.TEST_USER_CREDENTIALS_KEY
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
