import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("timeout1", function() {

    it("Timeout 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                Gitana.HTTP_TIMEOUT = 10; // 10 milliseconds
                Gitana.HTTP_TIMEOUT_FN = function(xhr, method, url) {
                    t.assert.ok(true, "Timeout callback was fired, method: " + method + ", url:" + url);
                };

                // make any call and we expect it to timeout
                this.trap(function(e) {
                    t.assert.ok(true, "Trap handler called: " + JSON.stringify(e));
                    success();
                    return false;
                }).listApplications();
            });

            var success = function()
            {
                start();
            };
        });
    });
});
