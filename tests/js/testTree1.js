(function($) {

    module("tree1");

    // Test case : Tree Test #1
    _asyncTest("Tree #1", function()
    {
        expect(3);

        var createFolder = function(branch, parentFolderPath, title, callback)
        {
            Chain(branch).createNode({
                "title": title
            }, {
                "folderPath": parentFolderPath
            }).then(function() {
                callback();
            });
        };

        var defineArticleType = function(branch, callback)
        {
            Chain(branch).createNode({
                "_type": "d:type",
                "_qname": "my:article",
                "title": "My Article",
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "published": {
                        "type": "boolean"
                    }
                }
            }).then(function() {
                callback();
            });
        };

        var createArticle = function(branch, parentFolderPath, title, category, published, text, callback)
        {
            var o = {
                "_type": "my:article",
                "title": title,
                "category": category
            };

            if (published) {
                o.published = published;
            }

            if (text) {
                o.text = text;
            }

            Chain(branch).createNode(o, {
                "folderPath": parentFolderPath
            }).then(function() {
                callback();
            });
        };

        var countArticles = function(obj)
        {
            var count = 0;

            var type = obj["typeQName"];
            if ("my:article" === type)
            {
                count++;
            }

            var children = obj["children"];
            if (children)
            {
                for (var i = 0; i < children.length; i++)
                {
                    count += countArticles(children[i]);
                }
            }

            return count;
        };

        var loadTree = function(rootNode, depth, query, search, callback) {

            var o = {
                "properties": true,
                "depth": -1
            };
            if (depth) {
                o.depth = depth;
            }
            if (query) {
                o.query = query;
            }
            if (search) {
                o.search = search;
            }

            Chain(rootNode).loadTree(o, function(tree) {
                callback(tree);
            });
        };

        var runTests = function(branch, rootNode, callback)
        {
            // find all articles (should be 6)
            loadTree(rootNode, 3, { "_type": "my:article" }, null, function(tree) {
                equal(countArticles(tree), 6, "Should find 6 articles");

                // find published articles (should be 2)
                loadTree(rootNode, 3, { "published": true, "_type": "my:article" }, null, function(tree) {
                    equal(countArticles(tree), 2, "Should find 2 published articles");

                    // find published articles with text "brewers" (should be 1)
                    loadTree(rootNode, 3, { "published": true, "_type": "my:article" }, { "query_string": { "query": "brewers" }}, function(tree) {
                        equal(countArticles(tree), 1, "Should find 1 published article for 'brewers'");

                        callback();
                    });
                });
            });
        };

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            this.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch
                var branch = this;

                createFolder(branch, "/", "folder1", function() {
                    createFolder(branch, "/folder1", "folder11", function () {
                        createFolder(branch, "/folder1", "folder12", function () {
                            defineArticleType(branch, function() {
                                createArticle(branch, "/folder1/folder11", "Article 1", "red", false, null, function() {
                                    createArticle(branch, "/folder1/folder11", "Article 2", "blue", false, null, function() {
                                        createArticle(branch, "/folder1/folder11", "Article 3", "green", true, null, function() {
                                            createArticle(branch, "/folder1/folder12", "Article 4", "red", false, null, function() {
                                                createArticle(branch, "/folder1/folder12", "Article 5", "red", false, null, function() {
                                                    createArticle(branch, "/folder1/folder12", "Article 6", "green", true, "brewers", function() {

                                                        branch.rootNode().then(function() {
                                                            var rootNode = this;

                                                            // wait a bit to allow indexing
                                                            setTimeout(function() {

                                                                // now run the actual tests
                                                                runTests(branch, rootNode, function() {
                                                                    success();
                                                                });

                                                            }, 5000);
                                                        })
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

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
