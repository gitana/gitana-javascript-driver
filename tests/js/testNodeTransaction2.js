(function($) {

    module("nodeTransaction2");

    // Test case : Node Transaction 2
    _asyncTest("Node Transaction 2", function()
    {
        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // create a repository and get the master branch
            var branch = null;
            this.createRepository().readBranch("master").then(function() {
                branch = this;
            });

            // create four nodes
            var node1 = null;
            var node2 = null;
            var node3 = null;
            var node4 = null;
            this.then(function() {
                this.createNode().then(function() {
                    node1 = this;
                });
                this.createNode().then(function() {
                    node2 = this;
                });
                this.createNode().then(function() {
                    node3 = this;
                });
                this.createNode().then(function() {
                    node4 = this;
                });
            });

            this.then(function() {

                // create a transaction

                // TODO: this syntax doesn't work
                //var t = Gitana.transactions().create();
                //t.for(branch);

                // TEMP
                var t = Gitana.transactions().create(branch);

                // create 100 objects
                for (var i = 0; i < 100; i++)
                {
                    t.create({
                        "title": "Node Title #" + i,
                        "description": "Node Description #" + i
                    });
                }

                // delete two objects
                t.del(node1.getId());
                t.del(node2.getId());

                // update two objects
                t.update(node3);
                t.update(node4);

                // create 100 more objects
                for (var i = 100; i < 200; i++)
                {
                    t.create({
                        "title": "Node Title #" + i,
                        "description": "Node Description #" + i
                    });
                }

                // commit
                t.commit().then(function(results) {
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
