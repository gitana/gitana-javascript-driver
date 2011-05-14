(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.SecurityGroup = Gitana.Principal.extend(
    /** @lends Gitana.SecurityGroup.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Principal
         *
         * @class Group
         *
         * @param {Gitana.Server} server
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.SecurityGroup";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().securityGroup(this.getServer(), this.object);
        },

        /**
         * Delete
         *
         * @chained server
         *
         * @public
         */
        del: function()
        {
            // NOTE: pass control back to the server
            return this.chainDelete(this.getServer(), "/security/groups/" + this.getId());
        },

        /**
         * Reload
         *
         * @chained security group
         *
         * @public
         */
        reload: function()
        {
            return this.chainReload(this.clone(), "/security/groups/" + this.getId());
        },

        /**
         * Update
         *
         * @chained security group
         *
         * @public
         */
        update: function()
        {
            return this.chainUpdate(this.clone(), "/security/groups/" + this.getId());
        },

        /**
         * Acquires a list of all of the members who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param [String] filter type of principal to hand back ("user" or "group")
         * @param [Boolean] indirect whether to include members that inherit through child groups
         */
        listMembers: function()
        {
            var self = this;

            var args = Gitana.makeArray(arguments);

            var uriFunction = function(args)
            {
                return function() {
                    var indirect = false;
                    var filter = null;

                    var a1 = args.shift();
                    if (a1)
                    {
                        if (Gitana.isString(a1))
                        {
                            filter = a1;
                            indirect = args.shift();
                        }
                        else
                        {
                            indirect = a1;
                        }
                    }

                    var uri = "/security/groups/" + self.getPrincipalId() + "/members?a=1";
                    if (filter)
                    {
                        uri = uri + "&filter=" + filter;
                    }
                    if (indirect)
                    {
                        uri = uri + "&indirect=true";
                    }

                    return uri;
                };
            }(args);

            var chainable = this.getFactory().principalMap(this.getServer());
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Acquires a list of all of the users who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param [Boolean] inherit whether to include members that inherit through child groups
         */
        listUsers: function(inherit)
        {
            return this.listMembers("user", inherit);
        },

        /**
         * Acquires a list of all of the groups who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param [Boolean] inherit whether to include members that inherit through child groups
         */
        listGroups: function(inherit)
        {
            return this.listMembers("group", inherit);
        },

        /**
         * Adds a principal as a member of this group.
         *
         * @chained current group
         *
         * @public
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        addMember: function(principal)
        {
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/security/groups/" + this.getId() + "/add/" + principalId);
        },

        /**
         * Removes a principal as a member of this group.
         *
         * @chained current group
         *
         * @public
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        removeMember: function(principal)
        {
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/security/groups/" + this.getId() + "/remove/" + principalId);
        }

    });

})(window);
