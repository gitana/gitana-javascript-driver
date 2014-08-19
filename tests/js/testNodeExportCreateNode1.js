(function($) {

    module("nodeExportCreateNode1");

    // Test case : Node Export Create Node Test #1
    _asyncTest("Node Export Create Node #1", function()
    {
        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // 1. create a few nodes
            var branch = null;
            var nodes = null;
            this.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch
                branch = this;

                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });

                // query for the nodes
                this.queryNodes({
                    "tag": "abc"
                }).then(function() {
                    nodes = this;
                });
            });

            // 2. run the export
            var exportId = null;
            var status = null;
            this.then(function() {

                // NOTE: this = platform
                this.runExport(nodes, {
                    "package": "ZIP",
                    "zipUsePdfEntries": true
                }, function(_exportId, _status) {
                    exportId = _exportId;
                    status = _status;
                });

            });

            // 3. export to a content node
            this.then(function() {
                this.subchain(branch).then(function() {

                    var exportConfig = {
                        "properties": {
                            "title": "Hello World"
                        },
                        "extraInfo": {
                            "parentFolder": "/folder1/folder2"
                        }
                    };

                    this.createForExport(exportId, exportConfig, function(response) {
                        ok(response.rows.length == 1, "Rows size 1");
                        ok(response.rows[0].title == "Hello World", "Hello World created");
                    });

                });
            });

            this.then(function() {
                success();
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
