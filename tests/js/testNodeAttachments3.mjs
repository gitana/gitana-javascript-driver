import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeAttachments3", function() {

    it("Node Attachments 3", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // create a node
                this.createNode().then(function() {

                    // NOTE: this = node

                    // create two attachments with filenames
                    this.attach("attachmentId1", "text/plain", "first", "abc.txt");
                    this.attach("attachmentId2", "text/plain", "second", "def.txt");

                    // reload the node
                    this.reload().then(function() {

                        this.listAttachments(true).count(function(count) {
                            t.assert.equal(count, 2, "Attachment size is 2");
                        });

                        // get the first attachment
                        this.attachment("attachmentId1").then(function() {

                            // verify filename
                            t.assert.equal(this.getFilename(), "abc.txt", "First filename is abc.txt");
                        });

                        // get the second attachment
                        this.attachment("attachmentId2").then(function() {

                            // verify filename
                            t.assert.equal(this.getFilename(), "def.txt", "Second filename is def.txt");
                        });
                    });
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
