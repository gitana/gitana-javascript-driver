(function($) {

    module("applicationEmailAttachment1");

    // Test case : Application Email Attachment
    _asyncTest("Application Email Attachment 1", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var platform = this;

            var node = null;
            // create a repository and node
            this.createRepository().readBranch("master").createNode().then(function() {
                node = this;

                // attach "default"
                this.attach("default", "text/plain", "sample attachment");
            });

            this.then(function() {

                // create an application
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
                            "to": "buildtest@gitanasoftware.com",
                            "body": "Here is a test body",
                            "from": "buildtest@gitanasoftware.com",
                            "property": "v1"
                        }).then(function() {
                            email = this;
                        });

                        // send email (email->provider)
                        this.then(function() {
                            this.subchain(emailProvider).send(email, {
                                "_attachments": [ node.ref() ]
                            }).then(function() {
                                ok(true, "The email was sent successfully");
                            });
                        });

                        // all done
                        this.then(function() {
                            success();
                        });
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
