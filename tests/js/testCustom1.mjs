import { describe, it } from "node:test";
import { Gitana, guard } from "../support.mjs";

describe("custom1", function() {

    it("Gitana Custom #1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(0);

        return guard(t, function(start) {
            /*
            Gitana.connect({
                'baseURL': "http://TODO",
                'ticketMaxAge': 5
            }).then(function() {
                console.log('CONNECTED');

                start();
            });
            */

            start();
        });
    });
});
