import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeExportDownloadPDF1", function() {

    it("Node Export Download PDF #1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                // 1. create a few nodes
                var nodes = null;
                this.createRepository().readBranch("master").then(function() {

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
                        nodes = this;
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
                        t.assert.ok(status.fileCount > 0, "Found exported files");
                    });
                });

                // 3. download (faked)
                this.then(function() {
                    var downloadUrl = this.exportDownloadUrl(exportId, null, true);
                    t.assert.ok(downloadUrl, "Found download URL");
                    console.log(downloadUrl);

                    success();
                });
            });

            var success = function()
            {
                start();
            };
        });
    });
});
