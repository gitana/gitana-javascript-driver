(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractSelfableACLObject = Gitana.AbstractSelfableObject.extend(
    /** @lends Gitana.AbstractSelfableACLObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractSelfableObject
         *
         * @class Abstract base class for selfable ACL Gitana document objects.
         *
         * @param {Gitana} driver
         * @param [Object] object
         */
        constructor: function(driver, object)
        {
            // finally chain to parent prototype
            this.base(driver, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieve full ACL and pass into chaining method.
         *
         * @chained this
         *
         * @param callback
         */
        loadACL: function(callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/acl/list";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Retrieve list of authorities and pass into chaining method.
         *
         * @chained this
         *
         * @param {Gitana.DomainPrincipal|String} principal the principal or the principal id
         * @param callback
         */
        listAuthorities: function(principal, callback)
        {
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/acl?id=" + principalDomainQualifiedId;
            };

            return this.chainGetResponseRows(this, uriFunction).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Checks whether the given principal has a granted authority for this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained this
         *
         * @param {Gitana.DomainPrincipal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param callback
         */
        checkAuthority: function(principal, authorityId, callback)
        {
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/authorities/" + authorityId + "/check?id=" + principalDomainQualifiedId;
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["check"]);
            });
        },

        /**
         * Grants an authority to a principal against this object.
         *
         * @chained this
         *
         * @param {Gitana.DomainPrincipal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        grantAuthority: function(principal, authorityId)
        {
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/authorities/" + authorityId + "/grant?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Revokes an authority from a principal against this object.
         *
         * @chained this
         *
         * @param {Gitana.DomainPrincipal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        revokeAuthority: function(principal, authorityId)
        {
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/authorities/" + authorityId + "/revoke?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Revokes all authorities for a principal against the server.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        revokeAllAuthorities: function(principal)
        {
            return this.revokeAuthority(principal, "all");
        },

        /**
         * Loads the authority grants for a given set of principals.
         *
         * @chained this
         *
         * @param callback
         */
        loadAuthorityGrants: function(principalIds, callback)
        {
            if (!principalIds)
            {
                principalIds = [];
            }

            var json = {
                "principals": principalIds
            };

            return this.chainPostResponse(this, this.getUri() + "/authorities", {}, json).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Checks whether the given principal has a permission against this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained this
         *
         * @param {Gitana.DomainPrincipal|String} principal the principal or the principal id
         * @param {String} permissionId the id of the permission
         * @param callback
         */
        checkPermission: function(principal, permissionId, callback)
        {
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return self.getUri() + "/permissions/" + permissionId + "/check?id=" + principalDomainQualifiedId;
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["check"]);
            });
        }


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////


    });

})(window);
