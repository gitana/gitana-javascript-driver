(function($) {

    module("find1");

    // Test case : Find operations.
    _asyncTest("Find Operations", function()
    {
        expect(4);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch
            var branch = this;

            // define 8 slightly different documents
            var obj1 = { "title": "The quick brown fox jumped over the fence", "size": 30};
            var obj2 = { "title": "The slow brown fox jumped over the fence", "size": 40};
            var obj3 = { "title": "The quick pink fox jumped over the fence", "size": 32}; //
            var obj4 = { "title": "The slow pink fox jumped over the fence", "size": 28};
            var obj5 = { "title": "The quick brown fox jumped under the house", "size": 10}; //
            var obj6 = { "title": "The quick red zebra jumped over the house", "size": 20}; //
            var obj7 = { "title": "The slow red zebra jumped over the house", "size": 80};
            var obj8 = { "title": "The quick brown zebra jumped over the house", "size": 5}; //

            var node1 = null;
            var node2 = null;
            var node3 = null;
            var node4 = null;
            var node5 = null;
            var node6 = null;
            var node7 = null;
            var node8 = null;

            // create the 8 nodes
            this.createNode(obj1).then(function() {
                node1 = this;
            });
            this.createNode(obj2).then(function() {
                node2 = this;
            });
            this.createNode(obj3).then(function() {
                node3 = this;
            });
            this.createNode(obj4).then(function() {
                node4 = this;
            });
            this.createNode(obj5).then(function() {
                node5 = this;
            });
            this.createNode(obj6).then(function() {
                node6 = this;
            });
            this.createNode(obj7).then(function() {
                node7 = this;
            });
            this.createNode(obj8).then(function() {
                node8 = this;
            });

            this.then(function() {
                // associate all of these nodes
                //
                //   1 -> 2 (a:child with "tags" = "dizzy slash axl rose")
                //   1 -> 3 (a:child with "tags" = "kurt cobain david grohl")   + zebra
                //   1 -> 4 (a:child with "tags" = "eddie van halen")           + fox
                //   3 -> 5 (a:child with "tags" = "eric claptop joe satriani")
                //   3 -> 6 (a:child with "tags" = "rivers cuomo under")           + under
                //   6 -> 7 (a:child with "tags" = "david gilmour roger waters")   + zebra
                //   7 -> 8 (a:child with "tags" = "robert plant jimmy page")

                var a1 = { "_type": "a:child", "tags": ['dizzy', 'slash', 'axl', 'rose'] };
                var a2 = { "_type": "a:child", "tags": ['kurt', 'cobain', 'david', 'grohl', 'zebra'] };
                var a3 = { "_type": "a:child", "tags": ['eddie', 'van', 'halen', 'fox'] };
                var a4 = { "_type": "a:child", "tags": ['eric', 'clapton', 'joe', 'satriani'] };
                var a5 = { "_type": "a:child", "tags": ['rivers', 'cuomo', 'under'] };
                var a6 = { "_type": "a:child", "tags": ['david', 'gilmour', 'roger', 'waters', 'zebra'] };
                var a7 = { "_type": "a:child", "tags": ['robert', 'plant', 'jimmy', 'page'] };
                this.subchain(node1)
                    .associate(node2, a1)
                    .associate(node3, a2)
                    .associate(node4, a3);
                this.subchain(node3)
                    .associate(node5, a4)
                    .associate(node6, a5);
                this.subchain(node6).associate(node7, a6);
                this.subchain(node7).associate(node8, a7);
            });

            // wait a little to allow indexing to finish
            this.wait(3000);

            this.then(function() {

                // find everything in the branch where size > 30
                this.subchain(branch).find({
                    "query": {
                        "size": {
                            "$gt": 30
                        }
                    }
                }).count(function(count) {
                    equal(count, 3, "Found size > 30... count was 3");
                });

                // find everything in the branch where size > 30 and contains the text "slow"
                this.subchain(branch).find({
                    "query": {
                        "size": {
                            "$gt": 30
                        }
                    },
                    "search": "slow"
                }).count(function(count) {
                    equal(count, 2, "Found size > 30, text='slow'... count was 2");
                });

                // find everything that is 1 hop away from node 1, size < 40 and contains text "quick"
                this.subchain(node1).find({
                    "query": {
                        "size": {
                            "$lt": 40
                        }
                    },
                    "search": "quick",
                    "traverse": {
                        "depth": 1
                    }
                }).count(function(count) {
                    equal(count, 2, "Found around node1, depth = 1, size < 40, text='quick'... count was 2 which includes center node");
                });

                // find everything that is 2 hops away from node 1, size < 40 and contains text "quick"
                this.subchain(node1).find({
                    "query": {
                        "size": {
                            "$lt": 40
                        }
                    },
                    "search": "quick",
                    "traverse": {
                        "depth": 2
                    }
                }).count(function(count) {
                    // NOTE: shouldn't this be 3?
                    equal(count, 5, "Found around node1, depth = 2, size < 40, text='quick'... count was 5 which includes center node");
                });
            });

            this.then(function() {
                success();
            });

        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
