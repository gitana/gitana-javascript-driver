(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.DomainGroup =
    {
        TYPE: "GROUP",

        ref: function()
        {
            return "group://" + this.getPlatformId() + "/" + this.getDomainId() + "/" + this.getId();
        },

        /**
         * Reads the group node for this user.
         *
         * @param branch
         * @param createIfNotFound
         *
         * @chained person
         * @public
         */
        readGroupNode: function(branch, createIfNotFound)
        {
            // what we hand back
            const result = this.subchain(this.getFactory().node(branch, "n:group"));

            // work
            result.subchain(branch).readGroupNode(this.getId(), createIfNotFound).then(function() {
                result.handleResponse(this);
            });

            return result;
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
         * @param {Object} pagination
         */
        listMembers: function(filter, indirect, pagination)
        {
            const self = this;

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }
            if (filter)
            {
                params["filter"] = filter;
            }
            if (indirect)
            {
                params["indirect"] = true;
            }

            const uriFunction = function()
            {
                return self.getUri() + "/members";
            };

            const chainable = this.getFactory().domainPrincipalMap(this.getDomain());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Acquires a list of all of the users who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param {Boolean} inherit whether to include members that inherit through child groups
         * @param {Object} pagination
         */
        listUsers: function()
        {
            let inherit = false;
            let pagination = null;
            const args = Gitana.makeArray(arguments);
            const a1 = args.shift();
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
         * @param {Boolean} inherit whether to include members that inherit through child groups
         * @param {Object} pagination
         */
        listGroups: function()
        {
            let inherit = false;
            let pagination = null;
            const args = Gitana.makeArray(arguments);
            const a1 = args.shift();
            if (Gitana.isBoolean(a1))
            {
                inherit = a1;
                pagination = args.shift();
            }
            else
            {
                pagination = a1;
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
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            return this.chainPostEmpty(null, this.getUri() + "/members/add?id=" + principalDomainQualifiedId);
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
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            return this.chainPostEmpty(null, this.getUri() + "/members/remove?id=" + principalDomainQualifiedId);
        }

    };

})(window);
