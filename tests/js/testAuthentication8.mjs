import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication8", function() {

    it("Authentication 8", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

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

                t.assert.ok(true, "Successfully authenticated");

                // list domains
                this.listDomains({
                    "limit": -1
                }).then(function() {
                    t.assert.ok(true, "First list worked");
                });

                // now wipe out token and try again to ensure the refresh token gets used
                this.then(function() {

                    this.getDriver().http.accessToken(null);

                    // list domains again
                    // this time the refresh token should be automatically used to re-acquire an access token
                    this.listDomains({
                        "limit": -1
                    }).then(function() {
                        t.assert.ok(true, "Second list worked");
                    });

                    this.then(function() {
                        start();
                    });

                });

            });
        });
    });
});
