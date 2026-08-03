import { describe, it } from "node:test";
import { Gitana, Chain, guard } from "../support.mjs";

describe("chaining4", function() {

    it("Chaining 420", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            // create a JSON object
            var json1 = {
                "title": "My object",
                "description": "A description",
                "url": "http://url.com"
            };
            // stringify
            var text1 = JSON.stringify(json1);

            // chain the object
            var json2 = Chain(json1);
            // stringify
            var text2 = JSON.stringify(json2);

            // make sure the strings are the same
            //console.log("text1: " + text1);
            //console.log("text2: " + text2);

            t.assert.equal(text2.length, text1.length, "JSON strings are the same length");
            t.assert.equal(text2, text1, "JSON strings are the same");

            start();
        });
    });
});
