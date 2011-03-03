(function(window)
{
    window.Gitana.Object.Repository = function(driver, json)
    {
        this.driver = driver;

        // copy json properties into this object
        // this skips methods
        Gitana.copyInto(this, json);

        // api members
        this.branches = function()
        {
            return new Gitana.Service.Branches(repository);
        };
        this.changesets = function()
        {
            return new Gitana.Service.Changesets(repository);
        };
    };

    Gitana.Object.Repository.prototype.getId = function()
    {
        return this["_doc"];
    };

    /**
     * Update
     *
     * @param callback optional method
     */
    Gitana.Object.Repository.prototype.update = function(callback)
    {
        this.driver.repositories().update(this.getId(), callback);
    };

    /**
     * Delete
     *
     * @param callback optional method
     */
    Gitana.Object.Repository.prototype.del = function(callback)
    {
        this.driver.repositories().del(this.getId(), callback);
    };
    
})(window);
