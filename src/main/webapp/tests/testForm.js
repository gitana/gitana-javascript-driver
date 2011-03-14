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
