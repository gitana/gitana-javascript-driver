(function($) {

    module("applicationEmail2");

    // Test case : Application Emails
    _asyncTest("Application Emails 2", function()
    {
        expect(1);

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

                    // create and send email
                    var email = null;
                    this.createEmail({
                        "subject": "Test Email from JavaScript Driver test suite",
                        "to": ["${to1}"],
                        "cc": ["${cc1}", "${cc2}"],
                        "bcc": ["${bcc1}", "${bcc2}"],
                        "body": "Here is a test body: ${var1}",
                        "from": "buildtest@gitanasoftware.com",
                        "property": "v1"
                    }).then(function() {

                        email = this;

                        // use a model
                        var model = {
                            "var1": "value1",
                            "to1": "buildtest@gitanasoftware.com",
                            "cc1": "buildtest@gitanasoftware.com",
                            "cc2": "list-java@cloudcms.com",
                            "bcc1": "buildtest@gitanasoftware.com",
                            "bcc2": "list-java@cloudcms.com"
                        };

                        // now flip around and send the other way
                        this.subchain(emailProvider).send(email, model);

                    });
                });
            });

            this.then(function() {
                ok(true, "Emails sent successfully");
                success();
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
