(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.Response = Base.extend(
    /** @lends Gitana.Response.prototype */
    {
        /**
         * @constructs
         *
         * @class Gitana Response that wraps a response document from the Gitana server.
         *
         * @param {Object} object json response object
         */
        constructor: function(object)
        {
            Gitana.copyInto(this, object);
        },

        /**
         * Gets the id ("_doc") field of the response (if one is available).
         *
         * @public
         *
         * @returns {String} id
         */
        getId: function()
        {
            return this["_doc"];
        },

        /**
         * Indicates whether this response is a Status Document.
         *
         * @public
         *
         * @returns {Boolean} whether this is a status document
         */
        isStatusDocument: function()
        {
            return (this["ok"] || this["error"]);
        },

        /**
         * Indicates whether this response is a List Document.
         *
         * @public
         *
         * @returns {Boolean} whether this is a list document
         */
        isListDocument: function()
        {
            return this["total_rows"] && this["rows"] && this["offset"];
        },

        /**
         * Indicates whether this response is a Data Document.
         *
         * @public
         *
         * @returns {Boolean} whether this is a data document
         */
        isDataDocument: function()
        {
            return (!this.isStatusDocument() && !this.isListDocument());
        },

        /**
         * Indicates whether the response is "ok".
         *
         * @public
         *
         * @returns {Boolean} whether the response is "ok"
         */
        isOk: function()
        {
            // assume things are ok
            let ok = true;

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

        /**
         * Indicates whetehr the response is in an error state.
         *
         * @public
         *
         * @returns {Boolean} whether the response is in an error state
         */
        isError: function()
        {
            return !this.isOk();
        }

    });

})(window);
