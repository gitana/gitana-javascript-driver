(function(window) {
    window.Gitana.Object.Node = function(branch, json) {

        // copy json properties into this object
        // this skips methods
        Gitana.copyInto(this, json);
        delete this["_ref"];

        var systemMetadata = {};
        Gitana.copyInto(systemMetadata, this["_system"]);
        delete this["_system"];
        this.system = function() { return systemMetadata; };
        
        // priviledged methods
        this.getDriver = function() { return branch.getRepository().getDriver(); };
        this.getRepository = function() { return branch.getRepository(); };
        this.getBranch = function() { return branch; };
    };

    Gitana.Object.Node.prototype.getId = function() {
        return this["_doc"];
    };

    /**
     * Update
     *
     * @param callback optional method
     */
    Gitana.Object.Node.prototype.update = function(callback) {
        this.getBranch().nodes().update(this.getId(), this, callback);
    };

    /**
     * Delete
     *
     * @param callback optional method
     */
    Gitana.Object.Node.prototype.del = function(callback) {
        this.getBranch().nodes().del(this.getId(), callback);
    };

    /**
     * Children
     *
     * @param callback optional method
     */
    Gitana.Object.Node.prototype.children = function(callback) {
        var _this = this;

        var args = Gitana.makeArray(arguments);

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaGet("/repositories/" + this.repository.getId() + "/branches/" + this.branch.getId() + "/nodes/" + this.getId() + "/children", function(response) {

            var list = [];
            for each (row in response.rows) {
                list[list.length] = new Gitana.Object.Node(_this.branch, row);
            }
            response.list = list;

            // fire the callback
            callback(response);

        }, Gitana.ajaxErrorHandler);
    };

    Gitana.Object.Node.prototype.getFeatureIds = function()
    {
        var featureIds = [];

        if (this["_features"])
        {
            for each (featureId in this["_features"])
            {
                featuresIds[featureIds.length] = featureId;
            }
        }

        return featureIds;
    };

    Gitana.Object.Node.prototype.getFeature = function(featureId)
    {
        var featureConfig = null;

        if (this["_features"])
        {
            featureConfig = this["_features"][featureId];
        }

        return featureConfig;
    };

    Gitana.Object.Node.prototype.removeFeature = function(featureId)
    {
        if (this["_features"])
        {
            if (this["features"][featureId])
            {
                delete this["_features"][featureId];
            }
        }
    };

    Gitana.Object.Node.prototype.addFeature = function(featureId, featureConfig)
    {
        if (!this["_features"])
        {
            this["_features"] = { };
        }

        this["_features"][featureId] = featureConfig;
    };

    Gitana.Object.Node.prototype.getQName = function()
    {
        return this["_qname"];
    };

    Gitana.Object.Node.prototype.getTypeQName = function()
    {
        return this["_type"];
    };

    Gitana.Object.Node.prototype.getSystemMetadata = function()
    {
        return this.system();
    };

    /**
     * Stringify
     *
     * @param pretty whether to make the output pretty
     */
    Gitana.Object.Node.prototype.stringify = function(pretty) {
        return Gitana.stringify(this, pretty);
    };

    Gitana.Object.Node.prototype.data = function() {

        var data = { };
        Gitana.copyInto(this, this);

        // remove extraneous stuff
        delete data["_features"];
        delete data["_features"];
    }


})(window);
