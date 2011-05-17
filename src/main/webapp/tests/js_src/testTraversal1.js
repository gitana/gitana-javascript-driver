(function($) {

    module("traversal1");

    // Test case : Traversal operations.
    test("Traversal operations", function() {
        stop();

        expect(17);

        var test = this;

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // define a new association type
            var obj1 = {
                "_qname":"custom:is_related_to",
                "_type":"d:association",
                "type":"object",
                "description":"IS RELATED TO",
                "properties":{}
            };
            this.createNode(obj1);

            // define a new association type
            var obj2 = {
                "_qname":"custom:knows",
                "_type":"d:association",
                "type":"object",
                "description":"KNOWS",
                "properties":{}
            };
            this.createNode(obj2);

            // define a new association type
            var obj3 = {
                "_qname":"custom:has_viewed",
                "_type":"d:association",
                "type":"object",
                "description":"HAS READ",
                "properties":{}
            };
            this.createNode(obj3);


            // create 16 simulated "content" nodes
            this.createNode().then(function() {
                test.node1 = this;
            });
            this.createNode().then(function() {
                test.node2 = this;
            });
            this.createNode().then(function() {
                test.node3 = this;
            });
            this.createNode().then(function() {
                test.node4 = this;
            });
            this.createNode().then(function() {
                test.node5 = this;
            });
            this.createNode().then(function() {
                test.node6 = this;
            });
            this.createNode().then(function() {
                test.node7 = this;
            });
            this.createNode().then(function() {
                test.node8 = this;
            });
            this.createNode().then(function() {
                test.node9 = this;
            });
            this.createNode().then(function() {
                test.node10 = this;
            });
            this.createNode().then(function() {
                test.node11 = this;
            });
            this.createNode().then(function() {
                test.node12 = this;
            });
            this.createNode().then(function() {
                test.node13 = this;
            });
            this.createNode().then(function() {
                test.node14 = this;
            });
            this.createNode().then(function() {
                test.node15 = this;
            });
            this.createNode().then(function() {
                test.node16 = this;
            });

            // create 4 simulated "person" nodes
            this.createNode().then(function() {
                test.person1 = this;
            });
            this.createNode().then(function() {
                test.person2 = this;
            });
            this.createNode().then(function() {
                test.person3 = this;
            });
            this.createNode().then(function() {
                test.person4 = this;
            });


            this.then(function() {

                // associations
                /**
                 * a:child graph looks like:
                 *
                 *  node1
                 *      node2
                 *          node6
                 *          node7
                 *              node15
                 *                  node16
                 *      node3
                 *          node8
                 *              node14
                 *      node4
                 *          node9
                 *          node10
                 *              node11
                 *              node12
                 *                  node13
                 *      node5
                 *
                 *
                 * custom:knows graph looks like:
                 *
                 * person1 -> person2
                 * person2 -> person3
                 * person3 -> person4
                 * person3 -> person2
                 * person4 -> person1
                 *
                 *
                 * custom:is_related_to graph looks like:
                 *
                 * node14 -> node6
                 * node16 -> node13
                 * node5 -> node11
                 * node9 -> node6
                 *
                 *
                 * custom:has_viewed graph looks like:
                 *
                 * person1 -> node6
                 * person1 -> node16
                 * person1 -> node14
                 * person1 -> node9
                 * person1 -> node11
                 * person1 -> node13
                 * person1 -> node5
                 *
                 * person2 -> node6
                 * person2 -> node9
                 * person2 -> node13
                 * person2 -> node5
                 *
                 * person3 -> node6
                 * person3 -> node16
                 * person3 -> node14
                 * person3 -> node13
                 *
                 * person4 -> node6
                 * person4 -> node9
                 * person4 -> node5
                 */

                // a:child
                this.associate(test.node1, test.node2, "a:child");
                this.associate(test.node1, test.node3, "a:child");
                this.associate(test.node1, test.node4, "a:child");
                this.associate(test.node1, test.node5, "a:child");
                this.associate(test.node2, test.node6, "a:child");
                this.associate(test.node2, test.node7, "a:child");
                this.associate(test.node7, test.node15, "a:child");
                this.associate(test.node15, test.node16, "a:child");
                this.associate(test.node3, test.node8, "a:child");
                this.associate(test.node8, test.node14, "a:child");
                this.associate(test.node4, test.node9, "a:child");
                this.associate(test.node4, test.node10, "a:child");
                this.associate(test.node10, test.node11, "a:child");
                this.associate(test.node10, test.node12, "a:child");
                this.associate(test.node12, test.node13, "a:child");

                // custom:knows
                this.associate(test.person1, test.person2, "custom:knows");
                this.associate(test.person2, test.person3, "custom:knows");
                this.associate(test.person3, test.person4, "custom:knows");
                this.associate(test.person3, test.person2, "custom:knows");
                this.associate(test.person4, test.person1, "custom:knows");

                // custom:is_related_to
                this.associate(test.node14, test.node6, "custom:is_related_to");
                this.associate(test.node16, test.node13, "custom:is_related_to");
                this.associate(test.node5, test.node11, "custom:is_related_to");
                this.associate(test.node9, test.node6, "custom:is_related_to");

                // custom:has_viewed
                this.associate(test.person1, test.node6, "custom:has_viewed");
                this.associate(test.person1, test.node16, "custom:has_viewed");
                this.associate(test.person1, test.node14, "custom:has_viewed");
                this.associate(test.person1, test.node9, "custom:has_viewed");
                this.associate(test.person1, test.node11, "custom:has_viewed");
                this.associate(test.person1, test.node13, "custom:has_viewed");
                this.associate(test.person1, test.node5, "custom:has_viewed");
                this.associate(test.person2, test.node6, "custom:has_viewed");
                this.associate(test.person2, test.node9, "custom:has_viewed");
                this.associate(test.person2, test.node13, "custom:has_viewed");
                this.associate(test.person2, test.node5, "custom:has_viewed");
                this.associate(test.person3, test.node6, "custom:has_viewed");
                this.associate(test.person3, test.node16, "custom:has_viewed");
                this.associate(test.person3, test.node14, "custom:has_viewed");
                this.associate(test.person3, test.node13, "custom:has_viewed");
                this.associate(test.person4, test.node6, "custom:has_viewed");
                this.associate(test.person4, test.node9, "custom:has_viewed");
                this.associate(test.person4, test.node5, "custom:has_viewed");


                // test #1
                // traverse from node 1
                // depth: 1
                // type/direction: a:child/BOTH
                var config1 = {
                    "associations": {
                        "a:child": "BOTH"
                    },
                    "depth": 1
                };
                this.traverse(test.node1, config1).nodeCount(function(count) {
                    equal(count, 4, "N1 is size 4");
                }).associationCount(function(count) {
                    equal(count, 4, "A1 is size 4");
                }).then(function() {

                    // NOTE: this = traversal results

                    this.nodes().count(function(count) {
                        equal(count, 4, "N1 - nodes() size 4");
                    });
                    this.associations().count(function(count) {
                        equal(count, 4, "A1 - associations() size 4");
                    });

                });


                // test #2
                // traverse from node 1
                // depth 3
                // type: a:child/BOTH
                var config2 = {
                    "associations": {
                        "a:child": "BOTH"
                    },
                    "depth": 3
                };
                this.traverse(test.node1, config2).nodeCount(function(count) {
                    equal(count, 13, "N2 is size 13");
                }).associationCount(function(count) {
                    equal(count, 13, "A2 is size 13");
                });


                // test #3
                // traverse from node 6
                // depth 1
                var config3 = {
                    "depth": 1
                };
                this.traverse(test.node6, config3).then(function() {

                    this.nodeCount(function(count) {
                        equal(count, 8, "N3 is size 8");
                    });

                    this.associationCount(function(count) {
                        equal(count, 8, "A3 is size 8");
                    });

                    // ensure we have four people
                    this.node(test.person1.getId()).then(function() {
                        ok(true, "Lookup3 found person1");
                    });
                    this.node(test.person2.getId()).then(function() {
                        ok(true, "Lookup3 found person2");
                    });
                    this.node(test.person3.getId()).then(function() {
                        ok(true, "Lookup3 found person3");
                    });
                    this.node(test.person4.getId()).then(function() {
                        ok(true, "Lookup3 found person4");
                    });

                    // ensure we have three content nodes
                    this.node(test.node2.getId()).then(function() {
                        ok(true, "Lookup3 found node2");
                    });
                    this.node(test.node14.getId()).then(function() {
                        ok(true, "Lookup3 found node14");
                    });
                    this.node(test.node9.getId()).then(function() {
                        ok(true, "Lookup3 found node9");
                    });
                });


                // test #4
                // traverse everything from node 6
                // unlimited depth
                var config4 = {
                };
                this.traverse(test.node6, config4).nodeCount(function(count) {
                    equal(count, 24, "N4 is size 24");
                }).associationCount(function(count) {
                    equal(count, 24, "A4 is size 24");
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

}(jQuery));
