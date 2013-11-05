(function($) {

    module("applicationEmail1");

    // Test case : Application Emails
    _asyncTest("Application Emails 1", function()
    {
        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var platform = this;

            // create a application
            this.createApplication().then(function() {

                // NOTE: this = application

                // create an email provider
                var emailProvider = null;
                this.createEmailProvider({
                    "host": "smtp.gmail.com",
                    "username": "buildtest@gitanasoftware.com",
                    "password": "buildt@st11",
                    "smtp_enabled": true,
                    "smtp_requires_auth": true,
                    "smtp_is_secure": true,
                    "smtp_starttls_enabled": true
                }).then(function() {
                    emailProvider = this;
                });

                this.then(function() {

                    // create three emails
                    this.createEmail({
                        "to": "buildtest@gitanasoftware.com",
                        "body": "Here is a test body",
                        "from": "buildtest@gitanasoftware.com",
                        "property": "v1"
                    });
                    this.createEmail({
                        "to": "buildtest@gitanasoftware.com",
                        "body": "Here is a test body",
                        "from": "buildtest@gitanasoftware.com",
                        "property": "v2"
                    });
                    this.createEmail({
                        "to": "buildtest@gitanasoftware.com",
                        "body": "Here is a test body",
                        "from": "buildtest@gitanasoftware.com",
                        "property": "v1"
                    });

                    // query for emails
                    this.queryEmails({
                        "property": "v1"
                    }).count(function(count) {
                        equal(count, 2, "Found two emails");
                    });

                    this.queryEmails({
                        "property": "v2"
                    }).count(function(count) {
                        equal(count, 1, "Found one emails");
                    });

                    // now delete an email
                    this.queryEmails({
                        "property": "v2"
                    }).each(function() {
                        this.del();
                    });

                    this.listEmails().count(function(count) {
                        equal(count, 2, "Found two emails");
                    });
                });

                this.then(function() {

                    // create and send email
                    var email = null;
                    this.createEmail({
                        "to": "buildtest@gitanasoftware.com",
                        "body": "Here is a test body",
                        "from": "buildtest@gitanasoftware.com",
                        "property": "v1"
                    }).then(function() {
                        email = this;
                    });

                    // send email (email->provider)
                    this.then(function() {
                        this.subchain(email).send(emailProvider);

                        // create another email
                        var email2 = null;
                        this.createEmail({
                            "to": "buildtest@gitanasoftware.com",
                            "body": "Here is a test body",
                            "from": "buildtest@gitanasoftware.com",
                            "property": "v1"
                        }).then(function() {
                            email2 = this;

                            // now flip around and send the other way
                            this.subchain(emailProvider).send(email2);

                        });

                    });
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

}(jQuery) );
