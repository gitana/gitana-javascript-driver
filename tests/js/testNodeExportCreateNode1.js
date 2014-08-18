(function($) {

    module("nodeExportCreateNode1");

    // Test case : Node Export Create Node Test #1
    _asyncTest("Node Export Create Node #1", function()
    {
        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch
            var branch = this;

            // create a few nodes
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

            // now query back
            this.queryNodes({
                "tag": "abc"
            }).then(function() {

                // export the nodes
                var exportId = null;
                this.startExport({
                    "package": "ZIP",
                    "zipUsePdfEntries": true

                }, function(_exportId) {
                    exportId = _exportId;
                });

                // wait for export to complete
                var status = null;
                this.then(function() {
                    this.waitForExport(exportId, function(_status) {
                        status = _status;
                    });
                });

                // export to a content node
                this.then(function() {

                    var exportConfig = {
                        "properties": {
                            "title": "Hello World"
                        },
                        "extraInfo": {
                            "parentFolder": "/folder1/folder2"
                        }
                    };

                    this.exportCreateNode(exportId, exportConfig, function(response) {
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
