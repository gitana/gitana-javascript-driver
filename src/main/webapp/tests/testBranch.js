var testBranches = function()
{
    var driver = new Gitana.Driver();

	var repositoryId = null;
    var repository = null;

	var setupHandler1 = function(status)
	{
        if (!status.isOk())
        {
	        alert("Create failed");
	    }
	    
	    repositoryId = status.getId();

        // read the repository back
        driver.repositories().read(repositoryId, setupHandler2);
	};

    var setupHandler2 = function(repository)
    {
        this.repository = repository;

        // create a branch
        this.repository.branches().create("0:root", createHandler);
    };
	
    var createHandler = function(status)
    {
        if (!status.isOk())
        {
	        alert("Create failed");
	    }
	    
	    var branchId = status.getId();
	    
	    // read the branch
        this.repository.branches().read(branchId, readHandler);
    };
    
    var readHandler = function(branch)
    {
    	var branchId = branch["_doc"];
        
        // update the branch
    	branch["description"] = "illimani";
        branch.update(updateHandler);
    };
    
    var updateHandler = function(status)
    {
        if (!status.isOk())
        {
            alert("Update failed");
        }

        // list the branches
        this.repository.branches().list(shutdownHandler);
    };
    
    var shutdownHandler = function()
    {
    	// delete repository
        this.repository.del(shutdown2Handler);
    };

    var shutdown2Handler = function(status)
    {
        if (!status.isOk())
        {
            alert("shutdown2 fail");
        }

    	alert("Success");
    };        

    // kick off the test after logging in
    driver.security().authenticate("admin", "admin", function() {
        driver.repositories().create(setupHandler1);
    });
    
};
