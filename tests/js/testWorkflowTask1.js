(function($) {

    module("workflowTask1");

    // Test case : Workflow Task 1
    _asyncTest("Workflow Task 1", function()
    {
        expect(14);

        var modelId = "simple-" + new Date().getTime();

        Gitana.disconnect();
        Gitana.reset();
        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            var user1Name = "user1-" + new Date().getTime();
            var user2Name = "user2-" + new Date().getTime();
            var group1Name = "group1-" + new Date().getTime();

            // create domain and user and group
            var idUser1 = null;
            var idUser2 = null;
            var idGroup1 = null;
            this.createDomain().then(function() {
                this.createUser({
                    "name": user1Name,
                    "password": "user1"
                }).then(function() {
                    idUser1 = this.getDomainId() + "/" + this.getId();
                });
                this.createUser({
                    "name": user2Name,
                    "password": "user2"
                }).then(function() {
                    idUser2 = this.getDomainId() + "/" + this.getId();
                });
                this.then(function() {
                    this.createGroup({
                        "name": group1Name
                    }).then(function() {
                        idGroup1 = this.getDomainId() + "/" + this.getId();

                        this.addMember(idUser1);
                        this.addMember(idUser2);
                    });
                });
            });

            this.then(function() {

                // a workflow model
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
                                "approve": "node2",
                                "reject": "end"
                            }
                        },
                        "node2": {
                            "type": "participant",
                            "title": "Step Two",
                            "description": "Step Two Description",
                            "swimlane": "swimlane2",
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
                            "principals": [idUser1]
                        },
                        "swimlane2": {
                            "principals": [idGroup1]
                        }
                    }
                };

                // create a workflow model
                this.createWorkflowModel(modelId, workflowModelObject).then(function() {

                    // deploy the model
                    this.deploy();
                });

                this.then(function() {

                    // create a workflow and start it
                    this.createWorkflow(modelId).start().then(function() {

                        var f1 = function(callback)
                        {
                            // login as user1
                            Gitana.disconnect();
                            Gitana.reset();
                            GitanaTest.authenticate(idUser1, "user1").then(function() {

                                // list "assigned" tasks for current user (user1)
                                // should be one
                                this.listTasksForCurrentUser("assigned", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 1, "Pass 2.1");
                                });

                                // list "unassigned" tasks for current user (user1)
                                // should be zero
                                this.listTasksForCurrentUser("unassigned", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 0, "Pass 2.2");
                                });

                                // list "assignable" tasks for current user (user1)
                                // should be one
                                this.listTasksForCurrentUser("assignable", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 1, "Pass 2.3");
                                });

                                // complete the task
                                this.listTasksForCurrentUser("assigned", {
                                    "limit": -1
                                }).keepOne().then(function() {
                                    this.complete("approve").then(function() {
                                        callback();
                                    });
                                });
                            });
                        };

                        var f2 = function(callback)
                        {
                            // login as user1
                            Gitana.disconnect();
                            Gitana.reset();
                            GitanaTest.authenticate(idUser1, "user1").then(function() {

                                // list "assigned" tasks for current user (user1)
                                // should be zero
                                this.listTasksForCurrentUser("assigned", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 0, "Pass 3.1");
                                });

                                // list "unassigned" tasks for current user (default/admin)
                                // should be one
                                this.listTasksForCurrentUser("unassigned", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 1, "Pass 3.2");
                                });

                                // list "assignable" tasks for current user (default/admin)
                                // should be one
                                this.listTasksForCurrentUser("assignable", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 1, "Pass 3.3");
                                });

                                this.then(function() {
                                    callback();
                                });
                            });
                        };

                        var f3 = function(callback)
                        {
                            // login as user1
                            Gitana.disconnect();
                            Gitana.reset();
                            GitanaTest.authenticate(idUser2, "user2").then(function() {

                                // list "assigned" tasks for current user (user1)
                                // should be zero
                                this.listTasksForCurrentUser("assigned", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 0, "Pass 4.1");
                                });

                                // list "unassigned" tasks for current user (default/admin)
                                // should be one
                                this.listTasksForCurrentUser("unassigned", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 1, "Pass 4.2");
                                });

                                // list "assignable" tasks for current user (default/admin)
                                // should be one
                                this.listTasksForCurrentUser("assignable", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 1, "Pass 4.3");
                                });

                                this.then(function() {
                                    callback();
                                });
                            });
                        };

                        var f4 = function(callback)
                        {
                            // login as user1
                            Gitana.disconnect();
                            Gitana.reset();
                            GitanaTest.authenticate(idUser1, "user1").then(function() {

                                // claim our assignable task
                                this.listTasksForCurrentUser("assignable", {
                                    "limit": -1
                                }).keepOne().then(function() {

                                    // NOTE: this = task

                                    this.claim().then(function() {
                                        ok(true, "Pass 5.1");
                                    });
                                });

                                // list "assigned" tasks for current user (user1)
                                // should be 1
                                this.listTasksForCurrentUser("assigned", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 1, "Pass 5.2");
                                });

                                // list "unassigned" tasks for current user (default/admin)
                                // should be 0
                                this.listTasksForCurrentUser("unassigned", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 0, "Pass 5.3");
                                });

                                // list "assignable" tasks for current user (default/admin)
                                // should be 1
                                this.listTasksForCurrentUser("assignable", {
                                    "limit": -1
                                }).count(function(count) {
                                    equal(count, 1, "Pass 5.4");
                                });

                                // unclaim the task
                                this.listTasksForCurrentUser("assignable", {
                                    "limit": -1
                                }).keepOne().then(function() {

                                    // NOTE: this = task

                                    this.unclaim().then(function() {
                                        ok(true, "Pass 5.5");
                                    });
                                });

                                this.then(function() {
                                    callback();
                                });
                            });
                        };

                        var f5 = function(callback)
                        {
                            Gitana.disconnect();
                            Gitana.reset();
                            GitanaTest.authenticate(idUser2, "user2").then(function() {

                                // claim our assignable task
                                this.listTasksForCurrentUser("assignable", {
                                    "limit": -1
                                }).keepOne().then(function() {

                                    // NOTE: this = task

                                    // claim, unclaim, claim a few times
                                    this.claim().unclaim().claim().unclaim().claim().then(function() {

                                        // now delegate
                                        this.delegate(idUser1).then(function() {
                                            callback();
                                        });

                                    });
                                });
                            });
                        };

                        var f6 = function(callback)
                        {
                            Gitana.disconnect();
                            Gitana.reset();
                            GitanaTest.authenticate(idUser1, "user1").then(function() {

                                // claim our assigned task
                                this.listTasksForCurrentUser("assigned", {
                                    "limit": -1
                                }).keepOne().then(function() {

                                    // NOTE: this = task

                                    // complete
                                    this.complete("approve").then(function() {
                                        callback();
                                    });

                                });
                            });
                        };

                        f1(function() {
                            f2(function() {
                                f3(function() {
                                    f4(function() {
                                        f5(function() {
                                            f6(function() {
                                                success();
                                            });
                                        });
                                    });
                                });
                            });
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
