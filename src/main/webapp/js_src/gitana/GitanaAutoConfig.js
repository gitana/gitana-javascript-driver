(function(window)
{
    // if we're running on the Cloud CMS hosted platform, we can auto-acquire the client key that we should use
    (function()  {

        var uri = window.location.href;
        var z1 = uri.indexOf(window.location.pathname);
        z1 = uri.indexOf("/", z1 + 2);
        if (z1 > -1)
        {
            uri = uri.substring(0, z1);
        }

        if (uri.indexOf("cloudcms.net") > -1)
        {
            Gitana.autoConfigUri = uri;
        }

    }());

})(window);