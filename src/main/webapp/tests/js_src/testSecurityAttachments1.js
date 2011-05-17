(function($) {

    module("securityAttachments1");

    // Test case : Security Attachments 1
    test("Security Attachments 1", function()
    {
        stop();

        expect(4);

        // user ids
        var userId = "user_" + new Date().getTime();

        // start
        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            // create user
            this.createUser(userId).then(function() {

                // NOTE: this = user

                this.attach("attachment1", "text/plain", "Jimi Hendrix");
                this.attach("attachment2", "text/plain", "Mark Knopfler");
                this.attach("attachment3", "text/plain", "Yngwie Malmsteen");

                this.listAttachments().count(function(count) {

                    // NOTE: this = attachment

                    equals(count, 3, "Found 3 attachments");
                });

                this.listAttachments().each(function() {

                    // NOTE: this = attachment

                    // download
                    this.download(function(data) {
                        ok(data.length > 0, "Data greater than zero");
                    });

                });

                this.then(function() {
                    success();
                });
            });

            var success = function()
            {
                start();
            };
        });
    });

}(jQuery) );
