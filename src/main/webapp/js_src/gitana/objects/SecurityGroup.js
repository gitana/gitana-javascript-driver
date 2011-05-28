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
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/security/groups/" + this.getId();
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
         * @param {String} filter type of principal to hand back ("user" or "group")
         * @param {Boolean} indirect whether to include members that inherit through child groups
         * @param [Object] pagination
         */
        listMembers: function(filter, indirect, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }
            params["filter"] = filter;
            if (indirect)
            {
                params["indirect"] = true;
            }

            var uriFunction = function()
            {
                return "/security/groups/" + self.getPrincipalId() + "/members";
            };

            var chainable = this.getFactory().principalMap(this.getServer());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Acquires a list of all of the users who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param [Boolean] inherit whether to include members that inherit through child groups
         * @param [Object] pagination
         */
        listUsers: function()
        {
            var inherit = false;
            var pagination = null;
            var args = Gitana.makeArray(arguments);
            var a1 = args.shift();
            if (Gitana.isBoolean(a1))
            {
                inherit = a1;
                pagination = args.shift();
            }
            else
            {
                pagination = args.shift();
            }

            return this.listMembers("user", inherit, pagination);
        },

        /**
         * Acquires a list of all of the groups who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param [Boolean] inherit whether to include members that inherit through child groups
         * @param [Object] pagination
         */
        listGroups: function()
        {
            var inherit = false;
            var pagination = null;
            var args = Gitana.makeArray(arguments);
            var a1 = args.shift();
            if (Gitana.isBoolean(a1))
            {
                inherit = a1;
                pagination = args.shift();
            }
            else
            {
                pagination = args.shift();
            }

            return this.listMembers("group", inherit, pagination);
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
