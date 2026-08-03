import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("chainable6", function() {

    it("Chainable 6", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(5);

        return guard(t, function(start) {
            GitanaTest.authenticateFullOAuth().then(function() {

                this.createRepository().readBranch("master").then(function() {

                    // create 5 nodes
                    this.createNode({
                        "group": "abc"
                    });
                    this.createNode({
                        "group": "abc"
                    });
                    this.createNode({
                        "group": "abc"
                    });
                    this.createNode({
                        "group": "abc"
                    });
                    this.createNode({
                        "group": "abc"
                    });


                    // query for all the nodes
                    // for each, set value = 1
                    // then walk list and confirm
                    this.queryNodes({
                        "group": "abc"
                    }).each(function() {
                        this.value = 1;
                    }).then(function() {

                        // flip to JSON and back
                        // this gets rid of any functions or prototype properties/methods
                        // now just a simple json object of key/value
                        var json = JSON.parse(JSON.stringify(this));
                        for (var k in json)
                        {
                            t.assert.equal(json[k].value, 1, "Value was 1 for: " + k);
                        }

                        success();
                    });

                });
            });

            var success = function()
            {
                start();
            }
        });
    });
});
