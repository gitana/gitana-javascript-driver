(function($) {

    module("node6");

    // Test case : Field querying with pagination.
    _asyncTest("Node field querying.", function()
    {
        expect(1);

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

            // test out pagination
            // query for the nodes to get a result set
            // limit to skip 1, size 1
            this.queryNodes({
                "tag": "booya",
                "_fields": {
                    "title": 1,
                    "description": 1,
                    "_system": 1
                }
            }, {
                "limit": 1,
                "offset": 1
            }).count(function(count) {
                ok(count === 1, "Found one node");
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
