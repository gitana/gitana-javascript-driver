(function($) {

    module("applicationEmailProvider1");

    // Test case : Application Email Providers
    _asyncTest("Application Email Providers 1", function()
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
                this.createEmailProvider({
                    "host": "smtp.gmail.com",
                    "username": "buildtest@gitanasoftware.com",
                    "password": "buildt@st11",
                    "smtp_enabled": true,
                    "smtp_requires_auth": true,
                    "smtp_is_secure": true,
                    "smtp_starttls_enabled": true
                });

                this.createEmailProvider({
                    "host": "smtp2.gmail.com",
                    "username": "buildtest@gitanasoftware.com",
                    "password": "buildt@st11",
                    "smtp_enabled": true,
                    "smtp_requires_auth": true,
                    "smtp_is_secure": true,
                    "smtp_starttls_enabled": true
                });

                this.createEmailProvider({
                    "host": "smtp.gmail.com",
                    "username": "buildtest@gitanasoftware.com",
                    "password": "buildt@st11",
                    "smtp_enabled": false,
                    "smtp_requires_auth": false,
                    "smtp_is_secure": false,
                    "smtp_starttls_enabled": false
                });

                // list email providers
                this.listEmailProviders().count(function(count) {
                    equal(count, 3, "Found three email providers");
                });

                // query for email providers
                this.queryEmailProviders({
                    "host": "smtp.gmail.com"
                }).count(function(count) {
                    equal(count, 2, "Found two email providers");
                });

                // delete an email provider
                this.queryEmailProviders({
                    "host": "smtp2.gmail.com"
                }).each(function() {
                    this.del();
                });

                // list email providers
                this.listEmailProviders().count(function(count) {
                    equal(count, 2, "Found two email providers");
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
