(function($) {

    module("branch");

    // Test case : Branch operations.
    test("Branch operations", function() {
        stop();

        expect(5);

        var driver = new Gitana.Driver();

        var repositoryId = null;
        var repository = null;

        var setupHandler1 = function(status) {
            ok(status.isOk(), "Create repository succeed.");

            repositoryId = status.getId();

            // read the repository back
            driver.repositories().read(repositoryId, setupHandler2);
        };

        var setupHandler2 = function(repository) {
            var _this = this;

            this.repository = repository;

            // read the master branch
            this.repository.branches().read("master", function(master) {
                ok(master.isMaster(), "Master branch not identified as master.");

                // create a branch
                _this.repository.branches().create("0:root", createHandler);
            });
        };

        var createHandler = function(status) {
            ok(status.isOk(), "Create branch succeed.");

            var branchId = status.getId();

            // read the branch
            this.repository.branches().read(branchId, readHandler);
        };

        var readHandler = function(branch) {
            var branchId = branch["_doc"];

            // update the branch
            branch["description"] = "illimani";
            branch.update(updateHandler);
        };

        var updateHandler = function(status) {
            ok(status.isOk(), "Update branch succeed.");

            // list the branches
            this.repository.branches().list(shutdownHandler);
        };

        var shutdownHandler = function() {
            // delete repository
            this.repository.del(shutdown2Handler);
        };

        var shutdown2Handler = function(status) {
            ok(status.isOk(), "Delete branch succeed.");

            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().create(setupHandler1);
        });

    });

}(jQuery) );
