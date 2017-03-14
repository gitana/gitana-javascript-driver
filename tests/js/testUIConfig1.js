(function($) {

    module("uiConfig1");

    // Test case : UI Config 1
    _asyncTest("UI Config 1", function()
    {
        expect(5);

        GitanaTest.authenticateNewTenant(function() {

            // NOTE: this = platform

            var project = null;
            var uiConfig1 = null;
            var uiConfig2 = null;
            var uiConfig3 = null;
            var uiConfig4 = null;

            // create a project
            var project = null;
            this.createProject().then(function() {
                project = this;
            });
            var totalConfigCount = 0;
            var projectConfigCount = 0;
            this.then(function() {
                // query for ui configs (should be 4)
                this.queryUIConfigs({}).count(function(c) {
                    totalConfigCount = c;
                });
                this.queryUIConfigs({
                    "projectId": project._doc
                }).count(function(c) {
                    projectConfigCount = c;
                });
            });
            this.then(function() {

                // create three configs scoped to project
                this.createUIConfig({
                    "projectId": project._doc
                }).then(function() {
                    uiConfig1 = this;
                });
                this.createUIConfig({
                    "projectId": project._doc
                }).then(function() {
                    uiConfig2 = this;
                });
                this.createUIConfig({
                    "projectId": project._doc
                }).then(function() {
                    uiConfig3 = this;
                });

                // create one empty config
                this.createUIConfig().then(function() {
                    uiConfig4 = this;
                });

            });

            this.then(function() {

                // query for ui configs (should be 4)
                this.queryUIConfigs({}).count(function(c) {
                    equal(c, totalConfigCount + 4, "Found 4 configs total");
                });

                // query for ui configs scoped to project (should be 3)
                this.queryUIConfigs({
                    "projectId": project._doc
                }).count(function(c) {
                    equal(c, projectConfigCount + 3, "Found 3 configs scoped to project")
                });

                // delete one of the configs
                this.subchain(uiConfig1).del().then(function() {
                    // done
                });

                // query for ui configs scoped to project (should be 2)
                this.queryUIConfigs({
                    "projectId": project._doc
                }).count(function(c) {
                    equal(c, projectConfigCount + 2, "Found 2 configs scoped to project after manual delete")
                });

                // delete the project
                this.subchain(project).del().then(function() {
                    // done
                });

                this.then(function() {

                    // query for ui configs scoped to project (should be 0 after delete)
                    this.queryUIConfigs({
                        "projectId": project._doc
                    }).count(function(c) {
                        equal(c, projectConfigCount, "Found 0 configs scoped to project after project delete");
                    });

                    // query for ui configs (should be 1)
                    this.queryUIConfigs({}).count(function(c) {
                        equal(c, totalConfigCount + 1, "Found 1 config total");
                    });
                });

                this.then(function() {
                    success();
                });
            });

        });

        var success = function()
        {
            start();
        };

    });

}() );
