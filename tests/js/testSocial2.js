(function($) {

    module("social2");

    // Test case : Comment operations.
    _asyncTest("Comment operations", function()
    {
        expect(9);

        var node1 = null;
        var node2 = null;
        var node3 = null;

        var commentNode1 = null;
        var commentNode2 = null;
        // content type
        var contentType = {
            "_qname": "custom:social1",
            "_type": "d:type",
            "type":"object",
            "properties": {
                "name" : {
                    "type" : "string"
                }
            }
        };

        // association type definition ("custom:test")
        var associationType = {
            "_qname":"custom:test",
            "_type":"d:association",
            "type":"object",
            "description":"Custom content type",
            "properties":{}
        };

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch
            // create new content type
            this.createNode(contentType);

            this.createNode(associationType);

            // create a bunch of nodes
            this.createNode().then(function() {
                node1 = this;
            });

            this.createNode({
                "_type" : "custom:social1",
                "_qname" : "custom:node2",
                "name" : "social name",
                "title":"20% off on all Wilson Jones binders.",
                "description":"Wilson Jones Basic Round-Ring Binder",

                "code":"1234-456-898",
                "details":"20% off on all Wilson Jones binders.",
                "product":"Wilson Jones Basic Round-Ring Binder",
                "start_date":"04/11/2011",
                "end_date":"05/11/2011",
                "original_price":{
                    "price" : "5.25",
                    "unit" : "each"
                },
                "promotion_price":{
                    "price" : "4.20",
                    "unit" : "each"
                },
                "stores":[
                    "Scranton, PA",
                    "Utica, NY",
                    "Stamford, CT",
                    "Nashua, NH"
                ]
            }).then(function() {
                node2 = this;

                this.attach("attachmentId1", "text/plain", "first");
                this.attach("attachmentId2", "text/plain", "second");
                this.attach("attachmentId3", "text/plain", "third");
                this.attach("attachmentId4", "text/plain", "fourth");
            });

            this.createNode().then(function() {
                node3 = this;
            });

            this.createNode({
                "_type": "n:comment",
                "rating": 3,
                "title": "comment 1 title",
                "description" : "comment 1 description"
            }).then(function() {
                commentNode1 = this;
            });

            this.createNode({
                "_type": "n:comment",
                "rating": 4,
                "title": "comment 2 title",
                "description" : "comment 2 description"
            }).then(function() {
                commentNode2 = this;
            });

            // associate the nodes
            this.then(function() {
                this.subchain(node1).associate(commentNode1, "a:has_comment");
                this.subchain(node2).associate(node3, "custom:test");
                this.subchain(node2).associate(commentNode2, "a:has_comment");
            });

            // verify
            this.then(function() {

                this.subchain(node1).reload().then(function() {
                    equal(this.stats()['ratingTotalCount'], 1, "Validate rating total count");
                    equal(this.stats()['ratingTotalValue'], 3, "Validate rating total value");
                    equal(this.stats()['ratingAverageValue'], 3, "Validate rating average value");
                }).outgoingAssociations().count(function(count) {
                    ok(count > 0, "Number of outgoing associations from node 1 is > 0");
                });

                this.subchain(node2).reload().then(function() {
                    equal(this.stats()['ratingTotalCount'], 1, "Validate rating total count");
                    equal(this.stats()['ratingTotalValue'], 4, "Validate rating total value");
                    equal(this.stats()['ratingAverageValue'], 4, "Validate rating average value");

                    equal(this.stats()['custom:test'], 1, "1 custom test association");
                }).outgoingAssociations().count(function(count) {
                    ok(count > 0, "Number of outgoing associations from node 1 is > 0");
                });

            });

            // success
            this.then(function() {
                success();
            });
        });

        var success = function() {
            start();
        };
    });

}(jQuery) );
