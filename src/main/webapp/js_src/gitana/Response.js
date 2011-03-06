(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Response object
     */
    Gitana.Response = Gitana.AbstractObject.extend(
    {
        constructor: function(object)
        {
            this.base(object);
        },

        getId: function()
        {
            return this["_doc"];
        },        

        isStatusDocument: function()
        {
            return (this["ok"] || this["error"]);
        },

        isListDocument: function()
        {
            return this["total_rows"] && this["rows"] && this["offset"];
        },

        isDataDocument: function()
        {
            return (!this.isStatusDocument() && !this.isListDocument());
        },

        isOk: function()
        {
            // assume things are ok
            var ok = true;

            if (this.isStatusDocument()) {
                if (this["ok"] != null) {
                    ok = this["ok"];
                }
            }

            // any document type can specify an error
            if (this["error"]) {
                ok = false;
            }

            return ok;
        },

        isError: function()
        {
            return !this.isOk();
        },

        list: function()
        {
            return this.list;
        }

    });

})(window);
