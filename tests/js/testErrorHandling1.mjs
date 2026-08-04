import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("errorHandling1", function() {

    it("Error handling 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(4);

        return guard(t, function(start) {
            /**
             * Error handling should have:
             *
             *   {
             *     "status": <status code>,
             *     "statusText": "<status text>",
             *     "message": <detailed message>"
             *   }
             *
             * @param err
             */
            var errorHandler = function(err)
            {
                t.assert.ok(err.status, "Caught error has status field");
                t.assert.equal(typeof err.statusText, "string", "Caught error has status text field");
                t.assert.equal(typeof err.message, "string", "Caught error has message field");
                t.assert.equal(err.status, 404, "Status code is 404.");

                start();
            };

            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.trap(errorHandler)
                    .readRepository("SOMETHING_THAT_DOESNT_EXIST")
                    .then(function() {

                t.assert.ok(false, "This shouldn't have been called");
                start();
            });
        });
    });
});
