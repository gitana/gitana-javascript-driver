(function(window)
{
    window.Gitana.Object.Branch = function(repository, json)
    {
        this.repository = repository;
        this.driver = repository.driver;

        // copy json properties into this object
        // this skips methods
        Gitana.copyInto(this, json);

        // api
        this.nodes = function()
        {
            return new Gitana.Service.Nodes(this);
        }
    };

    Gitana.Object.Branch.prototype.getId = function()
    {
        return this["_doc"];
    };

    /**
     * Update
     *
     * @param callback optional method
     */
    Gitana.Object.Branch.prototype.update = function(callback)
    {
        this.repository.branches().update(this.getId(), callback);
    };

    /**
     * Delete
     *
     * @param callback optional method
     */
    Gitana.Object.Branch.prototype.del = function(callback)
    {
        this.repository.branches().del(this.getId(), callback);
    };

    
})(window);
