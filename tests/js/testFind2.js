(function($) {

    module("find2");

    // Test case : Find operations.
    _asyncTest("Find Operations with Limits", function()
    {
        expect(8);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch
            var branch = this;

            // define 24 slightly different documents
            var obj1  = { "title": "The quick brown fox jumped over the fence", "size": 30};
            var obj2  = { "title": "The slow brown fox jumped over the fence", "size": 40};
            var obj3  = { "title": "The quick pink fox jumped over the fence", "size": 32};
            var obj4  = { "title": "The slow pink fox jumped over the fence", "size": 28};
            var obj5  = { "title": "The quick brown fox jumped under the house", "size": 10};
            var obj6  = { "title": "The quick red zebra jumped over the house", "size": 20};
            var obj7  = { "title": "The slow red zebra jumped over the house", "size": 80};
            var obj8  = { "title": "The quick brown zebra jumped over the house", "size": 5};

            var obj9  = { "title": "The quick brown rhino jumped over the pond", "size": 30};
            var obj10 = { "title": "The slow brown rhino jumped over the pond", "size": 40};
            var obj11 = { "title": "The quick pink rhino jumped over the pond", "size": 32};
            var obj12 = { "title": "The slow pink rhino jumped over the pond", "size": 28};
            var obj13 = { "title": "The quick brown rhino jumped under the house", "size": 10};
            var obj14 = { "title": "The slow brown rhino jumped over the house", "size": 20};
            var obj15 = { "title": "The quick pink rhino jumped over the house", "size": 80};
            var obj16 = { "title": "The slow pink rhino jumped over the house", "size": 5};

            var obj17 = { "title": "The quick brown moose jumped over the pond", "size": 30};
            var obj18 = { "title": "The slow brown moose jumped over the pond", "size": 40};
            var obj19 = { "title": "The quick pink moose jumped over the pond", "size": 32};
            var obj20 = { "title": "The slow pink moose jumped over the pond", "size": 28};
            var obj21 = { "title": "The quick brown moose jumped under the house", "size": 10};
            var obj22 = { "title": "The slow brown moose jumped over the house", "size": 20};
            var obj23 = { "title": "The quick pink moose jumped over the house", "size": 80};
            var obj24 = { "title": "The slow pink moose jumped over the house", "size": 5};

            // create the nodes
            this.createNode(obj1);
            this.createNode(obj2);
            this.createNode(obj3);
            this.createNode(obj4);
            this.createNode(obj5);
            this.createNode(obj6);
            this.createNode(obj7);
            this.createNode(obj8);
            this.createNode(obj9);
            this.createNode(obj10);
            this.createNode(obj11);
            this.createNode(obj12);
            this.createNode(obj13);
            this.createNode(obj14);
            this.createNode(obj15);
            this.createNode(obj16);
            this.createNode(obj17);
            this.createNode(obj18);
            this.createNode(obj19);
            this.createNode(obj20);
            this.createNode(obj21);
            this.createNode(obj22);
            this.createNode(obj23);
            this.createNode(obj24);

            // wait a little bit for indexing to catch up?
            this.wait(5000);

            this.then(function() {

                // find everything in the branch with the text "over"
                // should return 21
                this.subchain(branch).find({
                    "search": "over"
                }, {
                    "limit": -1
                }).count(function(count) {
                    equal(count, 21, "Found count == 21");
                    equal(this.totalRows(), 21, "Found total rows == 21");
                });

                // find everything in the branch with limit = 10
                // should return 10
                this.subchain(branch).find({
                    "search": "over"
                }, {
                    "limit": 10
                }).count(function(count) {
                    equal(count, 10, "Found count == 10");
                    equal(this.totalRows(), 21, "Found total rows == 21");
                });

                // find everything in branch with text "over" and size > 10
                // should return 18
                this.subchain(branch).find({
                    "query": {
                        "size": {
                            "$gt": 10
                        }
                    }
                }, {
                    "limit": -1
                }).count(function(count) {
                    equal(count, 18, "Found count == 18");
                    equal(this.totalRows(), 18, "Found total rows == 18");
                });

                // find everything in branch with text "over" and size > 10
                // sort by title ascending
                // should have "The quick brown fox jumped over the fence" first
                this.subchain(branch).find({
                    "search": "over",
                    "query": {
                        "size": {
                            "$gt": 10
                        }
                    }
                }, {
                    "sort": {
                        "title": 1
                    },
                    "limit": -1
                }).keepOne().then(function() {
                    equal(this["title"], "The quick brown fox jumped over the fence", "Sort #1 worked");
                });


                // find everything in branch with text "over" and size > 10
                // sort by title ascending
                // should have "The slow red zebra jumped over the house" first
                this.subchain(branch).find({
                    "search": "over",
                    "query": {
                        "size": {
                            "$gt": 10
                        }
                    }
                }, {
                    "sort": {
                        "title": -1
                    },
                    "limit": -1
                }).keepOne().then(function() {
                    equal(this["title"], "The slow red zebra jumped over the house", "Sort #2 worked");
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
