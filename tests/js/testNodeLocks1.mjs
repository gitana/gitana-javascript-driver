import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeLocks1", function() {

    it("Locks", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // create a node
                this.createNode().then(function() {

                    // NOTE: this = node

                    // lock the node and verify
                    this.lock().checkLocked(function(isLocked) {
                        t.assert.ok(isLocked, "Node was locked");
                    });

                    // unlock the node and verify
                    this.unlock().checkLocked(function(isLocked) {
                        t.assert.ok(!isLocked, "Node was unlocked");
                    });

                    this.then(function() {
                        success();
                    });
                });
            });

            var success = function() {
                start();
            };
        });
    });
});
