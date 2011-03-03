var testNodes = function()
{
    var gitana = new Gitana();
    
	var repositoryId = null;
	var nodeId1 = null;
	var nodeId2 = null;
    var repository = null;
    var branch = null;
	
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

        // read the master branch
        this.repository.branches().read("master", setupHandler3);
    };

    var setupHandler3 = function(branch)
    {
        this.branch = branch;
	    
	    // create a node
        this.branch.nodes().create(createHandler1);
	};
	
    var createHandler1 = function(status)
    {
        if (!status.isOk())
        {
	        alert("Create failed");
	    }
	    
	    nodeId1 = status.getId();
	    
	    var obj = { "property1":"value1", "property2":"value2" };
	    
	    // create another node
        this.branch.nodes().create(obj, createHandler2);
    };

    var createHandler2 = function(status)
    {
        if (!status.isOk())
        {
	        alert("Create failed");
	    }
	    
	    nodeId2 = status.getId();
	    
	    // read the node
        this.branch.nodes().read(nodeId2, readHandler);
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
        this.branch.nodes().update(nodeId2, node, updateHandler);
    };
    
    var updateHandler = function(status)
    {
        if (!status.isOk())
        {
            alert("Update failed");
        }

        // read the node back to verify it was updated
        this.branch.nodes().read(status.getId(), readHandler2);
    };

    var readHandler2 = function(node)
    {
        var x1 = node["description"];
        if (x1 != "illimani")
        {
            alert("Wrong value on read 2");
        }

        // delete a node
        this.branch.nodes().del(node.getId(), deleteHandler);
    };
    
    var deleteHandler = function(status)
    {
        if (!status.isOk())
        {
            alert("delete failed");
        }

    	alert("Success");
    };        

    // kick off the test after logging in
    gitana.security().authenticate("admin", "admin", function() {
        gitana.repositories().create(setupHandler1);
    });

};    
