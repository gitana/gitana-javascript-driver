(function($) {

    module("node5");

    // Test case : Field querying.
    _asyncTest("Node field querying.", function()
    {
        expect(10);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a few nodes
            this.createNode({
                "title": "First Node Title",
                "description": "First Node Description",
                "author": "Joe",
                "tag": "booya"
            });
            this.createNode({
                "title": "Second Node Title",
                "description": "Second Node Description",
                "author": "Joe",
                "tag": "booya"
            });
            this.createNode({
                "title": "Third Node Title",
                "description": "Third Node Description",
                "author": "Joe",
                "tag": "booya"
            });

            // query for the nodes to get a result set
            // then delete right away
            this.queryNodes({
                "tag": "booya",
                "_fields": {
                    "title": 1,
                    "description": 1
                }
            }).count(function(count) {
                ok(count === 3, "Found three nodes");
            }).each(function() {
                ok(this.title, "Does have title");
                ok(this.description, "Does have description");
                ok(!this.author, "Does not have author");
            }).then(function() {
                success();
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
