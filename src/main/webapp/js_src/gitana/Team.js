(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Team = Gitana.AbstractObject.extend(
    /** @lends Gitana.Team.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Job
         *
         * @param {Gitana.Cluster} cluster
         * @param {Object} teamable
         * @param {String} teamKey
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(cluster, teamable, teamKey, object)
        {
            this.base(cluster.getDriver(), object);

            this.objectType = "Gitana.Team";

            this.teamable = teamable;
            this.teamKey = teamKey;

            this.getCluster = function()
            {
                return cluster;
            };
        },

        getUri: function()
        {
            return this.teamable.getUri() + "/teams/" + this.teamKey;
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
            var uriFunction = function()
            {
                return this.getUri();
            };

            // NOTE: pass control back to the teamable
            return this.chainDelete(this.teamable, uriFunction);
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
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainReload(this.clone(), uriFunction);
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
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },

        /**
         * Adds a member to the team.
         *
         * @param {String|Object} either the principal object or the principal id
         *
         * @chained team
         */
        addMember: function(principal)
        {
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return this.getUri() + "/members/add?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Removes a member from the team.
         *
         * @param {String|Object} either the principal object or the principal id
         *
         * @chained team
         */
        removeMember: function(principal)
        {
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return this.getUri() + "/members/remove?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(this, uriFunction);
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
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return this.getUri() + "/members";
            };

            var chainable = this.getFactory().domainPrincipalMap(this.getCluster());
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
            var uriFunction = function()
            {
                return this.getUri() + "/authorities/" + authorityId + "/grant";
            };

            return this.chainPostEmpty(this, uriFunction);
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
            var uriFunction = function()
            {
                return this.getUri() + "/authorities/" + authorityId + "/revoke";
            };

            return this.chainPostEmpty(this, uriFunction);
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
            var uriFunction = function()
            {
                return this.getUri() + "/authorities";
            };

            return this.chainGetResponse(this, uriFunction).then(function() {
                callback.call(this, this.response["authorities"]);
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
            return this.teamKey;
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
