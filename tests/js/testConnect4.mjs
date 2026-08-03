import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("connect4", function() {

    it("Gitana Connect #4", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET
            }, function() {

                // NOTE: this = platform
                t.assert.ok(this, "Connected successfully");

                start();
            });
        });
    });
});
