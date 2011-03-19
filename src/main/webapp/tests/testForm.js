var testForm = function()
{
    var driver = new Gitana.Driver();

    var setupHandler1 = function(status)
    {
        if (!status.isOk())
        {
            alert("Create failed");
        }

        // read the repository back
        driver.repositories().read(status.getId(), setupHandler2);
    };

    var setupHandler2 = function(repository)
    {
        var _this = this;

        this.repository = repository;

        // read the master branch
        this.repository.branches().read("master", function(branch) {

            _this.branch = branch;

            setupHandler3();
        });
    };

    var setupHandler3 = function()
    {
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

    var test1 = function(definitionNode)
    {
        // quick test to read a form - verify api
        definitionNode.forms().read("simple", function(form) {
            
            test2(definitionNode);

        });
    };

    var test2 = function(definitionNode)
    {
        var _this = this;

        // pull back a list of all of the form associations for the type
        definitionNode.forms().list(function(response) {

            // assert we got 3 back
            if (response.list.length != 3)
            {
                alert("Wrong #1: " + response.list.length);
            }

            // remove the second one that comes back
            var formKey = response.list[1].getFormKey();
            definitionNode.forms().remove(formKey, function(status)
            {
                // pull back a list of all of the form associations for this node now
                definitionNode.forms().list(function(response)
                {
                    // assert we got 3 back
                    if (response.list.length != 2)
                    {
                        alert("Wrong #2: " + response.list.length);
                    }

                    test3(definitionNode);

                });

            });

        });

    };

    var test3 = function(definitionNode)
    {
        // create a new form for this definition, called "test"
        // make sure it has some properties
        var obj = {
            "property1": "value1",
            "property2": {
                "property3": "value3"
            }
        };

        definitionNode.forms().create("test", obj, function(testForm) {

            if (!testForm["property1"])
            {
                alert("Missing property1");
            }
            if (!testForm["property2"]["property3"])
            {
                alert("Missing property2.property3");
            }

            // update the form
            testForm["property4"] = "value4";
            testForm.update(function(status) {

                definitionNode.forms().read("test", function(check) {

                    if (!check["property1"])
                    {
                        alert("Missing check property1");
                    }

                    if (!check["property2"]["property3"])
                    {
                        alert("Missing check property2.property3");
                    }

                    if (!check["property4"])
                    {
                        alert("Missing property4");
                    }

                    test4(definitionNode);

                });
            });
        });
    };

    var test4 = function(definitionNode)
    {
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

                            if (modifiedTestForm2["replace1"] != "value1")
                            {
                                alert("Missing replace1 value1");
                            }

                            if (modifiedTestForm2["replace2"] != "value2")
                            {
                                alert("Missing replace2 value2");
                            }

                            if (modifiedTestForm2["property2"])
                            {
                                alert("Shouldn't have had property2")
                            }
                                                        
                            success();

                        });
                    });
                });
            });
        });
    };


    var success = function()
    {
        alert("success");
    };

    // kick off the test after logging in
    driver.security().authenticate("admin", "admin", function() {
        driver.repositories().create(setupHandler1);
    });

};
