(function($) {

    module("chainable4");

    // Test case : Chainable 4
    test("Chainable 4", function()
    {
        stop();

        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // create a repository
            var count = 0;
            this.createRepository()
                .readBranch("master")
                    .createNode({ "prop": "1" })
                        .attach("default", "text/plain", "la la la")
                        .done()
                    .done()
                    .createNode({"prop": "1"})
                        .attach("default", "text/plain", "la la la")
                        .done()
                    .done()
                    .createNode({"prop": "1"})
                        .attach("default", "text/plain", "la la la")
                        .done()
                    .done()
                    .queryNodes({"prop": "1"}).each(function() {

                        this.listAttachments(true).select("default").then(function() {

                            var imageUrl = this.getDownloadUri();
                            ok(imageUrl, "Found image url");

                            count++;

                            if (count == 3)
                            {
                                success();
                            }
                        });
                    })
                .done()
            .done()
        });

        var success = function()
        {
            start();
        }

    });

}(jQuery) );
