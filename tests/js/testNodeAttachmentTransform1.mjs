import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard, loadFixtureBuffer } from "../support.mjs";

describe("nodeAttachmentTransform1", function() {

    it("Node Attachment Transform 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(10);

        return guard(t, function(start) {

            // a 64x64 PNG, transformed down to 32x32 below
            var image = loadFixtureBuffer("image1.png");

            var sourceLength = -1;

            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                this.createNode().then(function() {

                    // NOTE: this = node
                    var node = this;

                    // attach the source image
                    this.attach("original", "image/png", image, "image1.png");

                    // verify the source attachment landed
                    this.then(function() {

                        this.attachment("original").then(function() {

                            sourceLength = this.getLength();

                            t.assert.ok(sourceLength > 0, "Source attachment has a length");
                            t.assert.equal(this.getId(), "original", "Source attachment id is correct");
                            t.assert.equal(this.getContentType(), "image/png", "Source attachment is a PNG");
                            t.assert.equal(this.getFilename(), "image1.png", "Source attachment kept its filename");
                        });
                    });

                    // transform it into a second attachment on the same node
                    this.then(function() {

                        this.attachment("original").transform("thumbnail", "image/png", true, {
                            "width": 32,
                            "height": 32
                        }, function(response) {

                            t.assert.ok(response, "Transform returned a response");
                        });
                    });

                    // the node's attachment list is cached, so read it back from the server
                    this.then(function() {

                        node.reload().then(function() {

                            // the source, the transformed target, and the backup copy
                            // of the source that the server writes as "_original_original"
                            this.listAttachments().count(function(count) {
                                t.assert.equal(count, 3, "Node has the source, the target and the server's backup");
                            });

                            this.attachment("thumbnail").then(function() {

                                t.assert.equal(this.getId(), "thumbnail", "Target attachment id is correct");
                                t.assert.equal(this.getContentType(), "image/png", "Target attachment is a PNG");
                                t.assert.ok(this.getLength() > 0, "Target attachment has a length");

                                // 64x64 down to 32x32 - the target must be smaller than the source
                                t.assert.ok(this.getLength() < sourceLength,
                                    "Target (" + this.getLength() + " bytes) is smaller than the source (" + sourceLength + " bytes)");
                            });
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
