(function($) {

    module("nodeauditrecords");

    // Test case : Node Audit Records
    test("Node Audit Records", function() {

        stop();

        expect(4);

        var driver = new Gitana.Driver();

        var _this = this;

        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().create(function(status) {
                driver.repositories().read(status.getId(), function(repository) {
                    _this.repository = repository;

                    repository.branches().read("master", function(branch) {
                        _this.branch = branch;

                        test1();
                    });
                });
            });
        });

        var test1 = function()
        {
            // create a node
            _this.branch.nodes().create(function(status) {
                _this.branch.nodes().read(status.getId(), function(node) {

                    // check audit records for node
                    node.auditRecords().list(function(response) {
                        ok(response.rows.length > 0);

                        var length1 = response.rows.length;

                        // update the node
                        node.update(function() {

                            // check audit records for node
                            node.auditRecords().list(function(response) {
                                ok(response.rows.length > length1);

                                var length2 = response.rows.length;

                                // read the node
                                node.reload(function () {

                                    // check audit records for node
                                    node.auditRecords().list(function(response) {
                                        ok(response.rows.length > length2);

                                        var length3 = response.rows.length;

                                        // delete the node
                                        node.del(function() {

                                            // check audit records for node
                                            node.auditRecords().list(function(response) {
                                                ok(response.rows.length > length3);

                                                success();
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

        var success = function() {
            start();
        };

    });

}(jQuery) );
