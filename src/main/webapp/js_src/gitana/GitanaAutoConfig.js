(function(window)
{
    // if we're running on the Cloud CMS hosted platform, we can auto-acquire the client key that we should use
    if (!Gitana.AUTO_CONFIG_HANDLER)
    {
        Gitana.AUTO_CONFIG_HANDLER = function(config)
        {
            Gitana.DEFAULT_CONFIG.clientId = config.clientKey;
            Gitana.DEFAULT_CONFIG.applicationId = config.applicationId;
        };
    }
    (function()  {

        var uri = window.location.href;
        var z1 = uri.indexOf(window.location.pathname);
        z1 = uri.indexOf("/", z1 + 2);
        if (z1 > -1)
        {
            uri = uri.substring(0, z1);
        }

        if (uri.indexOf("gitanacloud.com") > -1)
        {
            // call over to gitana and
            new Gitana.Http().request({
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