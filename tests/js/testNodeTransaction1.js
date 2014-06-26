(function($) {

    module("nodeTransaction1");

    // Test case : Node Transaction 1
    _asyncTest("Node Transaction 1", function()
    {
        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // create a repository and get the master branch
            var branch = null;
            this.createRepository().readBranch("master").then(function() {
                branch = this;
            });

            this.then(function() {

                // create a transaction
                // this doesn't actually create a transaction on the server side
                // it just holds things in memory until the commit
                //var t = Gitana.transactions().create();
                //t.for(branch);

                var t = Gitana.transactions().create(branch);

                // create 1000 objects
                // these all get added to the in-memory queue
                for (var i = 0; i < 1000; i++)
                {
                    t.create({
                        "title": "Node Title #" + i,
                        "description": "Node Description #" + i
                    });
                }

                // this creates the transaction, pushes up all the objects and the commits them
                // all the IO happens after this call (first pass)
                // second pass, optimize so that IO gets spread out as things are being added
                t.commit().then(function(results) {

                    ok(results.totalCount == 1000, "Total count is 1000");
                    ok(results.errorCount == 0, "Error count is 0");
                    ok(results.successCount == 1000, "Success count is 1000");

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
