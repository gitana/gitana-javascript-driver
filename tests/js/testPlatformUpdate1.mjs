import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("platformUpdate1", function() {

    it("Platform update", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            GitanaTest.authenticateNewTenant(function() {

                // NOTE: this = platform
                var platform = this;

                this.title = "MyPlatform1";
                this.abc = "def";

                this.update().reload().then(function() {

                    t.assert.ok(this.title == "MyPlatform1", "Correct platform title");
                    t.assert.ok(this.abc == "def", "Correct platform custom property");

                    start();

                });

            });
        });
    });
});
