(function($) {

    module("nodeLocks1");

    // Test case : Node locks.
    test("Locks", function()
    {
        stop();

        expect(2);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a node
            this.createNode().then(function() {

                // NOTE: this = node

                // lock the node and verify
                this.lock().checkLocked(function(isLocked) {
                    ok(isLocked, "Node was locked");
                });

                // unlock the node and verify
                this.unlock().checkLocked(function(isLocked) {
                    ok(!isLocked, "Node was unlocked");
                });

                this.then(function() {
                    success();
                });
            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
