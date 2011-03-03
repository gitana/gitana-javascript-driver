(function(window)
{
    window.Gitana.Object.Response = function(object)
    {
        // copy object properties into this object
        // this skips methods
        Gitana.copyInto(this, object);
    };

    Gitana.Object.Response.prototype.isStatusDocument = function()
    {
        return (this["ok"] || this["error"]);
    };

    Gitana.Object.Response.prototype.isListDocument = function()
    {
        return this["total_rows"] && this["rows"] && this["offset"];

    };

    Gitana.Object.Response.prototype.isDataDocument = function()
    {
        return (!this.isStatusDocument() && !this.isListDocument());
    };

    Gitana.Object.Response.prototype.isOk = function()
    {
        // assume things are ok
        var ok = true;

        if (this.isStatusDocument())
        {
            if (this["ok"] != null)
            {
                ok = this["ok"];
            }
        }

        // any document type can specify an error
        if (this["error"])
        {
            ok = false;
        }

        return ok;
    };

    Gitana.Object.Response.prototype.isError = function()
    {
        return !this.isOk();
    };

    Gitana.Object.Response.prototype.list = function()
    {
        return this.list;        
    };

    Gitana.Object.Response.prototype.getId = function()
    {
        return this["_doc"];
    };

})(window);
