import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("workflowModel1", function() {

    it("Workflow Model 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(4);

        return guard(t, function(start) {
            var id = "simple-" + new Date().getTime();

            GitanaTest.authenticateFullOAuth().then(function() {

                // NOTE: this = platform

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

                // list the number of models
                var workflowModelCount1 = -1;
                this.listWorkflowModels({
                    "limit": -1
                }).count(function(count) {
                    workflowModelCount1 = count;
                });

                this.then(function() {

                    // NOTE: this = platform

                    // create a workflow model
                    this.createWorkflowModel(id, workflowModelObject).then(function() {

                        // update the model
                        this.title = "Workflow Model 2";
                        this.update();

                        // deploy the model
                        this.deploy();
                    });

                    // list all workflows
                    this.listWorkflowModels({
                        "limit": -1
                    }).count(function(count) {
                        t.assert.ok(count == workflowModelCount1 + 1, "Workflow model count + 1");
                    });
                    // query just for workflows of this id
                    this.queryWorkflowModels({
                        "id": id
                    }, {
                        "limit": -1
                    }).count(function(count) {
                        t.assert.ok(count == 1, "Workflow model count == 1 for id");
                    });

                    // create another version of the model
                    var newModel = null;
                    this.createWorkflowModel(id, workflowModelObject).then(function() {
                        newModel = this;
                    });

                    this.then(function() {

                        // list the versions for this model
                        this.listWorkflowModelVersions(id, {
                            "limit": -1
                        }).count(function(count) {
                            t.assert.ok(count == 2, "Count was 2");
                        });

                        // now read the model and delete it
                        this.readWorkflowModel(newModel.id, newModel.version).del();

                        this.listWorkflowModelVersions(id, {
                            "limit": -1
                        }).count(function(count) {
                            t.assert.ok(count == 1, "Count dropped down to 1");
                        });

                        this.then(function() {
                            success();
                        });
                    });

                });
            });

            var success = function()
            {
                start();
            };
        });
    });
});
