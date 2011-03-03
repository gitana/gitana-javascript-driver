var testBranches = function()
{
    var gitana = new Gitana();

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
        gitana.repositories().read(repositoryId, setupHandler2);
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
        this.repository.branches().update(branchId, branch, updateHandler);
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
    gitana.security().authenticate("admin", "admin", function() {
        gitana.repositories().create(setupHandler1);
    });
    
};
