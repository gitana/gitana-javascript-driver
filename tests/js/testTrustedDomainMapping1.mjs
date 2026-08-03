import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("trustedDomainMapping1", function() {

    it("Trusted Domain Mapping 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform
                var platformId = this.getId();

                // create a web host
                this.createWebHost().then(function() {

                    // NOTE: this = web host

                    // create a trusted domain mapping
                    var id1 = null;
                    this.createTrustedDomainMapping("abc.com", "webdav", platformId).then(function() {
                        id1 = this.getId();
                    });
                    var id2 = null;
                    this.createTrustedDomainMapping("def.com", "webdav", platformId).then(function() {
                        id2 = this.getId();
                    });
                    var id3 = null;
                    this.createTrustedDomainMapping("def.com", "ftp", platformId).then(function() {
                        id3 = this.getId();
                    });

                    this.then(function() {

                        this.listTrustedDomainMappings().count(function(count) {
                            t.assert.equal(count, 3, "Found 3 trusted domain mappings");
                        });

                        // delete #3
                        this.readTrustedDomainMapping(id3).del();

                        this.listTrustedDomainMappings().count(function(count) {
                            t.assert.equal(count, 2, "Found 2 trusted domain mappings");
                        });

                        this.then(function() {
                            success();
                        });
                    });
                });
            });

            var success = function()
            {
                start();
            };
        });
    });
});
