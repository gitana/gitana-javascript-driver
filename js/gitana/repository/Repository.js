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
         * Starts the creation of a new branch.
         * This runs a background job to do the actual indexing and branch creation.
         *
         * @chained release
         *
         * @param {String} branchId identifies the branch from which the new branch will be forked.
         * @param {String} changesetId identifies the changeset on the branch which serves as the root changeset that
         *                             the new branch will be founded upon.
         * @param [Object] object JSON object for the branch
         * @param callback
         */
        startCreateBranch: function(branchId, changesetId, object, callback)
        {
            var self = this;

            if (typeof(object) === "function") {
                callback = object;
                object = null;
            }

            if (typeof(changesetId) === "function") {
                callback = changesetId;
                changesetId = null;
                object = null;
            }

            var uriFunction = function()
            {
                return self.getUri() + "/branches/create/start";
            };

            if (!object)
            {
                object = {};
            }

            var params = {};
            params.branch = branchId;
            if (changesetId)
            {
                params.changeset = changesetId;
            }

            return this.chainPostResponse(this, uriFunction, params, object).then(function(response) {

                var jobId = response._doc;

                callback(jobId);
            });
        },

        /**
         * Creates a snapshot at a given changeset within the repository.
         *
         * @param changesetId
         * @param object
         */
        createSnapshot: function(changesetId, object)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/snapshots";
            };

            var createParams = {
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
         * Lists the branches that can be pulled into a given branch
         * 
         * @param {String} branchId
         * @param [Object] pagination
         */
        listPullSources: function(branchId, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches/" + branchId + "/pull/sources";
            };

            var chainable = this.getFactory().branchMap(this);
            return this.chainGet(chainable, uriFunction, params);
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
         * Performs a bulk check of authorities against permissioned objects of type branch.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkBranchAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches/authorities/check";
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
        // MERGE BRANCH
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Merges a branch into a target branch. Runs as a background Job
         *
         * @public
         *
         * @param sourceBranchId
         * @param targetBranchId
         */
         startMerge: function(sourceBranchId, targetBranchId, callback)
         {
             var params = {
                 id: sourceBranchId
             };

             var uriFunction = function()
             {
                return "/repositories/" + this.getId() + "/branches/" + targetBranchId + "/merge/start";
             };

             return this.chainPostResponse(this, uriFunction, params).then(function(response) {

                 var jobId = response._doc;

                 callback(jobId);
             });
         },

         startDryMerge: function(sourceBranchId, targetBranchId, callback)
         {
             var params = {
                 id: sourceBranchId,
                 dryRun: true
             };

             var uriFunction = function()
             {
                return "/repositories/" + this.getId() + "/branches/" + targetBranchId + "/merge/start";
             };

             return this.chainPostResponse(this, uriFunction, params).then(function(response) {

                 var jobId = response._doc;

                 callback(jobId);
             });
         },

         /**
          * Performs a diff between a source and target branch. Runs as a background Job
          *
          * @public
          *
          * @param sourceBranchId
          * @param targetBranchId
          */
         startDiff: function(sourceBranchId, targetBranchId, callback)
         {
             var params = {
                 id: sourceBranchId
             };

             var uriFunction = function()
             {
                return "/repositories/" + this.getId() + "/branches/" + targetBranchId + "/diff/start";
             };

             return this.chainPostResponse(this, uriFunction, params).then(function(response) {

                 var jobId = response._doc;

                 callback(jobId);
             });
         },

         /**
          * Finds the changes that will be applied from a source branch to a target branch. Runs as a background Job
          *
          * @public
          *
          * @param sourceBranchId
          * @param targetBranchId
          * @param options (request param options, pagination)
          * @param callback
          */
         startChanges: function(sourceBranchId, targetBranchId, options, callback)
         {
             if (typeof(options) === "function") {
                 callback = options;
                 options = null;
             }

             var params = {};

             if (typeof(options) === "string")
             {
                 params.view = options;
             }
             else if (Gitana.isObject(options))
             {
                 for (var k in options) {
                     params[k] = options[k];
                 }
             }

             // source branch ID
             params["id"] = sourceBranchId;

             var uriFunction = function()
             {
                return "/repositories/" + this.getId() + "/branches/" + targetBranchId + "/changes/start";
             };

             return this.chainPostResponse(this, uriFunction, params).then(function(response) {

                 var jobId = response._doc;

                 callback(jobId);
             });
         },


         /**
          * Lists the branches with which this branch has merge conflicts.
          *
          * @public
          *
          * @param sourceBranchId
          * @param mergeType Either "outgoing" or "incoming"
          */
         listMerges: function(sourceBranchId, mergeType)
         {
             var params = {};
             if (mergeType)
             {
                 params.mergeType = mergeType;
             }

             var uriFunction = function()
             {
                return "/repositories/" + this.getId() + "/branches/" + sourceBranchId + "/merges";
             };

             var chainable = this.getFactory().branchMap(this);
             return this.chainGet(chainable, uriFunction, params);
         },

         /**
          * Copies nodes from the source branch to the target branch
          * 
          * @param {String} sourceBranchId 
          * @param {String} targetBranchId 
          * @param {Object} config 
          */
         copyFrom: function(sourceBranchId, targetBranchId, config)
         {
             var params = {
                 id: sourceBranchId
             };

             var uriFunction = function()
             {
                return "/repositories/" + this.getId() + "/branches/" + targetBranchId + "/copyfrom";
             };

             return this.chainPost(this, uriFunction, params, config)
         },

        /**
         * Copies nodes from the source branch to the target branch asynchronously.
         *
         * @param {String} sourceBranchId
         * @param {String} targetBranchId
         * @param {Object} config
         * @param [Function] callback
         */
        startCopyFrom: function(sourceBranchId, targetBranchId, config, callback)
        {
            var params = {
                id: sourceBranchId
            };

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/branches/" + targetBranchId + "/copyfrom/start";
            };

            return this.chainPostResponse(this, uriFunction, params, config).then(function(response) {

                var jobId = response._doc;

                callback(jobId);
            });
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
         * @param [Object] object JSON object for the release
         * @param [String] sourceId optional id of the source release that should be copied
         */
        createRelease: function(object, sourceId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/releases";
            };

            var params = {};
            if (sourceId)
            {
                params.sourceId = sourceId;
            }

            var chainable = this.getFactory().release(this);
            return this.chainCreate(chainable, object, uriFunction, params);
        },

        /**
         * Starts the creation of a new release.
         * This runs a background job to do the actual indexing and release creation.
         *
         * @chained release
         *
         * @param [Object] object JSON object
         * @param [String] sourceId optional id of the source release that should be copied
         * @param callback
         */
        startCreateRelease: function(object, sourceId, callback)
        {
            var self = this;

            if (typeof(object) === "function") {
                callback = object;
                sourceId = null;
                object = null;
            }

            if (typeof(sourceId) === "function") {
                callback = sourceId;
                sourceId = null;
            }

            var uriFunction = function()
            {
                return self.getUri() + "/releases/create/start";
            };

            if (!object)
            {
                object = {};
            }

            var params = {};
            if (sourceId)
            {
                params.sourceId = sourceId;
            }

            return this.chainPostResponse(this, uriFunction, params, object).then(function(response) {

                var jobId = response._doc;

                callback(jobId);
            });
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

        /**
         * Performs a bulk check of authorities against permissioned objects of type release.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkReleaseAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/releases/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // MERGE CONFLICTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * List the merge conflicts.
         *
         * @chained merge conflict map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listConflicts: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/conflicts";
            };

            var chainable = this.getFactory().mergeConflictMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a merge conflict.
         *
         * @chained conflict
         *
         * @public
         *
         * @param {String} conflictId the merge conflict id
         */
        readConflict: function(conflictId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/conflicts/" + conflictId;
            };

            var chainable = this.getFactory().mergeConflict(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Queries for merge conflicts.
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
        queryConflicts: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/conflicts/query";
            };

            var chainable = this.getFactory().mergeConflictMap(this);
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
        checkConflictPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/conflicts/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type release.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkConflictAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getId() + "/conflicts/authorities/check";
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
