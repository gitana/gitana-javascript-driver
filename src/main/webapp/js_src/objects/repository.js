(function(window) {
    window.Gitana.Object.Repository = function(driver, json) {

        // copy json properties into this object
        // this skips methods
        Gitana.copyInto(this, json);
        delete this["_ref"];

        var systemMetadata = {};
        Gitana.copyInto(systemMetadata, this["_system"]);
        delete this["_system"];
        this.system = function() { return systemMetadata; };

        // priviledged methods
        this.getDriver = function() { return driver; };
    };

    Gitana.Object.Repository.prototype.branches = function() {
        return new Gitana.Service.Branches(this);
    };

    Gitana.Object.Repository.prototype.changesets = function() {
        return new Gitana.Service.Changesets(this);
    };

    Gitana.Object.Repository.prototype.getId = function() {
        return this["_doc"];
    };

    /**
     * Update
     *
     * @param callback optional method
     */
    Gitana.Object.Repository.prototype.update = function(callback) {
        this.getDriver().repositories().update(this.getId(), this, callback);
    };

    /**
     * Delete
     *
     * @param callback optional method
     */
    Gitana.Object.Repository.prototype.del = function(callback) {
        this.getDriver().repositories().del(this.getId(), callback);
    };

    Gitana.Object.Repository.prototype.getSystemMetadata = function()
    {
        return this.system();
    };

    /**
     * Stringify
     *
     * @param pretty whether to make the output pretty
     */
    Gitana.Object.Repository.prototype.stringify = function(pretty) {
        return Gitana.stringify(this, pretty);
    };

})(window);
