GitanaTest = {};

GitanaTest.TEST_CLIENT_ID = "eb9bcf0b-050d-4931-a11b-2231be0fd168";
GitanaTest.TEST_CLIENT_SECRET = "VrCPFTOx2359VdkwbvQi7xUo8mQu2wWHOW1FmCoSRBQpRRDUMB+T+1oBDd0K+3ToNBVfkIAOptv2JfbaipvhWsu4fnEyr8rlbthABoAgzV0=";

GitanaTest.TEST_USER_CREDENTIALS_KEY = "db7f7538-bc53-410a-a347-f3ebff4b6b59";
GitanaTest.TEST_USER_CREDENTIALS_SECRET = "q8kUSxe+Nr7KF8A2yGYLibrqVcXcB6bktKHNzUGNiT6Gku1rklH0Djt7hsbzhk459IQ7XoW46BxVDfLSYgWo9yhxJUrZNsQG61noPiW3ovY=";

GitanaTest.testClient = function()
{
    var gitana = new Gitana({
        "clientId": GitanaTest.TEST_CLIENT_ID,
        "clientSecret": GitanaTest.TEST_CLIENT_SECRET
    });

    return gitana.authenticate({
        "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
        "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
    });
};

GitanaTest.authenticateFullOAuth = function()
{
    var gitana = new Gitana({
        "clientId": GitanaTest.TEST_CLIENT_ID,
        "clientSecret": GitanaTest.TEST_CLIENT_SECRET
    });

    return gitana.authenticate({
        "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
        "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
    });
};

GitanaTest.authenticate = function(username, password, domain, authFailureHandler)
{
    var gitana = new Gitana({
        "clientId": GitanaTest.TEST_CLIENT_ID,
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
