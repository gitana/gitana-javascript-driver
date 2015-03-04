(function($) {

    module("nodeQueryGet1");

    // Test case : Node query get operations.
    _asyncTest("Node Query Get operations", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a few nodes
            this.createNode({
                "prop": "val1"
            });
            this.createNode({
                "prop": "val1"
            });
            this.createNode({
                "prop": "val2"
            });

            Gitana.PREFER_GET_OVER_POST = true;

            this.queryNodes({
                "prop": "val1"
            }).count(function (c) {
                ok(c === 2, "Get query worked");

                Gitana.PREFER_GET_OVER_POST = false;

                success();
            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
