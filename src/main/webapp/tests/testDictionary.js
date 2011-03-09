var testDictionary = function()
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

            test1();
        });
    };

    var test1 = function()
    {
        var _this = this;

        // list all
        _this.branch.definitions().list(function(response){

            alert("Found: " + response.list.length + " definitions");

            // list types
            _this.branch.definitions().list("type", function(response) {

                alert("Found: " + response.list.length + " type definitions");

                // list associations
                _this.branch.definitions().list("association", function(response) {

                    alert("Found: " + response.list.length + " association definitions");

                    _this.branch.definitions().list("feature", function(response) {

                        alert("Found: " + response.list.length + " feature definitions");

                        success();
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
