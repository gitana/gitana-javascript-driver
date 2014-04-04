(function($) {

    module("node3");

    // Test case : Bulk node deletion (using branch).
    _asyncTest("Node bulk deletion", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a few nodes
            var nodeIds = [];
            this.createNode().then(function() {
                nodeIds.push(this.getId());
            });
            this.createNode().then(function() {
                nodeIds.push(this.getId());
            });
            this.createNode().then(function() {
                nodeIds.push(this.getId());
            });

            // now delete
            this.then(function() {
                this.deleteNodes(nodeIds).then(function() {
                    ok(true, "deleted nodes");
                })
            });

            // now try to read them back
            this.then(function() {
                this.trap(function(err) {
                    success();
                });

                // this throws
                this.readNode(nodeIds[0]);
            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
