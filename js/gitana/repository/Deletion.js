(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Deletion = Gitana.AbstractRepositoryObject.extend(
    /** @lends Gitana.Deletion.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRepositoryObject
         *
         * @class Node
         *
         * @param {Gitana.Branch} branch
         * @param {Object} [object] json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch.getRepository(), object);

            this.objectType = function() { return "Gitana.Deletion"; };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Branch object.
             *
             * @inner
             *
             * @returns {Gitana.Branch} The Gitana Branch object
             */
            this.getBranch = function() { return branch; };

            /**
             * Gets the Gitana Branch id.
             *
             * @inner
             *
             * @returns {String} The Gitana Branch id
             */
            this.getBranchId = function() { return branch.getId(); };

            this.getNodeId = function()
            {
                var nodeId = this._doc;

                // 3.2 _deletion field
                if (this._deletion && this._deletion.nodeId) {
                    nodeId = this._deletion.nodeId;
                }

                return nodeId;
            }
        },

        /**
         * @override
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DELETION;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/deletions/" + this.getNodeId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().deletion(this.getBranch(), this);
        },

        /**
         * @override
         */
        ref: function()
        {
            return "deletion://" + this.getPlatformId() + "/" + this.getRepositoryId() + "/" + this.getBranchId() + "/" + this.getNodeId();
        },

        /**
         * Restores a deletion to the branch.
         *
         * @public
         * @param [object] data any data to override on the restored node
         */
        restore: function(data, callback)
        {
            var self = this;

            if (typeof(data) === "function")
            {
                callback = data;
                data = {};
            }

            if (!data) {
                data = {};
            }

            var uriFunction = function()
            {
                return self.getUri() + "/restore";
            };

            return this.chainPostResponse(null, uriFunction, {}, data).then(function(response) {
                callback.call(this, response);
            });
        }

    });

})(window);
