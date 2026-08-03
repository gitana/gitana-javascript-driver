import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication1", function() {

    it("Authentication 1", { "timeout": 120000 }, function(t) {

        t.plan(1);

        return guard(t, function(start) {
            Gitana.reset();
            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET
            });

            gitana.authenticate({
                "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
                "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
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
