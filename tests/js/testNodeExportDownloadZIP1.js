(function($) {

    module("nodeExportDownloadZIP1");

    // Test case : Node Export Download ZIP Test #1
    _asyncTest("Node Export Download ZIP #1", function()
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
                    "zipUsePdfEntries": true,
                    "includeMetadata": true,
                    "includeAttachments": false
                }, function(_exportId) {
                    exportId = _exportId;
                });

                // wait for the export to complete
                this.then(function() {
                    this.waitForExport(exportId, function(exportId, status) {
                        ok(status.fileCount > 0, "Found exported files");
                    });
                });

                this.then(function() {
                    var downloadUrl = this.exportDownloadUrl(exportId, null, true);
                    ok(downloadUrl, "Found download URL");
                    console.log(downloadUrl);

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
