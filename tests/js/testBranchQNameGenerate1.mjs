import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("branchQNameGenerate1", function() {

    it("Branch QName generation.", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            // object upon which we base the qname
            var object = {
                "title": "My First Title"
            };

            var gitana = GitanaTest.authenticateFullOAuth();
            gitana
                    .createRepository()
                    .readBranch("master")
                    .generateQName(object, function(qname) {

                t.assert.equal(qname , "custom:myFirstTitle", "QName should have been: custom:myFirstTitle");
                success();

            });

            var success = function() {
                start();
            };
        });
    });
});
