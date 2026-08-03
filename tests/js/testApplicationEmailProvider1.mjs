import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("applicationEmailProvider1", function() {

    it("Application Email Providers 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                var platform = this;

                // create a application
                this.createApplication().then(function() {

                    // NOTE: this = application

                    // create an email provider
                    this.createEmailProvider({
                        "host": "smtp.gmail.com",
                        "username": process.env.GITANA_TEST_EMAIL_USERNAME,
                        "password": process.env.GITANA_TEST_EMAIL_PASSWORD,
                        "smtp_enabled": true,
                        "smtp_requires_auth": true,
                        "smtp_is_secure": true,
                        "smtp_starttls_enabled": true
                    });

                    this.createEmailProvider({
                        "host": "smtp2.gmail.com",
                        "username": process.env.GITANA_TEST_EMAIL_USERNAME,
                        "password": process.env.GITANA_TEST_EMAIL_PASSWORD,
                        "smtp_enabled": true,
                        "smtp_requires_auth": true,
                        "smtp_is_secure": true,
                        "smtp_starttls_enabled": true
                    });

                    this.createEmailProvider({
                        "host": "smtp.gmail.com",
                        "username": process.env.GITANA_TEST_EMAIL_USERNAME,
                        "password": process.env.GITANA_TEST_EMAIL_PASSWORD,
                        "smtp_enabled": false,
                        "smtp_requires_auth": false,
                        "smtp_is_secure": false,
                        "smtp_starttls_enabled": false
                    });

                    // list email providers
                    this.listEmailProviders().count(function(count) {
                        t.assert.equal(count, 3, "Found three email providers");
                    });

                    // query for email providers
                    this.queryEmailProviders({
                        "config.host": "smtp.gmail.com"
                    }).count(function(count) {
                        t.assert.equal(count, 2, "Found two email providers");
                    });

                    // delete an email provider
                    this.queryEmailProviders({
                        "config.host": "smtp2.gmail.com"
                    }).each(function() {
                        this.del();
                    });

                    // list email providers
                    this.listEmailProviders().count(function(count) {
                        t.assert.equal(count, 2, "Found two email providers");
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
});
