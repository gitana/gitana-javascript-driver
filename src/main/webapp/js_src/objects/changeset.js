(function(window) {
    window.Gitana.Object.Changeset = function(repository, json) {

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

    Gitana.Object.Changeset.prototype.getId = function() {
        return this["_doc"];
    };

    /**
     * Update
     *
     * @param callback optional method
     */
    Gitana.Object.Changeset.prototype.update = function(callback) {
        this.getRepository().changesets().update(this.getId(), this, callback);
    };

    Gitana.Object.Changeset.prototype.getSystemMetadata = function()
    {
        return this.system();
    };

    /**
     * Stringify
     *
     * @param pretty whether to make the output pretty
     */
    Gitana.Object.Changeset.prototype.stringify = function(pretty) {
        return Gitana.stringify(this, pretty);
    };

})(window);
