(function(window)
{
    const Gitana = window.Gitana;

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
            return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/deletions/" + this._deletion.nodeId;
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
            return "deletion://" + this.getPlatformId() + "/" + this.getRepositoryId() + "/" + this.getBranchId() + "/" + this._deletion.nodeId;
        },

        /**
         * Restores a deletion to the branch.
         *
         * @public
         * @param {object} data any data to override on the restored node
         * @param callback
         */
        restore: function(data, callback)
        {
            const self = this;

            if (typeof(data) === "function")
            {
                callback = data;
                data = {};
            }

            if (!data) {
                data = {};
            }

            const uriFunction = function()
            {
                return self.getUri() + "/restore";
            };

            return this.chainPostResponse(null, uriFunction, {}, data).then(function(response) {
                callback.call(this, response);
            });
        }

    });

})(window);
