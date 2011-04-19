(function($) {

    module("form");

    // Test case : Form operations.
    test("Form operations", function() {
        stop();

        expect(11);
        var driver = new Gitana.Driver();

        var setupHandler1 = function(status) {
            ok(status.isOk(), "Create repository succeed.")

            // read the repository back
            driver.repositories().read(status.getId(), setupHandler2);
        };

        var setupHandler2 = function(repository) {
            var _this = this;

            this.repository = repository;

            // read the master branch
            this.repository.branches().read("master", function(branch) {

                _this.branch = branch;

                setupHandler3();
            });
        };

        var setupHandler3 = function() {
            var _this = this;

            // create a new content type
            var o = {
                "_qname": "custom:uzi1",
                "_type": "d:type"
            };
            _this.branch.nodes().create(o, function(status) {
                _this.branch.nodes().read(status.getId(), function(definitionNode) {

                    // create three forms: simple, normal, complex
                    definitionNode.forms().create("simple", function(simpleForm) {
                        definitionNode.forms().create("normal", function(normalForm) {
                            definitionNode.forms().create("complex", function(complexForm) {
                                test1(definitionNode);
                            });
                        });
                    });

                });
            });
        };

        var test1 = function(definitionNode) {
            // quick test to read a form - verify api
            definitionNode.forms().read("simple", function(form) {

                test2(definitionNode);

            });
        };

        var test2 = function(definitionNode) {
            var _this = this;

            // pull back a list of all of the form associations for the type
            definitionNode.forms().list(function(response) {

                equal(response.list.length, 3, "Created three forms.");

                // remove the second one that comes back
                var formKey = response.list[1].getFormKey();
                definitionNode.forms().remove(formKey, function(status) {
                    // pull back a list of all of the form associations for this node now
                    definitionNode.forms().list(function(response) {
                        // assert we got 3 back
                        equal(response.list.length, 2, "Two forms left after one is removed.");
                        test3(definitionNode);

                    });

                });

            });

        };

        var test3 = function(definitionNode) {
            // create a new form for this definition, called "test"
            // make sure it has some properties
            var obj = {
                "property1": "value1",
                "property2": {
                    "property3": "value3"
                }
            };

            definitionNode.forms().create("test", obj, function(testForm) {

                ok(testForm["property1"], "Form has property1.");
                ok(testForm["property2"]["property3"], "Form has property2.property3.")

                // update the form
                testForm["property4"] = "value4";
                testForm.update(function(status) {

                    definitionNode.forms().read("test", function(check) {

                        ok(check["property1"], "Form has property1 after update.");
                        ok(check["property2"]["property3"], "Form has property2.property3 after update.");
                        ok(check["property4"], "Form has property4 after update.");

                        test4(definitionNode);

                    });
                });
            });
        };

        var test4 = function(definitionNode) {
            definitionNode.forms().read("test", function(testForm) {

                delete testForm["property1"];

                testForm.update(function(status) {

                    // NOTE: another way to do a read
                    // same as definitionNode.forms().read("test", function(modifiedTestForm) {...});

                    testForm.reload(function(modifiedTestForm) {

                        // replace with another json object
                        var obj = {
                            "replace1": "value1",
                            "replace2": "value2"
                        };

                        modifiedTestForm.replacePropertiesWith(obj);

                        modifiedTestForm.update(function(status) {

                            modifiedTestForm.reload(function(modifiedTestForm2) {

                                equal(modifiedTestForm2["replace1"], "value1","Updated form has right value for property replace1.");
                                equal(modifiedTestForm2["replace2"], "value2","Updated form has right value for property replace2.");
                                ok(!modifiedTestForm2["property2"],"Updated form doesn't have property property2.");
                                success();

                            });
                        });
                    });
                });
            });
        };


        var success = function() {
            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().create(setupHandler1);
        });

    });

}(jQuery) );
