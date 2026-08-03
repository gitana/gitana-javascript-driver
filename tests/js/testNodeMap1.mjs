import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeMap1", function() {

    it("Node Map 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(12);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                var label = "abc-" + new Date().getTime();

                // create some nodes
                this.createNode({"value": 0, "label": label});
                this.createNode({"value": 1, "label": label});
                this.createNode({"value": 2, "label": label});
                this.createNode({"value": 3, "label": label});
                this.createNode({"value": 4, "label": label});
                this.createNode({"value": 5, "label": label});
                this.createNode({"value": 6, "label": label});
                this.createNode({"value": 7, "label": label});
                this.createNode({"value": 8, "label": label});
                this.createNode({"value": 9, "label": label});


                // query for all nodes by this label, check json properties
                this.queryNodes({
                    "label": label
                }, {
                    "limit": -1
                }).then(function() {
                    t.assert.equal(this.totalRows(), 10, "Total rows was 10");
                    t.assert.equal(this.size(), 10, "Size was 10");
                    t.assert.equal(this.offset(), 0, "Offset was 0");
                });


                // query for nodes and filter by value > 5
                this.queryNodes({}, {
                    "limit": -1
                }).filter(function() {
                    return (this.get("value") > 5)
                }).count(function(count) {
                    t.assert.equal(count, 4, "Count was 4");
                });


                // query for nodes and filter for even values
                this.queryNodes({}, {
                    "limit": -1
                }).filter(function() {
                    return (this.get("value") % 2 == 0);
                }).count(function(count) {
                    t.assert.equal(count, 5, "Count was 5");
                });


                // query for nodes and filter for odd values
                var counter = 0;
                this.queryNodes({}, {
                    "limit": -1
                }).filter(function() {
                    return (this.get("value") % 2 == 1);
                }).each(function() {
                    counter++;
                });
                this.then(function() {
                    t.assert.equal(counter, 5, "Odd value count was 5");
                });


                // query for nodes, filter for even values and then sum up via each
                var sum = 0;
                this.queryNodes({}, {
                    "limit": -1
                }).filter(function() {
                    return (this.get("value") % 2 == 0);
                }).count(function(count) {
                    t.assert.equal(count, 5, "Count was 5");
                }).each(function() {
                    sum += this.get("value");
                });
                this.then(function() {
                    t.assert.equal(sum, 20, "Sum was 20");
                });

                // query for nodes and keep the result set thin (rows only, no values)
                // ensure we don't get any value back
                this.queryNodes({}, {
                    "full":false,
                    "limit": -1
                }).then(function() {

                    t.assert.ok(!this.asArray()[0].value);
                    t.assert.ok(this.asArray()[0]["_doc"]);
                });


                // define a new type
                var contentType = {
                    "_qname": "custom:knopfler1",
                    "_type": "d:type"
                };
                this.createNode(contentType);

                // perform a filter over definitions
                var count1 = 0;
                var count2 = 0;
                this.listDefinitions("type", {
                    "limit": -1
                }).count(function(count) {
                    count1 = count;
                });
                this.listDefinitions("type", {
                    "limit": -1
                }).filter(function() {
                    return (this.get('_parent') == 'n:node' && this.getQName().substr(0, 2) != 'n:');
                }).each(function() {
                    count2++;
                });
                this.then(function() {
                    t.assert.ok(count2 < count1, "Count2 = " + count2 + " is less than Count1: " + count1);
                    t.assert.equal(count2, 6, "Count2 = 3");
                    // wcm:page, wcm:template, workflow:package, blog:blog and blog:post and custom:knopfler1
                });

                this.then(function() {
                    success();
                });

            });

            var success = function() {
                start();
            };
        });
    });
});
