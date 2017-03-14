(function($) {

    module("nodeRelatives1");

    // Test case : Node relatives test #1
    _asyncTest("Node Relatives #1", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch
            var branch = this;

            // create a node
            var mainNode = null;
            this.createNode({
                "title": "Main Node"
            }).then(function() {
                mainNode = this;
            });

            // create three relatives

            var relativeNode1 = null;
            this.createNode({
                "title": "Relative Node 1",
                "category": "first"
            }).then(function() {
                relativeNode1 = this;
            });

            var relativeNode2 = null;
            this.createNode({
                "title": "Relative Node 2",
                "category": "first"
            }).then(function() {
                relativeNode2 = this;
            });

            var relativeNode3 = null;
            this.createNode({
                "title": "Relative Node 3",
                "category": "second"
            }).then(function() {
                relativeNode3 = this;
            });


            this.then(function() {

                // associate relatives
                this.subchain(mainNode).associate(relativeNode1, "a:child");
                this.subchain(mainNode).associate(relativeNode2, "a:child");
                this.subchain(mainNode).associate(relativeNode3, "a:child");

            });

            this.then(function() {

                // query for relatives
                this.subchain(mainNode).queryRelatives({
                    "category": "first"
                }, {
                    "type": "a:child"
                }, {
                    "limit": 10,
                    "skip": 0,
                    "sort": {
                        "category": 1
                    }
                }).count(function(c) {
                    equal(2, c, "There are two relatives with category: first");
                }).then(function() {
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
