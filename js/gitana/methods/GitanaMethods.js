(function(window)
{
    Gitana.Methods = {};

    /**
     * Produces the common function to handle listAttachments() on various attachables within Gitana.
     *
     * @param [mapClass] map implementation class (if none provided, uses Gitana.BinaryAttachmentMap)
     *
     * @return {Function}
     */
    Gitana.Methods.listAttachments = function(mapClass) {

        if (!mapClass) {
            mapClass = Gitana.BinaryAttachmentMap;
        }

        return function(local) {

            var self = this;

            var result = this.subchain(new mapClass(this));
            if (!local)
            {
                // front-load some work that fetches from remote server
                result.then(function() {

                    var chain = this;

                    self.getDriver().gitanaGet(self.getUri() + "/attachments", null, {}, function(response) {
                        chain.handleResponse(response);
                        chain.next();
                    });

                    return false;
                });
            }
            else
            {
                // try to populate the map from our cached values on the node (if they exist)
                var existingMap = self.getSystemMetadata()["attachments"];
                if (existingMap)
                {
                    // attachments that come off of system() don't have "attachmentId" on their json object
                    // instead, the "attachmentId" is the key into the map.

                    // so here, in terms of normalizing things, we copy "attachmentId" into the json object
                    for (var key in existingMap)
                    {
                        var value = result[key];
                        value["attachmentId"] = key;
                    }
                }

                //result.handleResponse(existingMap);
            }

            return result;
        };
    };

    /**
     * Produces the common function to handle attach() of attachments to an attachable within Gitana.
     *
     * @param [attachmentClass] attachment implementation class (if none provided, uses Gitana.BinaryAttachment)
     * @param [paramsFunction] optional population function for url params
     *
     * @return {Function}
     */
    Gitana.Methods.attach = function(attachmentClass, paramsFunction) {

        if (!attachmentClass) {
            attachmentClass = Gitana.BinaryAttachment;
        }

        return function(attachmentId, contentType, data)
        {
            var self = this;

            if (!attachmentId)
            {
                attachmentId = "default";
            }

            // the thing we're handing back
            var result = this.subchain(new attachmentClass(this));

            // preload some work onto a subchain
            result.then(function() {

                // params
                var params = {};
                if (paramsFunction) {
                    paramsFunction(params);
                }

                // upload the attachment
                var uploadUri = self.getUri() + "/attachments/" + attachmentId;

                // if data is a Node read stream, we use a helper function possibly to conduct the upload
                if (data && data.read && typeof(data.read) === "function" && Gitana.streamUpload)
                {
                    this.subchain(self).then(function() {

                        var chain = this;

                        uploadUri = self.getDriver().baseURL + uploadUri;
                        Gitana.streamUpload(self.getDriver(), data, uploadUri, contentType, function(err) {

                            // read back attachment information and plug onto result
                            Chain(self).reload().then(function() {
                                this.listAttachments().then(function() {
                                    this.select(attachmentId).then(function () {
                                        result.handleResponse(this);
                                        chain.next();
                                    });
                                });
                            });
                        });

                        return false;
                    });
                }
                else
                {
                    this.chainUpload(this, uploadUri, params, contentType, data).then(function () {

                        // read back attachment information and plug onto result
                        this.subchain(self).listAttachments().then(function () {

                            // TODO: update attachment information on attachable.system() ?

                            this.select(attachmentId).then(function () {
                                result.handleResponse(this);
                            });
                        });
                    });
                }
            });

            return result;
        };
    };

    /**
     * Produces the common function to handle unattach() of attachments from an attachable within Gitana.
     *
     * @return {Function}
     */
    Gitana.Methods.unattach = function()
    {
        return function(attachmentId) {

            return this.then(function() {
                this.chainDelete(this, this.getUri() + "/attachments/" + attachmentId).then(function() {
                    // TODO
                });
            });
        };
    };

    Gitana.Methods.getPreviewUri = function(prefix)
    {
        if (!prefix) {
            prefix = "preview";
        }

        return function(name, config) {

            var url = this.getDriver().baseURL + this.getUri() + "/" + prefix + "/" + name;

            if (config)
            {
                var first = true;

                for (var key in config)
                {
                    if (first)
                    {
                        url += "?";
                    }
                    else
                    {
                        url += "&";
                    }

                    var value = config[key];
                    if (value)
                    {
                        url += key + "=" + value;
                    }

                    first = false;
                }
            }

            return url;
        };
    };

})(window);