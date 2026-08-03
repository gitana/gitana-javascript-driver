import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("applicationEmailAttachment1", function() {

    it("Application Email Attachment 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
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
                            "username": process.env.GITANA_TEST_EMAIL_USERNAME,
                            "password": process.env.GITANA_TEST_EMAIL_PASSWORD,
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
                                "to": process.env.GITANA_TEST_EMAIL_TO,
                                "body": "Here is a test body",
                                "from": process.env.GITANA_TEST_EMAIL_FROM,
                                "property": "v1"
                            }).then(function() {
                                email = this;
                            });

                            // send email (email->provider)
                            this.then(function() {
                                this.subchain(emailProvider).send(email, {
                                    "_attachments": [ node.ref() ]
                                }).then(function() {
                                    t.assert.ok(true, "The email was sent successfully");
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
    });
});
