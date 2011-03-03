(function(window)
{
    window.Gitana.Object.Changeset = function(repository, json)
    {
        this.repository = repository;
        this.driver = repository.driver;

        // copy json properties into this object
        // this skips methods
        Gitana.copyInto(this, json);
    };

    Gitana.Object.Changeset.prototype.getId = function()
    {
        return this["_doc"];
    };

})(window);
