(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Wraps the system metadata for objects in the gitana repository
     */
    Gitana.SystemMetadata = Gitana.AbstractObject.extend(
    {
        constructor: function(object)
        {
            this.base(object);
        },

        getChangesetId: function()
        {
            return this["changeset"];
        },

        getCreatedBy: function()
        {
            return this["created_by"];
        },

        getModifiedBy: function()
        {
            return this["modified_by"];
        },

        getCreatedOn: function()
        {
            return this["created_on"];
        },

        getModifiedOn: function()
        {
            return this["modified_on"];
        }
        
    });
    
})(window);
