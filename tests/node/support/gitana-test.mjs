/**
 * Shared authentication helpers for the test suite.
 *
 * Converted from the former tests/js/GitanaTest.js. The QUnit-specific parts of
 * that file (_test, _asyncTest, QUnit.config) are gone - tests now use node:test
 * directly. Credentials come from tests/gitana.json rather than being hardcoded.
 */

import { Gitana } from "./driver.mjs";
import { credentials, baseURL } from "./config.mjs";

// every `new Gitana({clientKey, clientSecret})` below omits baseURL and would
// otherwise fall back to the browser-only "/proxy" default
Gitana.DEFAULT_CONFIG = { "baseURL": baseURL };

export const GitanaTest = {

    TEST_CLIENT_KEY: credentials ? credentials.clientKey : null,
    TEST_CLIENT_SECRET: credentials ? credentials.clientSecret : null,

    TEST_USER_CREDENTIALS_KEY: credentials ? credentials.username : null,
    TEST_USER_CREDENTIALS_SECRET: credentials ? credentials.password : null,

    testClient: function()
    {
        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY,
            "clientSecret": GitanaTest.TEST_CLIENT_SECRET
        });

        return gitana.authenticate({
            "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
            "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
        });
    },

    authenticateFullOAuth: function(config, failureFn)
    {
        if (!config)
        {
            config = {};
        }

        config["clientKey"] = GitanaTest.TEST_CLIENT_KEY;
        config["clientSecret"] = GitanaTest.TEST_CLIENT_SECRET;

        var gitana = new Gitana(config);

        return gitana.authenticate({
            "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
            "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
        }, failureFn);
    },

    authenticateNewTenant: function(callback, tenantSetupCallback)
    {
        if (!tenantSetupCallback) {
            tenantSetupCallback = function(tenant, done) {
                done();
            };
        }

        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform
            var platform = this;

            var user = null;
            var clientConfig = null;
            var tenant = null;

            // create a user
            this.readPrimaryDomain().createUser({
                "name": "test-" + new Date().getTime(),
                "password": "pw123456"
            }).then(function() {
                user = this;
            });

            // create a tenant for this user
            this.then(function() {

                this.readRegistrar("default").createTenant(user, "unlimited").then(function() {

                    // NOTE: this = tenant
                    tenant = this;

                    // read the default client
                    this.readDefaultAllocatedClientObject(function(theClientConfig) {
                        clientConfig = theClientConfig;

                        // tenant setup callback
                        tenantSetupCallback(tenant, function() {

                            // sign in as the new client/user
                            // note that we're signing in as the user on the tenant platform (which is a copy of the original user)
                            new Gitana({
                                "clientKey": clientConfig.getKey(),
                                "clientSecret": clientConfig.getSecret()
                            }).authenticate({
                                "username": user.getName(),
                                "password": "pw123456"
                            }).then(function() {

                                // NOTE: this = platform
                                callback.call(this);

                            });
                        });
                    });

                });
            });
        });
    },

    authenticate: function(username, password, domain, authFailureHandler)
    {
        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY,
            "clientSecret": GitanaTest.TEST_CLIENT_SECRET
        });

        if (domain)
        {
            username = domain + "/" + username;
        }

        return gitana.authenticate({
            "username": username,
            "password": password
        }, authFailureHandler);
    }
};
