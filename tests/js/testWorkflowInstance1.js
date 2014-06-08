(function($) {

    module("workflowInstance1");

    // Test case : Workflow Instance 1
    _asyncTest("Workflow Instance 1", function()
    {
        expect(4);

        var modelId = "simple-" + new Date().getTime();

        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            var node1 = null;
            var node2 = null;
            this.createRepository().readBranch("master").then(function() {

                this.createNode().then(function() {
                    node1 = this;
                });

                this.createNode().then(function() {
                    node2 = this;
                });

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
                        "swimlane": "swimlane1",
                        "transitions": {
                            "approve": "end",
                            "reject": "end"
                        }
                    },
                    "end": {
                        "type": "end"
                    }
                },
                "swimlanes": {
                    "swimlane1": {
                        "principals": ["default/admin"]
                    }
                }
            };

            // create a workflow model
            this.createWorkflowModel(modelId, workflowModelObject).then(function() {

                // deploy the model
                this.deploy();
            });

            // list all workflows
            var count1 = -1;
            this.listWorkflows({
                "limit": -1
            }).count(function(count) {
                count1 = count;
            });

            this.then(function() {

                // create a workflow and start it
                this.createWorkflow(modelId).then(function() {
                    this.start();
                });

                // count should go up by 1
                this.listWorkflows({
                    "limit": -1
                }).count(function(count) {
                    ok(count == count1 + 1, "Count went up by 1");
                });

                // query for workflows by kind
                this.queryWorkflows({
                    "modelId": modelId
                }, {
                    "limit": -1
                }).count(function(count) {
                    ok(count == 1, "Count was 1");
                });

                // create another workflow, update and delete it
                this.createWorkflow(modelId).then(function() {
                    this.test = true;
                    this.update();
                    this.del();
                });

                // create another workflow, start it
                this.createWorkflow(modelId).then(function() {
                    this.start();

                    // add both nodes as resources
                    this.addResource(node1);
                    this.addResource(node2);

                    // verify resource list (size 2)
                    this.loadResourceList(function(resources) {
                        ok(resources.length == 2, "Resources length size 2");
                    });

                    // remove node 2
                    this.removeResource(node2);

                    // verify resource list (size 1)
                    this.loadResourceList(function(resources) {
                        ok(resources.length == 1, "Resources length size 1");
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

}(jQuery) );