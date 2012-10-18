(function($) {

    module("nodeAuditRecords1");

    // Test case : Node Audit Records
    test("Node Audit Records", function() {

        stop();

        expect(4);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a node
            this.createNode().then(function() {

                // NOTE: this = node

                // count audit records
                var count1 = -1;
                this.listAuditRecords().count(function(count) {
                    ok(count > 0, "Audit Record Count > 0 on create");
                    count1 = count;
                });

                // and then...
                this.then(function() {

                    // update the node
                    this.update();

                    // count audit records
                    var count2 = -1;
                    this.listAuditRecords().count(function(count) {
                        ok(count > count1, "Audit Record Count increased on update");
                        count2 = count;
                    });

                    // and then...
                    this.then(function() {

                        // reload the node
                        this.reload();

                        // NOTE: we use another way to count here
                        // count audit records
                        var count3 = -1;
                        this.listAuditRecords().then(function() {
                            var count = this.__keys().length;
                            ok(count > count2, "Audit Record Count increased on read");
                            count3 = count;
                        });

                        // and then...
                        this.then(function() {

                            // delete the node
                            this.del();

                            // count audit records
                            this.listAuditRecords().count(function(count) {
                                ok (count > count3, "Audit Record Count increased on delete");
                            });

                            // flag success
                            this.then(function() {
                                success();
                            });
                        });
                    });
                });

            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
