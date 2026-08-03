import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("stackAttachments1", function() {

    it("Stack Attachments 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(13);

        return guard(t, function(start) {
            var test = this;

            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                // create a stack
                this.createStack().then(function() {

                    // NOTE: this = stack

                    // create a bunch of text attachments
                    this.attach("attachmentId1", "text/plain", "first");
                    this.attach("attachmentId2", "text/plain", "second");
                    this.attach("attachmentId3", "text/plain", "third");
                    this.attach("attachmentId4", "text/plain", "fourth");

                    // list and verify
                    this.listAttachments().count(function(count) {
                        t.assert.equal(count, 4, "Attachment size is 4");
                    });

                    // get an attachment, play with its properties and download it
                    this.attachment("attachmentId1").then(function() {

                        var length = this.getLength();
                        t.assert.ok(length > 0, "Length greater than zero");

                        var attachmentId = this.getId();
                        t.assert.equal(attachmentId, "attachmentId1", "Correct attachment ID");

                        var contentType = this.getContentType();
                        t.assert.equal("text/plain", contentType, "Correct content type");

                        var uri = this.getUri();
                        t.assert.ok(uri, "Computed uri: " + uri);

                        var downloadUri = this.getDownloadUri();
                        t.assert.ok(downloadUri, "Computed download uri: " + downloadUri);
                    });

                    // walk through all attachments and verify something
                    this.listAttachments().each(function() {

                        var length = this.getLength();
                        t.assert.ok(length > 0, "Iteration length > 0");
                    });

                    // download attachment
                    this.attachment("attachmentId2").download(function(data) {
                        t.assert.ok(data.length > 0, "Download works");
                    });

                    // delete attachment (using list + select)
                    this.listAttachments().select("attachmentId3").del();

                    // list and verify
                    this.listAttachments().count(function(count) {
                        t.assert.equal(count, 3, "Attachment size is 3");
                    });

                    // try to request an attachment that doesn't exist and verify
                    this.trap(function() {
                        t.assert.ok(true, "Handled missing attachment correctly");
                    }).attachment("missing").getDownloadUri();
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
