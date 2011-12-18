GitanaTest = {};

GitanaTest.TEST_CONSUMER_KEY = "eb9bcf0b-050d-4931-a11b-2231be0fd168";
GitanaTest.TEST_CONSUMER_SECRET = "VrCPFTOx2359VdkwbvQi7xUo8mQu2wWHOW1FmCoSRBQpRRDUMB+T+1oBDd0K+3ToNBVfkIAOptv2JfbaipvhWsu4fnEyr8rlbthABoAgzV0=";

GitanaTest.TEST_ACCESS_TOKEN_KEY = "db7f7538-bc53-410a-a347-f3ebff4b6b59";
GitanaTest.TEST_ACCESS_TOKEN_SECRET = "q8kUSxe+Nr7KF8A2yGYLibrqVcXcB6bktKHNzUGNiT6Gku1rklH0Djt7hsbzhk459IQ7XoW46BxVDfLSYgWo9yhxJUrZNsQG61noPiW3ovY=";

GitanaTest.testConsumer = function()
{
    var gitana = new Gitana({
        "consumerKey": GitanaTest.TEST_CONSUMER_KEY,
        "consumerSecret": GitanaTest.TEST_CONSUMER_SECRET
    });

    return gitana.authenticate({
        "accessTokenKey": GitanaTest.TEST_ACCESS_TOKEN_KEY,
        "accessTokenSecret": GitanaTest.TEST_ACCESS_TOKEN_SECRET
    });
};

GitanaTest.authenticateFullOAuth = function()
{
    var gitana = new Gitana({
        "consumerKey": GitanaTest.TEST_CONSUMER_KEY,
        "consumerSecret": GitanaTest.TEST_CONSUMER_SECRET
    });

    return gitana.authenticate({
        "accessTokenKey": GitanaTest.TEST_ACCESS_TOKEN_KEY,
        "accessTokenSecret": GitanaTest.TEST_ACCESS_TOKEN_SECRET
    });
};

GitanaTest.authenticate = function(username, password)
{
    var gitana = new Gitana({
        "consumerKey": GitanaTest.TEST_CONSUMER_KEY,
        "consumerSecret": GitanaTest.TEST_CONSUMER_SECRET
    });

    return gitana.authenticate({
        "username": username,
        "password": password
    });
};