(function($) {

    module("repository2");

    // Test case : Repository chaining
    test("Repository Chaining", function()
    {
        stop();

        expect(1);

        var filter = function()
        {
            return (this.getId() != "gitana");
        };
        var comparator = function(a, b)
        {
            // less than zero => sort "a" to be a lower index than "b"
            // zero => "a" and "b" are equal, no sorting
            // greater than zero => sort 'b" to be a lower index than "a"
            return (0.5 - Math.random());
        };

        var count = 0;

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            // create one repository
            this.createRepository().then(function() {
                var repo1 = this;
            });

            // create another repository
            this.createRepository().then(function() {
                var repo2 = this;
            });

            // now test some chaining
            this.listRepositories().filter(filter).sort(comparator).keep(2).each(function() {
                count++;
            }).then(function() {
                equal(count, 2, "Counted 2");

                // signal end of test
                success();
            });
        });

        var success = function()
        {
            start();
        };
    });

}(jQuery) );
