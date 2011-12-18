(function($) {

    module("chainable1");

    // Test case : Chainable 1
    test("Chainable 1", function()
    {
        stop();

        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // manually build a map of things

            var server = this;

            var json = {
                "rows": [{
                    "_doc": "doc1"
                }, {
                    "_doc": "doc2"
                }, {
                    "_doc": "doc3"
                }]
            };
            var repositoryMap = gitana.getFactory().repositoryMap(server, json);


            //
            // SERIAL ITERATION (each)
            //
            var count1 = 0;
            this.subchain(repositoryMap).each(function() {

                // create a dummy branch object
                var branch = this.getFactory().branch(this);

                // attach to chain
                this.subchain(branch).then(function() {

                    var chain = this;

                    // do something asynchronously
                    window.setTimeout(function()
                    {
                        count1++;
                        chain.next();

                    }, 100);

                    // signal that we'll manually call next once our async thing finishes
                    return false;
                });
            }).then(function() {
                equal(count1, 3, "Serial processing works correctly");
            });


            //
            // PARALLEL ITERATION (each)
            //
            var count2 = 0;
            this.subchain(repositoryMap).eachX(function() {

                // create a dummy branch
                var branch = this.getFactory().branch(this);

                // attach to chain
                this.subchain(branch).then(function() {

                    var chain = this;

                    // do something asynchronously
                    window.setTimeout(function()
                    {
                        count2++;
                        chain.next();

                    }, 100);

                    // signal that we'll manually call next once our async thing finishes
                    return false;
                });
            }).then(function() {
                equal(count2, 3, "Parallel processing works correctly");
            });


            this.then(function() {
                success();
            });

        });

        var success = function()
        {
            start();
        }

    });

}(jQuery) );
