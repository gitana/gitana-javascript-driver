var testBranches = function(gitana)
{
	var repositoryId = null;
	
	var setupRepositoryHandler = function(status)
	{
        var ok = status["ok"];
	    if (!ok)
	    {
	        alert("Create failed");
	    }
	    
	    repositoryId = status["_doc"];
	    
	    // create a branch
	    gitana.createBranch(repositoryId, "0:root", createHandler);
	};
	
    var createHandler = function(status)
    {
        var ok = status["ok"];
	    if (!ok)
	    {
	        alert("Create failed");
	    }
	    
	    var branchId = status["_doc"];
	    
	    // read the branch
	    gitana.readBranch(repositoryId, branchId, readHandler);
    };
    
    var readHandler = function(branch)
    {
    	var branchId = branch["_doc"];
        
        // update the branch
    	branch["description"] = "illimani";
        gitana.updateBranch(repositoryId, branchId, branch, updateHandler);
    };
    
    var updateHandler = function(status)
    {
        var ok = status["ok"];
        if (!ok)
        {
            alert("Update failed");
        }
    
        var branchId = status["_doc"];
        
        // call list branches
        gitana.listBranches(repositoryId, shutdownHandler);
    };
    
    var shutdownHandler = function()
    {
    	// delete repository
    	gitana.deleteRepository(repositoryId);
    	
    	alert("Success");
    };        

    // kick off the test
    gitana.createRepository(setupRepositoryHandler);
};    
