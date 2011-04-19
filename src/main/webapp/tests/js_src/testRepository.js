(function($) {

    module("repository");

    // Test case : Repository operations.
    test("Repository operations", function() {
        stop();

        expect(3);

        var driver = new Gitana.Driver();

        var repositoryId = null;

        var createHandler = function(status) {
            ok(status.isOk(), "Create repository succeed.")

            repositoryId = status.getId();

            // read the repository
            driver.repositories().read(repositoryId, readHandler);
        };

        var readHandler = function(repository) {
            // update the repository
            repository.update(updateHandler);
        };

        var updateHandler = function(status) {
            ok(status.isOk(), "Update repository succeed.")

            // delete the repo
            driver.repositories().del(repositoryId, deleteHandler);
        };

        var deleteHandler = function(status) {
            ok(status.isOk(), "Delete repository succeed.")

            // call list repositories for fun
            driver.repositories().list(listHandler);
        };

        var listHandler = function(response) {
            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().create(createHandler);
        });

    });

}(jQuery) );
