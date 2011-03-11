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
            _this.branch.nodes().read(status.getId(), function(node) {
                _this.typeNode = node;

                // create form: simple
                _this.typeNode.forms().create("simple", function(status) {
                    _this.typeNode.forms().read("simple", function(form) {
                        _this.simple = form;

                        // create form: normal
                        _this.typeNode.forms().create("normal", function(status) {
                            _this.typeNode.forms().read("normal", function(form) {
                                _this.normal = form;

                                // create form: complex
                                _this.typeNode.forms().create("complex", function(status) {
                                    _this.typeNode.forms().read("complex", function(form) {
                                        _this.complex = form;

                                        test1();

                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };

    var test1 = function()
    {
        var _this = this;

        // pull back a list of all of the form associations for the type
        _this.typeNode.forms().list(function(response)
        {
            // assert we got 3 back
            if (response.list.length != 3)
            {
                alert("Wrong #1: " + response.list.length);
            }

            // remove the second one that comes back
            var formKey = response.list[1].getFormKey();
            _this.typeNode.forms().remove(formKey, function(status)
            {
                // pull back a list of all of the form associations for this node now
                _this.typeNode.forms().list(function(response)
                {
                    // assert we got 3 back
                    if (response.list.length != 2)
                    {
                        alert("Wrong #2: " + response.list.length);
                    }

                    success();

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
