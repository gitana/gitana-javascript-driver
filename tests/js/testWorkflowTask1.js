(function($) {

    module("workflowTask1");

    // Test case : Workflow Task 1
    _asyncTest("Workflow Task 1", function()
    {
        expect(3);

        var modelId = "simple-" + new Date().getTime();

        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            // create domain and user
            var domainQualifiedPrincipalId = null;
            this.createDomain().createUser({
                "name": "test123"
            }).then(function() {
                domainQualifiedPrincipalId = this.getDomainId() + "/" + this.getId();
            });

            // a simple workflow model
            var workflowModelObject = {
                "title": "Simple Workflow Model",
                "description": "Simple Workflow Description",
                "nodes": {
                    "start": {
                        "type": "start",
                        "transitions": {
                            "start": "node1"
                        }
                    },
                    "node1": {
                        "type": "participant",
                        "title": "Step One",
                        "description": "Step One Description",
                        "principals": ["default/admin"],
                        "transitions": {
                            "approve": "end",
                            "reject": "end"
                        }
                    },
                    "end": {
                        "type": "end"
                    }
                }
            };

            // create a workflow model
            this.createWorkflowModel(modelId, workflowModelObject).then(function() {

                // deploy the model
                this.deploy();
            });

            // list tasks
            var count1 = null;
            this.listTasksForCurrentUser(null, {
                "limit": -1
            }).count(function(count) {
                count1 = count;
            });

            this.then(function() {

                // create a workflow and start it
                this.createWorkflow(modelId).then(function() {
                    this.start();
                });

                // list tasks for a made-up assignee (should be 0)
                this.listTasksForAssignee(domainQualifiedPrincipalId, null, {
                    "limit": -1
                }).count(function(count) {
                    ok(count == 0, "Made up count is zero");
                });

                // list tasks for "admin" assignee (should be greater than 0)
                this.listTasksForAssignee("default/admin", null, {
                    "limit": -1
                }).count(function(count) {
                    ok(count > 0, "Admin count is greater than zero");
                });

                this.then(function() {

                    // login as admin
                    GitanaTest.authenticate("admin", "admin").then(function() {

                        // list tasks for current user ("admin")
                        this.listTasksForCurrentUser(null, {
                            "limit": -1
                        }).count(function(count) {
                                ok(count == count1 + 1, "Count went up by 1");
                            });

                        this.then(function() {
                            success();
                        });

                    });

                });
            });

        });

        var success = function()
        {
            start();
        };
    });

}(jQuery) );
