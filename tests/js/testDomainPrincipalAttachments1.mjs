import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("domainPrincipalAttachments1", function() {

    it("Domain Principal Attachments 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(4);

        return guard(t, function(start) {
            // user ids
            var userName = "user_" + new Date().getTime();

            // start
            var platform = GitanaTest.authenticateFullOAuth();
            platform.readPrimaryDomain().then(function() {

                // NOTE: this = domain

                // create user
                this.createUser({
                    "name": userName
                }).then(function() {

                    // NOTE: this = user

                    this.attach("attachment1", "text/plain", "Jimi Hendrix");
                    this.attach("attachment2", "text/plain", "Mark Knopfler");
                    this.attach("attachment3", "text/plain", "Yngwie Malmsteen");

                    this.listAttachments().count(function(count) {

                        // NOTE: this = attachment

                        t.assert.equal(count, 3, "Found 3 attachments");
                    });

                    this.listAttachments().each(function() {

                        // NOTE: this = attachment

                        // download
                        this.download(function(data) {
                            t.assert.ok(data.length > 0, "Data greater than zero");
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
});
