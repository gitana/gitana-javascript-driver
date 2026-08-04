import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("containedTypes1", function() {

    it("Contained Types", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                this.subchain(this.getCluster()).loadContainedTypes("platform", function(list) {
                    t.assert.ok(list.length >= 22, "Found at least 22 contained dependencies for platform");

                    start();
                });
            });
        });
    });
});
