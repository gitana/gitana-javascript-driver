(function($) {

    //
    // Test case : Authentication 7
    //
    // This tests out OAuth authentication and ensures that the GITANA_TICKET cookie is written and that it works
    // after authentication for calls that originate outside of the driver.
    //
    // The GITANA_TICKET cookie is an encrypted cookie that is written by the Gitana server and contains enough
    // information so that the Gitana Server can determine the access token that was issued to the client.  This
    // allows standard GET and POST methods originating from the browser to work against Gitana.
    //
    module("authentication7");

    _asyncTest("Authentication 7", function()
    {
        expect(3);

        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY,
            "clientSecret": GitanaTest.TEST_CLIENT_SECRET
        });

        gitana.authenticate({
            "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
            "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
        }).then(function() {

            // NOTE: this = platform

            ok(true, "Successfully authenticated");

            // make sure we have a GITANA_TICKET cookie
            var cookie = Gitana.readCookie("GITANA_TICKET");
            ok(cookie, "Found a GITANA_TICKET cookie");

            $.ajax("/proxy/repositories", {
                type: "GET",
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    ok(true, "Successfully retrieved a list of repositories via normal Ajax");
                    start();
                },
                xhrFields: {
                    withCredentials: true
                }
                //,       THIS CAUSES IE TO FREAK
                //crossDomain: true
            });
        });
    });

}(jQuery) );