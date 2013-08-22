(function() {

    module("projectCopy1");

    // Test case : Project Copy #1
    test("Project Copy #1", function()
    {
        stop();

        expect(2);

        GitanaTest.authenticateNewTenant(function() {

            // NOTE: this = platform
            var platform = this;

            // create a project and copy it
            var newProjectId = null;
            this.createProject().then(function() {

                // THIS = project

                // read the stack repository
                var repository = null;
                this.readStack().readDataStore("content", function() {
                    repository = this;
                });

                this.then(function() {

                    // THIS = project

                    // create some content
                    this.subchain(repository).readBranch("master").then(function() {

                        // create some content
                        this.createNode({
                            "title": "First Node"
                        });
                        this.createNode({
                            "title": "Second Node"
                        });
                    });
                });

                this.then(function() {

                    // THIS = project

                    this.copy(platform).then(function() {
                        newProjectId = this.getSingleImportTargetId();
                    });
                });
            });

            this.then(function() {

                // THIS = platform

                // read back the copied project repository
                this.readProject(newProjectId).then(function() {

                    this.readStack().readDataStore("content", function() {

                        Chain(this).readBranch("master").then(function() {

                            // read back content
                            this.queryOne({"title": "First Node"}).then(function() {
                                ok(true, "Found first node");
                            });
                            this.queryOne({"title": "Second Node"}).then(function() {
                                ok(true, "Found second node");
                            });

                            this.then(function() {
                                start();
                            });

                        });
                    });
                });
            });
        });
    });

}());
