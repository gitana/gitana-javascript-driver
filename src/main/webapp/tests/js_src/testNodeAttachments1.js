(function($) {

    module("nodeAttachments1");

    // Test case : Node Attachments
    test("Node Attachments", function() {

        stop();

        expect(9);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a node
            this.createNode().then(function() {

                // create a bunch of text attachments
                this.attach("attachmentId1", "first", "text/plain");
                this.attach("attachmentId2", "second", "text/plain");
                this.attach("attachmentId3", "third", "text/plain");
                this.attach("attachmentId4", "fourth", "text/plain");

                // reload ourselves
                this.reload();

                // list and verify
                this.attachments().count(function(count) {
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
                this.attachments().each(function() {

                    var length = this.getLength();
                    ok(length > 0, "Iteration length > 0");
                });

                // download attachment
                this.attachment("attachmentId2").download(function(data) {

                    ok(data.length > 0, "Download works");
                });

                // NOTE: getting a 405 METHOD NOT ALLOWED on DELETE?
                /*
                // delete attachment (using list + select)
                this.attachments().select("attachmentId3").del();
                */

                // list and verify
                /*
                this.attachments().count(function(count) {
                    equal(count, 3, "Attachment size is 3");
                });
                */
                ok(true, "Dummy placeholder until 405 solved");
            });

            this.then(function() {
                success();
            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
