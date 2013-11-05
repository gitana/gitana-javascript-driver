(function($) {

    module("stackAttachments1");

    // Test case : Stack Attachments
    _asyncTest("Stack Attachments 1", function()
    {


        expect(13);

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
                    equal(count, 4, "Attachment size is 4");
                });

                // get an attachment, play with its properties and download it
                this.attachment("attachmentId1").then(function() {

                    var length = this.getLength();
                    ok(length > 0, "Length greater than zero");

                    var attachmentId = this.getId();
                    equal(attachmentId, "attachmentId1", "Correct attachment ID");

                    var contentType = this.getContentType();
                    equal("text/plain", contentType, "Correct content type");

                    var uri = this.getUri();
                    ok(uri, "Computed uri: " + uri);

                    var downloadUri = this.getDownloadUri();
                    ok(downloadUri, "Computed download uri: " + downloadUri);
                });

                // walk through all attachments and verify something
                this.listAttachments().each(function() {

                    var length = this.getLength();
                    ok(length > 0, "Iteration length > 0");
                });

                // download attachment
                this.attachment("attachmentId2").download(function(data) {
                    ok(data.length > 0, "Download works");
                });

                // delete attachment (using list + select)
                this.listAttachments().select("attachmentId3").del();

                // list and verify
                this.listAttachments().count(function(count) {
                    equal(count, 3, "Attachment size is 3");
                });

                // try to request an attachment that doesn't exist and verify
                this.trap(function() {
                    ok(true, "Handled missing attachment correctly");
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

}(jQuery) );
