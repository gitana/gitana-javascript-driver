(function($) {

    module("channels1");

    // Test case : Channels 1 CRUD operations
    _asyncTest("Channels 1", function() {

        var channel = null;
        var name = "testname-" + new Date().getTime();

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function () {

            // NOTE: this = platform

            // first: create a channel
            this.createChannel({
                "title": "test1",
                "description": "Testing channel 1",
                "type": "Branch",
                "name": name
            }).then(function(){
                channel = this;
                ok(true, "Successfully Created Channel");
            });

            this.then(function () {

                // then test out query, list, read and delete operations
                this.queryChannels({"name": name}).count(function(count) {
                    equal(1, count, "Count of channels is 1");
                });

                this.listChannels().count(function (count) {
                    equal(25, count, "The count of channels is 25");

                });

                this.readChannel(channel._doc).then(function(){
                    this.category = "blue";
                    this.update();
                });

                this.queryChannels({"category": "blue"}).count(function(count) {
                    equal(1, count, "Count of channels with category as blue is 1");
                });

                this.readChannel(channel._doc).del().then(function(){
                    ok(true, "Successfully deleted");

                });

                this.queryChannels({"name": name}).count(function(count) {
                    equal(0, count, "Count of channels is 0 after the delete function");
                });

            });

            this.then(function () {
                success();
            });

            var success = function () {
                start();
            };

        });
    });

}(jQuery) );