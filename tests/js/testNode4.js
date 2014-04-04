(function($) {

    module("node4");

    // Test case : Bulk node deletion (using a node map).
    _asyncTest("Node bulk deletion", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a few nodes
            this.createNode({
                "tag": "booya"
            });
            this.createNode({
                "tag": "booya"
            });
            this.createNode({
                "tag": "booya"
            });

            // query for the nodes to get a result set
            // then delete right away
            this.queryNodes({
                "tag": "booya"
            }).del().then(function() {
                ok(true, "deleted nodes");
            });

            this.queryNodes({
                "tag": "booya"
            }).count(function(count) {
                success();
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
