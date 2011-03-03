(function(window)
{
    window.Gitana.Object.Node = function(branch, json)
    {
        this.branch = branch;
        this.repository = branch.repository;
        this.driver = branch.driver;

        // copy json properties into this object
        // this skips methods
        Gitana.copyInto(this, json);
    };

    Gitana.Object.Node.prototype.getId = function()
    {
        return this["_doc"];
    };

    /**
     * Update
     *
     * @param callback optional method
     */
    Gitana.Object.Node.prototype.update = function(callback)
    {
        this.branch.nodes().update(this.getId(), callback);
    };

    /**
     * Delete
     *
     * @param callback optional method
     */
    Gitana.Object.Node.prototype.del = function(callback)
    {
        this.branch.nodes().del(this.getId(), callback);
    };


})(window);
