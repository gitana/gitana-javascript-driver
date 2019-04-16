(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Team = Gitana.AbstractObject.extend(
    /** @lends Gitana.Team.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Team
         *
         * @param {Gitana.Cluster} cluster
         * @param {Object} teamable
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(cluster, teamable, object)
        {
            this.__teamable = (function() {
                let _teamable = null;
                return function(teamable) {
                    if (!Gitana.isUndefined(teamable)) { _teamable = teamable; }
                    return _teamable;
                };
            })();

            this.__teamable(teamable);

            this.objectType = function() { return "Gitana.Team"; };

            this.getCluster = function()
            {
                return cluster;
            };

            this.base(cluster.getDriver(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().team(this.getCluster(), this.__teamable(), this);
        },

        getUri: function()
        {
            return this.__teamable().getUri() + "/teams/" + this.getKey();
        },

        getType: function()
        {
            return "team";
        },

        /**
         * Delete
         *
         * @chained team
         *
         * @public
         */
        del: function()
        {
            const uriFunction = function()
            {
                return this.getUri();
            };

            // NOTE: pass control back to the teamable
            return this.chainDelete(this.__teamable(), uriFunction);
        },

        /**
         * Reload
         *
         * @chained team
         *
         * @public
         */
        reload: function()
        {
            const uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainReload(null, uriFunction);
        },

        /**
         * Update
         *
         * @chained team
         *
         * @public
         */
        update: function()
        {
            const uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainUpdate(null, uriFunction);
        },

        /**
         * Adds a member to the team.
         *
         * @param {String|Object} principal either the principal object or the principal id
         *
         * @chained team
         */
        addMember: function(principal)
        {
            const self = this;

            const uriFunction = function()
            {
                const principalDomainQualifiedId = self.extractPrincipalDomainQualifiedId(principal);

                return this.getUri() + "/members/add?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Removes a member from the team.
         *
         * @param {String|Object} principal - either the principal object or the principal id
         *
         * @chained team
         */
        removeMember: function(principal)
        {
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return this.getUri() + "/members/remove?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Checks whether a principal is a member of the team.
         *
         * @param {String|Object} principal -either the principal object or the principal id
         * @param callback function(check)
         *
         * @chained team
         */
        hasMember: function(principal, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return this.getUri() + "/members/check";
            };

            const params = {};
            params.id = self.extractPrincipalDomainQualifiedId(principal);

            return this.chainPostResponse(null, uriFunction, params).then(function(response) {
                callback(response.belongs);
            });
        },


        /**
         * Lists members of a team
         *
         * @param pagination
         *
         * @chained principal map
         */
        listMembers: function(pagination)
        {
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return this.getUri() + "/members";
            };

            const chainable = new Gitana.TeamMemberMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Grants an authority to this team.
         *
         * @param authorityId
         *
         * @chained team
         */
        grant: function(authorityId)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/authorities/" + authorityId + "/grant";
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Revokes an authority from this team.
         *
         * @param authorityId
         *
         * @chained team
         */
        revoke: function(authorityId)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/authorities/" + authorityId + "/revoke";
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Loads the authorities for this team and fires them into a callback.
         *
         * @param callback
         *
         * @chained team
         */
        loadAuthorities: function(callback)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/authorities";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["authorities"]);
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////
        //
        // ACCESSORS
        //
        //////////////////////////////////////////////////////////////////////////////////////

        /**
         * Returns the team key
         */
        getKey: function()
        {
            return this.get("key");
        },

        getGroupId: function()
        {
            return this.get("groupId");
        },

        getRoleKeys: function()
        {
            return this.get("roleKeys");
        }



    });

})(window);
