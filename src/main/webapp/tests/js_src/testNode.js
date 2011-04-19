(function($) {

    module("node");

    // Test case : Node operations.
    test("Node operations.", function() {
        stop();

        expect(9);

        var driver = new Gitana.Driver();

        var repositoryId = null;
        var nodeId1 = null;
        var nodeId2 = null;
        var repository = null;
        var branch = null;

        var setupHandler1 = function(status) {
            ok(status.isOk(),"Create repository succeed.");

            repositoryId = status.getId();

            // read the repository back
            driver.repositories().read(repositoryId, setupHandler2);
        };

        var setupHandler2 = function(repository) {
            this.repository = repository;

            // read the master branch
            this.repository.branches().read("master", setupHandler3);
        };

        var setupHandler3 = function(branch) {
            this.branch = branch;

            // create a node
            this.branch.nodes().create(createHandler1);
        };

        var createHandler1 = function(status) {

            ok(status.isOk(),"Create node 1 succeed.");

            nodeId1 = status.getId();

            var obj = { "property1":"value1", "property2":"value2" };

            // create another node
            this.branch.nodes().create(obj, createHandler2);
        };

        var createHandler2 = function(status) {
           ok(status.isOk(),"Create node 2 succeed.");

            nodeId2 = status.getId();

            // read the node
            this.branch.nodes().read(nodeId2, readHandler);
        };

        var readHandler = function(node) {
            var x1 = node["property1"];
            equal(x1 , "value1" , "Node 1 has right value for property1.");

            // update the node
            node["title"] = "lapaz";
            node["description"] = "illimani";
            node.update(updateHandler);
        };

        var updateHandler = function(status) {
            ok(status.isOk(),"Update node 1 succeed.");

            // read the node back to verify it was updated
            this.branch.nodes().read(status.getId(), readHandler2);
        };

        var readHandler2 = function(node) {
            var x1 = node["description"];
            equal(x1 , "illimani" , "Node 1 has right value for description through property reference.");
            var x2 = node.getDescription();
            equal(x2 , "illimani" , "Node 1 has right value for description through getDescription method call.");
            var x3 = node.getTitle();
            equal(x3 , "lapaz" , "Node 1 has right value for title through getTitle method call.");

            // delete a node
            this.branch.nodes().del(node.getId(), deleteHandler);
        };

        var deleteHandler = function(status) {
            ok(status.isOk(),"Delete node 1 succeed.");

            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().create(setupHandler1);
        });

    });

}(jQuery) );
