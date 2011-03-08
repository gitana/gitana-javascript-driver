var testTraversal = function()
{
    var driver = new Gitana.Driver();

    var setupHandler1 = function(status)
    {
        if (!status.isOk())
        {
            alert("Create failed");
        }

        // read the repository back
        driver.repositories().read(status.getId(), setupHandler2);
    };

    var setupHandler2 = function(repository)
    {
        var _this = this;

        this.repository = repository;

        // read the master branch
        this.repository.branches().read("master", function(branch) {

            _this.branch = branch;

            defineAssociation1();
        });
    };

    var defineAssociation1 = function()
    {
        // define a new association type
        var obj = {
            "_qname":"custom:is_related_to",
            "_type":"d:association",
            "type":"object",
            "description":"IS RELATED TO",
            "properties":{}
        };
        this.branch.nodes().create(obj, function(status) {

            defineAssociation2();

        });
    };

    var defineAssociation2 = function()
    {
        // define a new association type
        var obj = {
            "_qname":"custom:knows",
            "_type":"d:association",
            "type":"object",
            "description":"KNOWS",
            "properties":{}
        };
        this.branch.nodes().create(obj, function(status) {

            defineAssociation3();

        });
    };

    var defineAssociation3 = function()
    {
        // define a new association type
        var obj = {
            "_qname":"custom:has_viewed",
            "_type":"d:association",
            "type":"object",
            "description":"HAS READ",
            "properties":{}
        };
        this.branch.nodes().create(obj, function(status) {

            buildNodes();

        });
    };

    var doNodeCreate = function(callback)
    {
        var _this = this;

        this.branch.nodes().create(function(status) {

            _this.branch.nodes().read(status.getId(), function(node) {
                callback(node);
            });

        });

    };

    // build the nodes
    var buildNodes = function()
    {
        var _this = this;

        // create a bunch of nodes
        doNodeCreate(function(node) {
            _this.node1 = node;
            doNodeCreate(function(node) {
                _this.node2 = node;
                doNodeCreate(function(node) {
                    _this.node3 = node;
                    doNodeCreate(function(node) {
                        _this.node4 = node;
                        doNodeCreate(function(node) {
                            _this.node5 = node;
                            doNodeCreate(function(node) {
                                _this.node6 = node;
                                doNodeCreate(function(node) {
                                    _this.node7 = node;
                                    doNodeCreate(function(node) {
                                        _this.node8 = node;
                                        doNodeCreate(function(node) {
                                            _this.node9 = node;
                                            doNodeCreate(function(node) {
                                                _this.node10 = node;
                                                doNodeCreate(function(node) {
                                                    _this.node11 = node;
                                                    doNodeCreate(function(node) {
                                                        _this.node12 = node;
                                                        doNodeCreate(function(node) {
                                                            _this.node13 = node;
                                                            doNodeCreate(function(node) {
                                                                _this.node14 = node;
                                                                doNodeCreate(function(node) {
                                                                    _this.node15 = node;
                                                                    doNodeCreate(function(node) {
                                                                        _this.node16 = node;
                                                                        doNodeCreate(function(node) {
                                                                            _this.person1 = node;
                                                                            doNodeCreate(function(node) {
                                                                                _this.person2 = node;
                                                                                doNodeCreate(function(node) {
                                                                                    _this.person3 = node;
                                                                                    doNodeCreate(function(node) {
                                                                                        _this.person4 = node;

                                                                                        associateChildNodes();
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    };

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

    // connect all of the nodes together
    var associateChildNodes = function()
    {
        var _this = this;

        _this.node1.associate(_this.node2.getId(), "a:child", function(status) {
            _this.node1.associate(_this.node3.getId(), "a:child", function(status) {
                _this.node1.associate(_this.node4.getId(), "a:child", function(status) {
                    _this.node1.associate(_this.node5.getId(), "a:child", function(status) {
                        _this.node2.associate(_this.node6.getId(), "a:child", function(status) {
                            _this.node2.associate(_this.node7.getId(), "a:child", function(status) {
                                _this.node7.associate(_this.node15.getId(), "a:child", function(status) {
                                    _this.node15.associate(_this.node16.getId(), "a:child", function(status) {
                                        _this.node3.associate(_this.node8.getId(), "a:child", function(status) {
                                            _this.node8.associate(_this.node14.getId(), "a:child", function(status) {
                                                _this.node4.associate(_this.node9.getId(), "a:child", function(status) {
                                                    _this.node4.associate(_this.node10.getId(), "a:child", function(status) {
                                                        _this.node10.associate(_this.node11.getId(), "a:child", function(status) {
                                                            _this.node10.associate(_this.node12.getId(), "a:child", function(status) {
                                                                _this.node12.associate(_this.node13.getId(), "a:child", function(status) {

                                                                    associateKnowsGraph();

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
            })
        });
    };

    var associateKnowsGraph = function()
    {
        var _this = this;

        _this.person1.associate(_this.person2.getId(), "custom:knows", function(status) {
            _this.person2.associate(_this.person3.getId(), "custom:knows", function(status) {
                _this.person3.associate(_this.person4.getId(), "custom:knows", function(status) {
                    _this.person3.associate(_this.person2.getId(), "custom:knows", function(status) {
                        _this.person4.associate(_this.person1.getId(), "custom:knows", function(status) {

                            associateRelatedGraph();

                        });
                    });
                });
            });
        });
    };

    var associateRelatedGraph = function()
    {
        var _this = this;

        _this.node14.associate(_this.node6.getId(), "custom:is_related_to", function(status) {
            _this.node16.associate(_this.node13.getId(), "custom:is_related_to", function(status) {
                _this.node5.associate(_this.node11.getId(), "custom:is_related_to", function(status) {
                    _this.node9.associate(_this.node6.getId(), "custom:is_related_to", function(status) {

                        associateViewedGraph();

                    });
                });
            });
        });
    };

    var associateViewedGraph = function()
    {
        var _this = this;
        
        // person 1
        _this.person1.associate(_this.node6.getId(), "custom:has_viewed", function(status) {
            _this.person1.associate(_this.node16.getId(), "custom:has_viewed", function(status) {
                _this.person1.associate(_this.node14.getId(), "custom:has_viewed", function(status) {
                    _this.person1.associate(_this.node9.getId(), "custom:has_viewed", function(status) {
                        _this.person1.associate(_this.node11.getId(), "custom:has_viewed", function(status) {
                            _this.person1.associate(_this.node13.getId(), "custom:has_viewed", function(status) {
                                _this.person1.associate(_this.node5.getId(), "custom:has_viewed", function(status) {

                                    // person 2
                                    _this.person2.associate(_this.node6.getId(), "custom:has_viewed", function(status) {
                                        _this.person2.associate(_this.node9.getId(), "custom:has_viewed", function(status) {
                                            _this.person2.associate(_this.node13.getId(), "custom:has_viewed", function(status) {
                                                _this.person2.associate(_this.node5.getId(), "custom:has_viewed", function(status) {

                                                    // person 3
                                                    _this.person3.associate(_this.node6.getId(), "custom:has_viewed", function(status) {
                                                        _this.person3.associate(_this.node16.getId(), "custom:has_viewed", function(status) {
                                                            _this.person3.associate(_this.node14.getId(), "custom:has_viewed", function(status) {
                                                                _this.person3.associate(_this.node13.getId(), "custom:has_viewed", function(status) {

                                                                    // person 4
                                                                    _this.person4.associate(_this.node6.getId(), "custom:has_viewed", function(status) {
                                                                        _this.person4.associate(_this.node9.getId(), "custom:has_viewed", function(status) {
                                                                            _this.person4.associate(_this.node5.getId(), "custom:has_viewed", function(status) {

                                                                                test1();

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
            });
        });

    };

    var test1 = function()
    {
        // traverse from node 1
        // depth: 1
        // type: a:child

        var callback = function(response)
        {
            var nodes = response.nodes;
            if (!nodes.length == 4)
            {
                alert("N1 have been size 4");
            }

            var associations = response.associations;
            if (!associations.length == 4)
            {
                alert("A1 should have been size 4");
            }

            test2();
        };

        var config = {
            "associations": {
                "a:child": "BOTH"
            },
            "depth": 1
        };

        this.node1.traverse(config, callback);
    };

    var test2 = function()
    {
        var callback = function(response)
        {
            var nodes = response.nodes;
            if (!nodes.length == 13)
            {
                alert("N2 have been size 13");
            }

            var associations = response.associations;
            if (!associations.length == 13)
            {
                alert("A2 should have been size 13");
            }

            test3();
        };

        var config = {
            "associations": {
                "a:child": "BOTH"
            },
            "depth": 3
        };

        // traverse from node 1
        this.node1.traverse(config, callback);
    };

    var test3 = function()
    {
        var _this = this;

        var callback = function(response)
        {
            var nodes = response.nodes;
            if (!nodes.length == 7)
            {
                alert("N3 have been size 7");
            }

            var associations = response.associations;
            if (!associations.length == 7)
            {
                alert("A3 should have been size 7");
            }

            // ensure we have four people
            if (!nodes[_this.person1.getId()])
            {
                alert("Lookup3 fail: person1");
            }
            if (!nodes[_this.person2.getId()])
            {
                alert("Lookup3 fail: person2");
            }
            if (!nodes[_this.person3.getId()])
            {
                alert("Lookup3 fail: person3");
            }
            if (!nodes[_this.person4.getId()])
            {
                alert("Lookup3 fail: person4");
            }

            // check nodes
            if (!nodes[_this.node2.getId()])
            {
                alert("Lookup3 fail: node2");
            }
            if (!nodes[_this.node14.getId()])
            {
                alert("Lookup3 fail: node14");
            }
            if (!nodes[_this.node9.getId()])
            {
                alert("Lookup3 fail: node9");
            }

            test4();
        };

        var config = {
            "depth": 1
        };

        // find everything of depth 1 away from node 6
        this.node6.traverse(config, callback);
    };

    var test4 = function()
    {
        var _this = this;

        var callback = function(response)
        {
            var nodes = response.nodes;
            alert("Found: " + nodes.length + " nodes!");

            success();
        };

        var config = {
        };

        // find everything around node6
        // gather everything to every depth
        this.node6.traverse(config, callback);
    };

    var success = function()
    {
        alert("success");
    };

    // kick off the test after logging in
    driver.security().authenticate("admin", "admin", function() {
        driver.repositories().create(setupHandler1);
    });

};
