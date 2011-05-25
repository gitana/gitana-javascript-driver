(function($) {

    module("associations2");

    // Test case : Associations 2
    test("Associations 2", function()
    {
        stop();

        expect(12);

        var node1 = null;
        var node2 = null;
        var node3 = null;
        var node4 = null;

        // association type definition ("custom:test")
        var obj = {
            "_qname":"custom:test",
            "_type":"d:association",
            "type":"object",
            "description":"Custom content type",
            "properties":{}
        };

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a bunch of nodes
            this.createNode().then(function() {
                node1 = this;
            });
            this.createNode().then(function() {
                node2 = this;
            });
            this.createNode().then(function() {
                node3 = this;
            });
            this.createNode().then(function() {
                node4 = this;
            });

            // define an association type ("custom:test")
            this.createNode(obj);

            // associate the nodes
            /*
                    node1
                           (a:child)     -> node2
                        <- (custom:test) -> node3
                        <- (custom:test)    node4
             */
            this.then(function() {
                this.subchain(node1).then(function() {

                    this.associate(node2, "a:child");
                    this.associate(node3, "custom:test", true);
                    this.associateOf(node4, "custom:test");

                });
            });

            // validate node 1
            this.then(function() {

                this.subchain(node1).incomingAssociations("a:child").count(function(count) {
                    equal(count, 0, "Zero incoming a:child to node 1");
                });

                this.subchain(node1).incomingAssociations("custom:test").count(function(count) {
                    equal(count, 2, "Two incoming custom:test to node 1");
                });

                this.subchain(node1).outgoingAssociations("a:child").count(function(count) {
                    equal(count, 1, "One outgoing a:child from node 1");
                });

                this.subchain(node1).associations({
                    "type": "a:child",
                    "direction": "ANY"
                }).count(function(count) {
                    equal(count, 1, "One undirected OR directed (ANY) a:child to/from node 1");
                });

                this.subchain(node1).associations({
                    "type": "a:child",
                    "direction": "MUTUAL"
                }).count(function(count) {
                    equal(count, 0, "Zero mutual a:child with node 1");
                });

                this.subchain(node1).associations({
                    "type": "custom:test",
                    "direction": "MUTUAL"
                }).count(function(count) {
                    equal(count, 1, "One mutual custom:test with node 1");
                });

                this.subchain(node3).associations({
                    "type": "custom:test",
                    "direction": "MUTUAL"
                }).count(function(count) {
                    equal(count, 1, "One mutual custom:test with node 3");
                });

                this.subchain(node3).incomingAssociations("custom:test").count(function(count) {
                    equal(count, 1, "One incoming custom:test to node 3");
                });

            });

            // test other node support for node2
            this.then(function() {

                // get the association between node 1 and node 2
                this.subchain(node2).incomingAssociations("a:child").each(function() {

                    // test getOtherNodeId
                    equal(this.getOtherNodeId(node2), node1.getId(), "Node2 - other node ID is node1");

                    // test readOtherNode
                    this.readOtherNode(node2).then(function() {
                        equal(this.getId(), node1.getId(), "Node2 - readOtherNode fetched node1");
                    });

                    // test getDirection method
                    equal("INCOMING", this.getDirection(node2), "Node2 - association INCOMING to node2");
                    equal("OUTGOING", this.getDirection(node1), "Node2 - association OUTGOING from node1");
                });
            });

            // success
            this.then(function()
            {
                success();
            });
        });

        var success = function()
        {
            start();
        };
    });

}(jQuery) );
