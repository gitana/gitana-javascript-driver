(function($) {

    module("chainable3");

    // Test case : Chainable 3
    test("Chainable 3", function()
    {
        stop();

        expect(4);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // create a repository
            this.createRepository().readBranch("master").then(function()
            {
                var count = 0;

                // create three nodes
                this.createNode({ "prop": "1" }).then(function() {
                    this.attach("default", "text/plain", "la la la");
                });
                this.createNode({ "prop": "1" }).then(function() {
                    this.attach("default", "text/plain", "la la la");
                });
                this.createNode({ "prop": "1" }).then(function() {
                    this.attach("default", "text/plain", "la la la");
                });

                // query for nodes
                this.queryNodes({
                    "prop": "1"
                }).count(function(c) {
                    ok(3, c, "Count was 3");
                }).each(function() {

                    this.listAttachments(true).select("default").then(function() {

                        var imageUrl = this.getDownloadUri();
                        ok(imageUrl, "Found image url");

                        count++;

                        if (count == 3)
                        {
                            success();
                        }
                    });
                });
            });
        });

        var success = function()
        {
            start();
        }

    });

}(jQuery) );
