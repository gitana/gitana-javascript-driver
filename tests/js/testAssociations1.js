(function($) {

    module("associations1");

    // Test case : Association operations.
    _asyncTest("Association operations", function()
    {
        expect(8);

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

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

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
            // associate node1 -> node2 -> node3
            // associate node1 -> node4 (of type custom:test)
            this.then(function() {
                this.subchain(node1).associate(node2);
                this.subchain(node2).associate(node3);
                this.subchain(node1).associate(node4, "custom:test");
            });

            // verify
            this.then(function() {

                this.subchain(node1).incomingAssociations().count(function(count) {
                    ok(count > 0, "Number of incoming associations to node 1 is > 0");
                });

                this.subchain(node1).outgoingAssociations().count(function(count) {
                    ok(count > 0, "Number of outgoing associations from node 1 is > 0");
                });

                this.subchain(node2).incomingAssociations().count(function(count) {
                    ok(count > 0, "Number of incoming associations to node 2 is > 0");
                });

                this.subchain(node2).outgoingAssociations().count(function(count) {
                    ok(count > 0, "Number of outgoing associations from node 2 is > 0");
                });

                // INCOMING node 3
                var config = {
                    "direction": "incoming"
                };
                this.subchain(node3).associations(config).count(function(count) {
                    ok(count > 0, "Number of incoming associations to node 3 is > 0");
                });

                // OUTGOING node 3
                var config = {
                    "direction": "outgoing"
                };
                this.subchain(node3).associations(config).count(function(count) {
                    ok(count == 0, "Number of outgoing associations from node3 is 0");
                });

                this.subchain(node1).outgoingAssociations("custom:test").count(function(count) {
                    ok(count > 0, "Number of outgoing associations from node 1 of type 'custom:test' is > 0");
                });

                this.subchain(node1).unassociate(node4, "custom:test").outgoingAssociations().count(function(count) {
                    ok(count > 0, "Number of outgoing associations from node 4 after unassociate should be greater than 0");
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
