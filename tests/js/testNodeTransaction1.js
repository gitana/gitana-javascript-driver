(function($) {

    module("nodeTransaction1");

    // Test case : Node Transaction 1
    _asyncTest("Node Transaction 1", function()
    {
        expect(2);

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

                // TODO: this syntax doesn't work
                var t = Gitana.transactions().create();
                t.for(branch);

                // TEMP
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

                // callback for success
                t.success = function(results) {
                    success();
                };

                // this creates the transaction, pushes up all the objects and the commits them
                // all the IO happens after this call (first pass)
                // second pass, optimize so that IO gets spread out as things are being added
                t.commit();
            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
