(function($) {

    module("log1");

    // Test case : Log operations.
    test("Log Operations", function() {
        stop();

        expect(3);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            var serverTotalRows = -1;
            this.queryLogEntries().totalRows(function(totalRows) {
                serverTotalRows = totalRows;
            });

            this.createRepository().then(function() {

                // NOTE: this = repository

                var repositoryTotalRows = -1;
                this.queryLogEntries().totalRows(function(totalRows) {
                    repositoryTotalRows = totalRows;
                });

                this.readBranch("master").then(function() {

                    // NOTE: this = branch

                    var branchTotalRows = -1;
                    this.queryLogEntries().totalRows(function(totalRows) {
                        branchTotalRows = totalRows;
                    });

                    this.then(function() {

                        // create a script node that just logs
                        var scriptNode = null;
                        this.createNode().then(function() {

                            // NOTE: this = script node
                            scriptNode = this;

                            this.attach("default", "application/javascript", "function afterUpdateNode(node, originalNode) { logger.debug('log function hit'); }");
                        });

                        // create a content node
                        this.createNode().then(function() {

                            // bind the script as a behavior (p:afterUpdateNode)
                            this.associate(scriptNode, {
                                "_type": "a:has_behavior",
                                "policy": "p:afterUpdateNode",
                                "scope": 0
                            }, false);

                            // update the node
                            this.update();
                        });

                        // verify that log entries for the branch have increased by 1
                        this.queryLogEntries().totalRows(function(totalRows) {
                            equal(branchTotalRows + 1, totalRows, "Branch log total rows increased by 1");
                        });
                    });
                });

                // verify that the log entries from the repository have increased by 1
                this.queryLogEntries().totalRows(function(totalRows) {
                    equal(repositoryTotalRows + 1, totalRows, "Repository log total rows increased by 1");
                });
            });

            // verify that the log entries from the server have increased by 1 or more
            this.queryLogEntries().totalRows(function(totalRows) {
                ok(totalRows >= serverTotalRows + 1, "Server log total rows increased by at least 1");

                success();
            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
