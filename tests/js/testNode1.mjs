import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("node1", function() {

    it("Node CRUD operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(12);

        return guard(t, function(start) {
            var test = this;

            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // create a few nodes
                this.createNode();
                this.createNode();
                this.createNode();

                // create a node
                this.then(function() {

                    this.createNode().then(function() {

                        // NOTE: this = node

                        test.node = this;

                        t.assert.ok(true, "Created second node");
                    });

                });

                // read the node back
                this.subchain(this).then(function() {

                    this.readNode(test.node.getId()).then(function() {
                        t.assert.ok(true, "Read node back");

                        t.assert.ok(this.stats(), "Node stats field generated");

                        // NOTE: this = node

                        // update the node
                        this["title"] = "lapaz";
                        this["description"] = "illimani";
                        this.update().reload().then(function() {

                            // NOTE: this = node

                            t.assert.equal(this["title"], "lapaz", "Matched property #1");
                            t.assert.equal(this["description"], "illimani", "Matched property #2");
                            t.assert.ok(true, "Updated node");

                            // touch the node
                            this.touch().then(function() {

                                t.assert.ok(true, "Touched node");

                                // delete the node
                                this.del().then(function() {
                                    t.assert.ok(true, "Deletion succeeded");
                                });

                            });
                        });
                    });
                });

                // for giggles, fire off some parallel node creates
                // define thread function
                var f = function()
                {
                    this.createNode();
                };
                this.then([f,f,f,f]).then(function() {
                    t.assert.ok(true, "Parallel node create success");
                });

                // test queryOne()
                this.then(function() {

                    this.createNode({"prop": "val1"});
                    this.queryNodes({"prop": "val1"}).count(function(count) {
                        t.assert.equal(count, 1, "Found one using full query");
                    });
                    this.queryOne({"prop": "val1"}).then(function() {
                        t.assert.ok(true, "Found one using queryOne");
                    });
                    this.queryOne({"prop2": "val1"}, function(err) {
                        t.assert.ok(err, "Caught err flag on queryOne no match");
                        success();
                        //start();
                    }).then(function() {
                        t.assert.ok(false, "This line should never be reached!");
                    });
                });

                this.then(function() {
                    success();
                });

            });

            var success = function()
            {
                start();
            };
        });
    });
});
