(function($) {

    /**
     * Tests out node transaction deletes.
     */
    module("nodeTransaction4");

    // Test case : Node Transaction 4
    _asyncTest("Node Transaction 4", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            var nodeIds = [];

            // create a repository and get the master branch
            var branch = null;
            this.createRepository().readBranch("master").then(function() {
                branch = this;

                // create a bunch of nodes and remember the ids
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
            });

            this.then(function() {

                // create a transaction to delete everything

                var t = Gitana.transactions().create(branch);
                for (var i = 0; i < nodeIds.length; i++)
                {
                    t.del(nodeIds[i]);
                }

                // commit
                t.commit().then(function(results) {

                    // now do some verification
                    ok(results.totalCount == results.successCount, "Transaction count was OK");

                    success();

                });
            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
