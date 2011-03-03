(function(window) {
    window.Gitana.Object.Branch = function(repository, json) {

        // copy json properties into this object
        // this skips methods
        Gitana.copyInto(this, json);
        delete this["_ref"];

        var systemMetadata = {};
        Gitana.copyInto(systemMetadata, this["_system"]);
        delete this["_system"];
        this.system = function() { return systemMetadata; };

        // priviledged methods
        this.getDriver = function() { return repository.getDriver(); };
        this.getRepository = function() { return repository; };
    };

    Gitana.Object.Branch.prototype.nodes = function() {
        return new Gitana.Service.Nodes(this);
    };

    Gitana.Object.Branch.prototype.getId = function() {
        return this["_doc"];
    };

    /**
     * Update
     *
     * @param callback optional method
     */
    Gitana.Object.Branch.prototype.update = function(callback) {
        this.getRepository().branches().update(this.getId(), this, callback);
    };

    /**
     * Delete
     *
     * @param callback optional method
     */
    Gitana.Object.Branch.prototype.del = function(callback) {
        this.getRepository().branches().del(this.getId(), callback);
    };

    Gitana.Object.Branch.prototype.getSystemMetadata = function()
    {
        return this.system();
    };    

    /**
     * Stringify
     *
     * @param pretty whether to make the output pretty
     */
    Gitana.Object.Branch.prototype.stringify = function(pretty) {
        return Gitana.stringify(this, pretty);
    };

})(window);
