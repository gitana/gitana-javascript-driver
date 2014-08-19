(function($) {

    module("nodeExportDownloadPDF2");

    // Test case : Node Export Download PDF Test #2
    _asyncTest("Node Export Download PDF #2", function()
    {
        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // 1. create a few nodes
            var nodes = [];
            this.createRepository().readBranch("master").then(function() {

                this.createNode({
                    "tag": "abc"
                }).then(function() {
                    nodes.push(this);
                });

                this.createNode({
                    "tag": "abc"
                }).then(function() {
                    nodes.push(this);
                });

                this.createNode({
                    "tag": "abc"
                }).then(function() {
                    nodes.push(this);
                });

            });

            // 2. export the nodes
            var exportId = null;
            var status = null;
            this.then(function() {

                this.runExport(nodes, {
                    "package": "PDF",
                    "mergePdfs": true,
                    "includeMetadata": true,
                    "includeAttachments": true
                }, function(_exportId, _status) {
                    exportId = exportId;
                    status = _status;
                    ok(status.fileCount > 0, "Found exported files");
                });
            });

            // 3. download (faked)
            this.then(function() {
                var downloadUrl = this.exportDownloadUrl(exportId, null, true);
                ok(downloadUrl, "Found download URL");
                console.log(downloadUrl);

                success();
            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
