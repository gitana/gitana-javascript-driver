(function(window) {
    window.Gitana.Object.System = function(object) {
        
        // copy object properties into this object
        // this skips methods
        Gitana.copyInto(this, object);
    };

    Gitana.Object.System.prototype.getChangesetId = function()
    {
        return this["changeset"];
    };

    Gitana.Object.System.prototype.getCreatedBy = function()
    {
        return this["created_by"];
    };

    Gitana.Object.System.prototype.getModifiedBy = function()
    {
        return this["modified_by"];
    };

    Gitana.Object.System.prototype.getCreatedOn = function()
    {
        return this["created_on"];
    };

    Gitana.Object.System.prototype.getModifiedOn = function()
    {
        return this["modified_on"];
    };
    
})(window);
