(function(window)
{
    const cache = {};
    const expirationTimes = {};

    /**
     * Simple memory XHR Cache
     *
     * @return {Function}
     */
    Gitana.MemoryXHRCache = function(timeToLiveMilliseconds)
    {
        return function(descriptor, responseObject)
        {
            let key = descriptor.method + "/" + descriptor.url;
            if (descriptor.headers)
            {
                for (const headerName in descriptor.headers)
                {
                    key += "/" + headerName + "=" + descriptor.headers[headerName];
                }
            }

            const now = new Date().getTime();

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
