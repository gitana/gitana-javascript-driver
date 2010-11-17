var testNodes = function(gitana)
{
	var repositoryId = null;
	var nodeId1 = null;
	var nodeId2 = null;
	
	var setupRepositoryHandler = function(status)
	{
        var ok = status["ok"];
	    if (!ok)
	    {
	        alert("Create failed");
	    }
	    
	    repositoryId = status["_doc"];
	    
	    // create a node
	    gitana.createNode(repositoryId, "master", createHandler1);
	};
	
    var createHandler1 = function(status)
    {
        var ok = status["ok"];
	    if (!ok)
	    {
	        alert("Create failed");
	    }
	    
	    nodeId1 = status["_doc"];
	    
	    var obj = { "property1":"value1", "property2":"value2" };
	    
	    // create anode
	    gitana.createNode(repositoryId, "master", obj, createHandler2);
    };

    var createHandler2 = function(status)
    {
        var ok = status["ok"];
	    if (!ok)
	    {
	        alert("Create failed");
	    }
	    
	    nodeId2 = status["_doc"];
	    
	    // read the node
	    gitana.readNode(repositoryId, "master", nodeId2, readHandler);
    };
    
    var readHandler = function(node)
    {
    	var x1 = node["property1"];
    	if (x1 != "value1")
    	{
    		alert("Wrong value on read");
    	}
    	
        // update the node
    	node["description"] = "illimani";
        gitana.updateNode(repositoryId, "master", nodeId2, node, updateHandler);
    };
    
    var updateHandler = function(status)
    {
        var ok = status["ok"];
        if (!ok)
        {
            alert("Update failed");
        }
    
        // delete a node
        gitana.deleteNode(repositoryId, "master", nodeId2, shutdownHandler);
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
