(function($) {

    module("nodeAttachments3");

    // Test case : Node Attachments #3
    test("Node Attachments", function() {

        stop();

        expect(3);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").createRepository().readBranch("master").then(function() {

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
                        equal(count, 2, "Attachment size is 2");
                    });

                    // get the first attachment
                    this.attachment("attachmentId1").then(function() {

                        // verify filename
                        equal(this.getFilename(), "abc.txt", "First filename is abc.txt");
                    });

                    // get the second attachment
                    this.attachment("attachmentId2").then(function() {

                        // verify filename
                        equal(this.getFilename(), "def.txt", "Second filename is def.txt");
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

}(jQuery) );
