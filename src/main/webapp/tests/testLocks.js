var testLocks = function()
{
    var driver = new Gitana.Driver();

	var repositoryId = null;
	var nodeId1 = null;
	var nodeId2 = null;
    var repository = null;
    var branch = null;

	var setupHandler1 = function(status)
	{
	    repositoryId = status.getId();

        // read the repository back
        driver.repositories().read(repositoryId, setupHandler2);
    };

    var setupHandler2 = function(repository)
    {
        this.repository = repository;

        // read the master branch
        this.repository.branches().read("master", setupHandler3);
    };

    var setupHandler3 = function(branch)
    {
        this.branch = branch;

        test1();
	};

    var test1 = function()
    {
        var _this = this;

        // create a node
        _this.branch.nodes().create(function(status) {
            _this.branch.nodes().read(status.getId(), function(node) {

                // lock the node
                node.lock(function(status) {

                    // check that the node is locked
                    node.isLocked(function(locked) {

                        if (!locked)
                        {
                            alert("Locked should have been true");
                        }

                        // release the lock
                        node.unlock(function(status) {

                            // check that the node is unlocked
                            node.isLocked(function(locked) {

                                if (locked)
                                {
                                    alert("Locked should have been false");
                                }

                                success();
                            });
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
