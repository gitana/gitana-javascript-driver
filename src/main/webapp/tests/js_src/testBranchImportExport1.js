(function($) {

    module("branchImportExport1");

    // Test case : Branch Import and Export 1
    test("Branch Import and Export 1", function()
    {
        stop();

        expect(5);

        // FOR NOW, bail on this
        start();


        /*

        var test = this;

        var gitana = GitanaTest.authenticate("admin", "admin");;
        gitana.createRepository().then(function() {

            // NOTE: this = repository

            var master = null;

            this.readBranch("master").then(function() {

                // NOTE: this = branch
                master = this;

                // create a few nodes
                this.createNode({"smoke": "on the water"});
                this.createNode({"so": "far from the clyde"});
                this.createNode({"comfortably": "numb"});
                this.createNode({"axl": "rose"});
                this.createNode({"slipped": "away"});
                this.createNode({"autumn": "years"});
                this.createNode({"hazel": "smoke"});
                this.createNode({"remembrance": "day"});

                // export the branch
                this.exportPublicationArchive("default", "testgroup", "testarchive", "0.1").then(function() {

                    // NOTE: this = job

                    ok(this.getState() == "FINISHED", "Export finished");
                    ok(this.getState() != "ERROR", "Export completed without error");
                });
            });

            this.then(function() {

                // NOTE: this = repository

                // create a new branch
                this.createBranch(master.getTip()).then(function() {

                    // NOTE: this = branch

                    this.importPublicationArchive("default", "testgroup", "testarchive", "0.1").then(function() {

                        // NOTE: this = job

                        ok(this.getState() == "FINISHED", "Import finished");
                        ok(this.getState() != "ERROR", "Import completed without error");

                    });

                    this.then(function() {

                        // NOTE: this = branch

                        // query nodes to verify
                        this.queryNodes({"comfortably":"numb"}).count(function(count) {
                            equal(1, count, "Found count of 1");
                        });
                    });
                });
            });

            this.then(function() {
                success();
            });

        });

        var success = function()
        {
            start();
        };
        */



    });

}(jQuery) );
