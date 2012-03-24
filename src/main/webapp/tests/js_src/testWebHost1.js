(function($) {

    module("webhost1");

    // Test case : Web Host 1
    test("Web Host 1", function()
    {
        stop();

        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform
            var value = "value" + new Date().getTime();

            var originalCount = -1;
            this.listWebHosts().count(function(count) {
                originalCount = count;
            });

            var webhost = null;
            this.createWebHost({"abc": value}).then(function() {
                webhost = this;
            });

            this.then(function() {

                this.listWebHosts().count(function(count) {
                    equal(count, originalCount + 1, "Web Host count + 1");
                });

                // test query
                this.queryWebHosts({"abc": value}).count(function(count) {
                    equal(count, 1, "Found a query result");
                });

                // update and delete the web host
                this.then(function() {

                    this.readWebHost(webhost.getId()).update().del();

                    this.listWebHosts().count(function(count) {
                        equal(count, originalCount, "Web host back to what it was");
                    });

                    this.then(function() {
                        success();
                    });

                });

            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
