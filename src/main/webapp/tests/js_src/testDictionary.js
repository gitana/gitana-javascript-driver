(function($) {

    module("dictionary");

    // Test case : Dictionary operations.
    test("Dictionary operations", function() {
        stop();

        expect(5);

        var driver = new Gitana.Driver();

        var setupHandler1 = function(status) {
            ok(status.isOk(), "Create repository succeed.")

            // read the repository back
            driver.repositories().read(status.getId(), setupHandler2);
        };

        var setupHandler2 = function(repository) {
            var _this = this;

            this.repository = repository;

            // read the master branch
            this.repository.branches().read("master", function(branch) {

                _this.branch = branch;

                test1();
            });
        };

        var test1 = function() {
            var _this = this;

            // list all
            _this.branch.definitions().list(function(response) {

                ok(response.list.length>0, "Found: " + response.list.length + " definitions");

                // list types
                _this.branch.definitions().list("type", function(response) {

                    ok(response.list.length>0, "Found: " + response.list.length + " type definitions");

                    // list associations
                    _this.branch.definitions().list("association", function(response) {

                        ok(response.list.length>0, "Found: " + response.list.length + " association definitions");

                        _this.branch.definitions().list("feature", function(response) {

                            ok(response.list.length>0, "Found: " + response.list.length + " feature definitions");

                            success();
                        });

                    });

                });

            });
        };


        var success = function() {
            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().create(setupHandler1);
        });

    });

}(jQuery) );
