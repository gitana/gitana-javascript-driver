(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Principal = Gitana.AbstractObject.extend(
    /** @lends Gitana.Principal.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Principal
         *
         * @param {Gitana.Server} server
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.Principal";
        },

        /**
         * @returns {String} the principal id
         */
        getPrincipalId: function()
        {
            return this.get("principal-id");
        },

        /**
         * @returns {String} the principal type ("user" or "group")
         */
        getPrincipalType: function()
        {
            return this.get("principal-type");
        },

        /**
         * Acquires the groups that contain this principal
         *
         * @chained principal map
         *
         * @public
         *
         * @param {Boolean} indirect whether to consider indirect groups
         */
        listMemberships: function(indirect)
        {
            var _this = this;

            // uri
            var uri = "/security/" + this.getPrincipalType().toLowerCase() + "s/" + _this.getPrincipalId() + "/memberships";
            if (indirect)
            {
                uri = uri + "?indirect=true";
            }

            var chainable = this.getFactory().principalMap(this.getServer());
            return this.chainGet(chainable, uri);
        }


    });

})(window);
