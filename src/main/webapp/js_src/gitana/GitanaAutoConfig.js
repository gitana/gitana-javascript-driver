(function(window)
{
    // if we're running on the Cloud CMS hosted platform, we can auto-acquire the client key that we should use
    Gitana.AUTO_CONFIG_HANDLER = function(config)
    {
        Gitana.DEFAULT_CONFIG.clientId = config.clientKey;
        Gitana.DEFAULT_CONFIG.applicationId = config.applicationId;
    };
    (function()  {

        var uri = window.location.href;
        var z1 = uri.indexOf(window.location.pathname);
        z1 = uri.indexOf("/", z1 + 2);
        if (z1 > -1)
        {
            uri = uri.substring(0, z1);
        }

        /*
        // test support
        var x = uri.indexOf(".test.gitanacloud.com");
        if (x > -1)
        {
            uri = uri.substring(0, x) + ".gitanacloud.com" + uri.substring(x + 21);

            x = uri.indexOf(":");
            if (x > -1)
            {
                uri = uri.substring(0,x) + uri.substring(uri.indexOf("/", x + 2));
            }
        }
        */

        if (uri.indexOf("gitanacloud.com") > -1)
        {
            // call over to gitana and
            new Gitana.Http().request({
                //"url": "/proxy/pub/driver?uri=" + Gitana.Http.URLEncode(uri) + "&callback=Gitana.AUTO_CONFIG_HANDLER",
                "url": "/proxy/pub/driver?uri=" + Gitana.Http.URLEncode(uri),
                "success": function(response)
                {
                    var object = JSON.parse(response.text);
                    Gitana.AUTO_CONFIG_HANDLER(object);
                }
            });
        }
    }());

})(window);