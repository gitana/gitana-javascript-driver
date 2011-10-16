(function($) {

    module("changeset1");

    // Test case : Changeset #1
    test("Changeset 1", function() {

        stop();

        expect(3);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").createRepository().then(function() {

            // NOTE: this = repository

            var n6 = null;

            // read the master branch
            this.readBranch("master").then(function() {

                // NOTE: this = branch

                this.createNode(); // 1
                this.createNode(); // 2
                this.createNode(); // 3
                this.createNode(); // 4
                this.createNode(); // 5
                this.createNode().then(function() {
                    n6 = this;
                }); // 6
                this.createNode(); // 7
                this.createNode(); // 8
            });

            this.then(function() {

                // NOTE: this = repository

                this.listChangesets().count(function(count) {
                    equals(9, count);
                });

                this.queryChangesets({}).count(function(count) {
                    equals(9, count);
                });

                // pick off nodes from changeset
                this.queryChangesets().select(n6.getSystemMetadata().getChangesetId()).listNodes().count(function(count) {

                    ok(count >= 4);

                    success();
                });
            });

        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
