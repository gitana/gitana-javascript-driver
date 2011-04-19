(function($) {

    module("search");

    // Test case : Search operations.
    test("Search operations", function() {
        stop();

        expect(7);
        var driver = new Gitana.Driver();

        var repositoryId = null;
        var nodeId1 = null;
        var nodeId2 = null;
        var repository = null;
        var branch = null;

        var node1 = null;
        var node2 = null;
        var node3 = null;
        var node4 = null;
        var node5 = null;
        var node6 = null;
        var node7 = null;
        var node8 = null;

        var setupHandler1 = function(status) {
            repositoryId = status.getId();

            // read the repository back
            driver.repositories().read(repositoryId, setupHandler2);
        };

        var setupHandler2 = function(repository) {
            this.repository = repository;

            // read the master branch
            this.repository.branches().read("master", setupHandler3);
        };

        var setupHandler3 = function(branch) {
            this.branch = branch;

            setupHandler4();
        };

        var setupHandler4 = function() {
            var _this = this;

            // create 8 slightly different documents

            // NODE 1
            var obj1 = { "title": "The quick brown fox jumped over the fence" };
            _this.branch.nodes().create(obj1, function(status) {
                _this.branch.nodes().read(status.getId(), function(node) {
                    _this.node1 = node;

                    // NODE 2
                    var obj2 = { "title": "The slow brown fox jumped over the fence" };
                    _this.branch.nodes().create(obj2, function(status) {
                        _this.branch.nodes().read(status.getId(), function(node) {
                            _this.node2 = node;

                            // NODE 3
                            var obj3 = { "title": "The quick pink fox jumped over the fence" };
                            _this.branch.nodes().create(obj3, function(status) {
                                _this.branch.nodes().read(status.getId(), function(node) {
                                    _this.node3 = node;

                                    // NODE 4
                                    var obj4 = { "title": "The slow pink fox jumped over the fence" };
                                    _this.branch.nodes().create(obj4, function(status) {
                                        _this.branch.nodes().read(status.getId(), function(node) {
                                            _this.node4 = node;

                                            // NODE 5
                                            var obj5 = { "title": "The quick brown fox jumped under the house" };
                                            _this.branch.nodes().create(obj5, function(status) {
                                                _this.branch.nodes().read(status.getId(), function(node) {
                                                    _this.node5 = node;

                                                    // NODE 6
                                                    var obj6 = { "title": "The quick red zebra jumped over the house" };
                                                    _this.branch.nodes().create(obj6, function(status) {
                                                        _this.branch.nodes().read(status.getId(), function(node) {
                                                            _this.node6 = node;

                                                            // NODE 7
                                                            var obj7 = { "title": "The slow red zebra jumped over the house" };
                                                            _this.branch.nodes().create(obj7, function(status) {
                                                                _this.branch.nodes().read(status.getId(), function(node) {
                                                                    _this.node7 = node;

                                                                    // NODE 8
                                                                    var obj8 = { "title": "The quick brown zebra jumped over the house" };
                                                                    _this.branch.nodes().create(obj8, function(status) {
                                                                        _this.branch.nodes().read(status.getId(), function(node) {
                                                                            _this.node8 = node;

                                                                            // wait 8 seconds and then fire test 1
                                                                            // this provides enough time to ensure indexing
                                                                            setTimeout(test1, 3000);

                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        };

        var test1 = function() {
            // search #1 - find all nodes with the term: "fox"

            this.branch.search("fox", function(response) {

                equal(response.list.length , 5 , "Searched for keyword fox and found 5 nodes.");

                test2();

            });
        };

        var test2 = function() {
            // search #2 - find all nodes with the term: "slow"

            this.branch.search("slow", function(response) {

                equal(response.list.length , 3 , "Searched for keyword slow and found 3 nodes.");

                test3();

            });
        };

        var test3 = function() {
            // search #3 - find all nodes with the term: "jumped"

            this.branch.search("jumped", function(response) {

                equal(response.list.length , 8 , "Searched for keyword jumped and found 3 nodes.");

                setupHandler5();

            });
        };

        var setupHandler5 = function() {
            var _this = this;

            // associate all of these nodes
            //
            //   1 -> 2 (a:child with "tags" = "dizzy slash axl rose")
            //   1 -> 3 (a:child with "tags" = "kurt cobain david grohl")   + zebra
            //   1 -> 4 (a:child with "tags" = "eddie van halen")           + fox
            //   3 -> 5 (a:child with "tags" = "eric claptop joe satriani")
            //   3 -> 6 (a:child with "tags" = "rivers cuomo")               + under
            //   6 -> 7 (a:child with "tags" = "david gilmour roger waters")   + zebra
            //   7 -> 8 (a:child with "tags" = "robert plant jimmy page")

            var a1obj = { "_type": "a:child", "tags": "dizzy slash axl rose" };
            var a2obj = { "_type": "a:child", "tags": "kurt cobain david grohl zebra" };
            var a3obj = { "_type": "a:child", "tags": "eddie van halen fox" };
            var a4obj = { "_type": "a:child", "tags": "eric clapton joe satriani" };
            var a5obj = { "_type": "a:child", "tags": "rivers cuomo under" };
            var a6obj = { "_type": "a:child", "tags": "david gilmour roger waters zebra" };
            var a7obj = { "_type": "a:child", "tags": "robert plant jimmy page" };

            _this.node1.associate(_this.node2.getId(), a1obj, function(status) {

                _this.node1.associate(_this.node3.getId(), a2obj, function(status) {

                    _this.node1.associate(_this.node4.getId(), a3obj, function(status) {

                        _this.node3.associate(_this.node5.getId(), a4obj, function(status) {

                            _this.node3.associate(_this.node6.getId(), a5obj, function(status) {

                                _this.node6.associate(_this.node7.getId(), a6obj, function(status) {

                                    _this.node7.associate(_this.node8.getId(), a7obj, function(status) {

                                        // wait 8 seconds and then fire test 1
                                        // this provides enough time to ensure indexing
                                        setTimeout(test4, 3000);

                                    });
                                });
                            });
                        });
                    });
                });
            });
        };

        var test4 = function() {
            // search #4 - find all nodes with the term: "slash"

            this.branch.search("slash", function(response) {

                equal(response.list.length , 1 , "Searched for keyword slash and found 1 node.");

                test5();

            });
        };

        var test5 = function() {
            // search #5 - find all nodes with the term: "zebra"
            // this should now fix +1 since an association has it

            this.branch.search("fox", function(response) {

                equal(response.list.length , 6 , "Searched for keyword fox and found 6 nodes.");

                test6();

            });
        };

        var test6 = function() {
            // spatial search - 1 level depth, look for "under"
            // should not find

            // NOTE: this search is centered around node1

            var config = {
                "search": "under",
                "traverse": {
                    "depth": 1
                }
            };
            this.node1.search(config, function(response) {

                equal(response.list.length , 0 , "Searched for keyword under with 1-level depth and found 0 node.");

                test7();

            });
        };

        var test7 = function() {
            // spatial search - 2 level depth, look for "under"
            // should find 1 match on "rivers cuomo"
            // and 1 match for node 5

            var config = {
                "search": "under",
                "traverse": {
                    "depth": 2
                }
            };
            this.branch.search(config, function(response) {

                equal(response.list.length , 2 , "Searched for keyword under with 2-level depth and found 2 nodes.");

                success();

            });
        };

        var success = function() {
            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().create(setupHandler1);
        });
    });

}(jQuery) );
