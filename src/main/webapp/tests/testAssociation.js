var testAssociations = function()
{
    var driver = new Gitana.Driver();

    var repository = null;
    var branch = null;

    var node1 = null;
    var node2 = null;
    var node3 = null;
    var node4 = null;

    var createNodes = function()
    {
        // create a bunch of nodes
        this.branch.nodes().create(function(status) {
            this.branch.nodes().read(status.getId(), function(n1) {

                this.node1 = n1;

                this.branch.nodes().create(function(status) {
                    this.branch.nodes().read(status.getId(), function(n2) {

                        this.node2 = n2;

                        this.branch.nodes().create(function(status) {
                            this.branch.nodes().read(status.getId(), function(n3) {

                                this.node3 = n3;

                                this.branch.nodes().create(function(status) {
                                    this.branch.nodes().read(status.getId(), function(n4) {

                                        this.node4 = n4;

                                        defineAssociation();

                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };

    var defineAssociation = function()
    {
        // define a new association type
        var obj = {
            "_qname":"custom:test",
            "_type":"d:association",
            "type":"object",
            "description":"Custom content type",
            "properties":{}
        };
        this.branch.nodes().create(obj, function(status) {

            associateNodes();

        });
    };

    var associateNodes = function()
    {
        var _this = this;

        // associate node1 -> node2 -> node3
        // associate node1 -> node4 (of type custom:test)

        _this.node1.associate(_this.node2.getId(), function(status) {
            _this.node2.associate(_this.node3.getId(), function(status) {
                _this.node1.associate(_this.node4.getId(), "custom:test", function(status) {

                    test1();

                });
            })
        });
    };

    var test1 = function()
    {
        this.node1.incomingAssociations(function(response){
            if (response["total_rows"] != 0)
            {
                alert("incorrect rows; should be 0");
            }

            test2();
        });
    };

    var test2 = function()
    {
        this.node1.outgoingAssociations(function(response){
            if (response["total_rows"] != 2)
            {
                alert("incorrect rows; should be 2");
            }

            test3();
        });
    };

    var test3 = function()
    {
        this.node2.incomingAssociations(function(response){
            if (response["total_rows"] != 1)
            {
                alert("incorrect rows; should be 1");
            }

            test4();
        });
    };

    var test4 = function()
    {
        this.node2.outgoingAssociations(function(response){
            if (response["total_rows"] != 1)
            {
                alert("incorrect rows; should be 1");
            }

            test5();
        });
    };

    var test5 = function()
    {
        this.node3.incomingAssociations(function(response){
            if (response["total_rows"] != 1)
            {
                alert("incorrect rows; should be 1");
            }

            test6();
        });
    };

    var test6 = function()
    {
        this.node3.outgoingAssociations(function(response){
            if (response["total_rows"] != 0)
            {
                alert("incorrect rows; should be 0");
            }

            test7();
        });
    };

    var test7 = function()
    {
        this.node1.outgoingAssociations("custom:test", function(response){
            if (response["total_rows"] != 1)
            {
                alert("incorrect rows; should be 0");
            }

            unassociate();
        });
    };

    var unassociate = function()
    {
        this.node1.unassociate(this.node4.getId(), "custom:test", function(status) {

            test8();

        });
    };

    var test8 = function()
    {
        this.node1.outgoingAssociations(function(response){
            if (response["total_rows"] != 1)
            {
                alert("incorrect rows; should be 1");
            }

            finishTest();
        });
    };

    var finishTest = function()
    {
        alert("Test finished successfully");
    };

    var _this = this;

    // kick off the test after logging in
    driver.security().authenticate("admin", "admin", function() {
        driver.repositories().create(function(status) {

            driver.repositories().read(status.getId(), function(repository) {

                _this.repository = repository;

                _this.repository.branches().read("master", function(branch) {

                    _this.branch = branch;

                    createNodes();
                });
            });
        });
    });
    
};
