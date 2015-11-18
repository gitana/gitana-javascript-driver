(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Repository = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.Repository.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformDataStore
         *
         * @class Repository
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.Repository"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_REPOSITORY;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().repository(this.getPlatform(), this);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // BRANCHES
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * List the branches.
         *
         * @chained branch map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listBranches: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches";
            };

            var chainable = this.getFactory().branchMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a branch.
         *
         * @chained branch
         *
         * @public
         *
         * @param {String} branchId the branch id
         */
        readBranch: function(branchId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches/" + branchId;
            };

            var chainable = this.getFactory().branch(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a branch.
         *
         * @chained branch
         *
         * @public
         *
         * @param {String} branchId identifies the branch from which the new branch will be forked.
         * @param {String} changesetId identifies the changeset on the branch which serves as the root changeset that
         *                             the new branch will be founded upon.
         * @param [Object] object JSON object for the branch
         */
        createBranch: function(branchId, changesetId, object)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches";
            };

            var createParams = {
                "branch": branchId,
                "changeset": changesetId
            };
            var chainable = this.getFactory().branch(this);
            return this.chainCreate(chainable, object, uriFunction, createParams);
        },

        /**
         * Queries for branches.
         *
         * Config should be:
         *
         *    {
         *       Gitana query configs
         *    }
         *
         * @public
         *
         * @param {Object} query
         * @param [Object] pagination
         */
        queryBranches: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches/query";
            };

            var chainable = this.getFactory().branchMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type branch.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkBranchPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },


        /**
         * List the changesets in this repository.
         *
         * @chained
         *
         * @public
         */
        listChangesets: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/changesets";
            };

            var chainable = this.getFactory().changesetMap(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Read a changeset.
         *
         * @chained
         *
         * @public
         *
         * @param {String} changesetId the id of the changeset
         */
        readChangeset: function(changesetId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/changesets/" + changesetId;
            };

            var chainable = this.getFactory().changeset(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Acquires a list of the parent changesets for a given changeset.
         *
         * @chained
         *
         * @public
         *
         * @param {String} changesetId the id of the changeset
         */
        listChangesetParents: function(changesetId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/changesets/" + changesetId + "/parents";
            };

            var chainable = this.getFactory().changesetMap(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Acquires a list of the child changesets for a given changeset.
         *
         * @chained
         *
         * @public
         *
         * @param {String} changesetId the id of the changeset
         */
        listChangesetChildren: function(changesetId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/changesets/" + changesetId + "/children";
            };

            var chainable = this.getFactory().changesetMap(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Queries for changesets.
         *
         * Config should be:
         *
         *    {
         *       Gitana query configs
         *    }
         *
         * @public
         *
         * @param {Object} query
         * @param [Object] pagination
         */
        queryChangesets: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/changesets/query";
            };

            var chainable = this.getFactory().changesetMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },


        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // RELEASES
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * List the releases.
         *
         * @chained release map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listReleases: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/releases";
            };

            var chainable = this.getFactory().releaseMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a release.
         *
         * @chained release
         *
         * @public
         *
         * @param {String} releaseId the release id
         */
        readRelease: function(releaseId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/releases/" + releaseId;
            };

            var chainable = this.getFactory().release(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a release.
         *
         * @chained release
         *
         * @public
         *
         * @param {String} data release data
         * @param [Object] object JSON object for the branch
         */
        createRelease: function(object)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/releases";
            };

            var chainable = this.getFactory().release(this);
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Queries for releases.
         *
         * Config should be:
         *
         *    {
         *       Gitana query configs
         *    }
         *
         * @public
         *
         * @param {Object} query
         * @param [Object] pagination
         */
        queryReleases: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/releases/query";
            };

            var chainable = this.getFactory().releaseMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type release.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkReleasePermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/releases/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // MERGE CONFLICTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieves any matching merge conflicts
         *
         * @param query
         * @param callback
         * @returns {*}
         */
        loadMergeConflicts: function(query, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/mergeconflicts/query";
            };

            return this.chainPostResponse(this, uriFunction, {}, query).then(function(response) {
                callback(response);
            });
        },

        resolveMergeConflict: function(mergeConflictId, resolution, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/mergeconflicts/" + mergeConflictId + "/resolve";
            };

            var params = {
                "resolution": resolution
            };

            return this.chainPostResponse(this, uriFunction, params).then(function(response) {
                callback(response);
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACCESSORS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        getMaxSize: function()
        {
            return this.get("maxSize");
        },

        getSize: function()
        {
            return this.get("size");
        },

        getObjectCount: function()
        {
            return this.get("objectcount");
        }

    });

})(window);
