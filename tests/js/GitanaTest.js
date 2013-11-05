GitanaTest = {};

GitanaTest.TEST_CLIENT_KEY = "eb9bcf0b-050d-4931-a11b-2231be0fd168";
GitanaTest.TEST_CLIENT_SECRET = "VrCPFTOx2359VdkwbvQi7xUo8mQu2wWHOW1FmCoSRBQpRRDUMB+T+1oBDd0K+3ToNBVfkIAOptv2JfbaipvhWsu4fnEyr8rlbthABoAgzV0=";

GitanaTest.TEST_USER_CREDENTIALS_KEY = "db7f7538-bc53-410a-a347-f3ebff4b6b59";
GitanaTest.TEST_USER_CREDENTIALS_SECRET = "q8kUSxe+Nr7KF8A2yGYLibrqVcXcB6bktKHNzUGNiT6Gku1rklH0Djt7hsbzhk459IQ7XoW46BxVDfLSYgWo9yhxJUrZNsQG61noPiW3ovY=";

GitanaTest.testClient = function()
{
    var gitana = new Gitana({
        "clientKey": GitanaTest.TEST_CLIENT_KEY,
        "clientSecret": GitanaTest.TEST_CLIENT_SECRET
    });

    return gitana.authenticate({
        "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
        "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
    });
};

GitanaTest.authenticateFullOAuth = function(config)
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
    });
};

GitanaTest.authenticateNewTenant = function(callback)
{
    GitanaTest.authenticateFullOAuth().then(function() {

        // NOTE: this = platform

        var user = null;
        var clientConfig = null
        var tenant = null;

        // create a user
        this.readPrimaryDomain().createUser({
            "name": "test-" + new Date().getTime(),
            "password": "pw"
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
                });

            });

        });

        // sign in as the new client/user
        // note that we're signing in as the user on the tenant platform (which is a copy of the original user)
        this.then(function() {

            new Gitana({
                "clientKey": clientConfig.getKey(),
                "clientSecret": clientConfig.getSecret()
            }).authenticate({
                "username": user.getName(),
                "password": "pw"
            }).then(function() {

                // NOTE: this = platform
                callback.call(this);

            });
        });
    });
};

GitanaTest.authenticate = function(username, password, domain, authFailureHandler)
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
};

var _test = function(name, fn)
{
    console.log("Starting test: " + name);

    test(name, fn);
};

var _asyncTest = function(name, fn)
{
    asyncTest(name, function() {

        console.log("Starting test: " + name);

        fn();
    });
};
