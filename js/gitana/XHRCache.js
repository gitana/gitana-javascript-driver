(function(window)
{
    var cache = {};
    var expirationTimes = {};

    /**
     * Simple memory XHR Cache
     *
     * @return {Function}
     */
    Gitana.MemoryXHRCache = function(timeToLiveMilliseconds)
    {
        return function(descriptor, responseObject)
        {
            var key = descriptor.method + "/" + descriptor.url;
            if (descriptor.headers)
            {
                for (var headerName in descriptor.headers)
                {
                    key += "/" + headerName + "=" + descriptor.headers[headerName];
                }
            }

            var now = new Date().getTime();

            if (responseObject)
            {
                cache[key] = responseObject;
                expirationTimes[key] = now + timeToLiveMilliseconds;
            }

            responseObject = cache[key];

            if (!expirationTimes[key] || expirationTimes[key] < now)
            {
                delete cache[key];
                delete expirationTimes[key];

                responseObject = null;
            }

            return responseObject;
        };
    };

})(window);
