(function($) {

    module("job1");

    // Test case : Job operations.
    _asyncTest("Job Operations", function()
    {
        expect(8);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            this.readCluster().then(function()
            {
                // NOTE: this = cluster

                // here we just do some calls to verify there aren't any JS issues
                this.queryUnstartedJobs().count(function(count) {
                    ok(true, "Unstarted Jobs query successful");
                });
                this.queryFailedJobs().count(function(count) {
                    ok(true, "Failed Jobs query successful");
                });
                this.queryWaitingJobs().count(function(count) {
                    ok(true, "Waiting Jobs query successful");
                });
                this.queryRunningJobs().count(function(count) {
                    ok(true, "Running Jobs query successful");
                });
            });

            // do some counts
            var finishedTotalRows = -1;
            var allTotalRows = -1;
            this.readCluster().then(function() {

                // NOTE: this = cluster

                // finished jobs
                this.queryFinishedJobs().then(function() {
                    ok(true, "Finished Jobs query successful");
                    finishedTotalRows = this.totalRows();
                });

                // all jobs
                this.queryJobs().then(function() {
                    ok(true, "All Jobs query successful");
                    allTotalRows = this.totalRows();
                });
            });

            // trigger a job to be created
            this.then(function()
            {
                // create repository + a node with an attachment
                this.createRepository().readBranch("master").then(function() {

                    // NOTE: this = branch

                    // create a node with an attachment so that we have at least 1 job
                    this.createNode().then(function() {

                        this.attach("default", "text/plain", "anything at all");

                    });
                });
            });

            // verify job counts
            this.readCluster().then(function() {

                // verify allCount + 1
                this.queryJobs().then(function() {
                    equal(this.totalRows(), allTotalRows + 1, "All job count increased by 1");
                });

                this.then(function() {

                    // wait a little while for the job to finish
                    this.wait(6000);

                    // verify finishedCount + 1
                    this.queryFinishedJobs().then(function() {
                        equal(this.totalRows(), finishedTotalRows + 1, "Finished job count increased by 1");

                        success();
                    });
                });
            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
