(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.CopyJob = Gitana.Job.extend(
    /** @lends Gitana.CopyJob.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class CopyJob
         *
         * @param {Gitana.Cluster} cluster
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(cluster, object)
        {
            this.base(cluster, object);

            this.objectType = function() { return "Gitana.CopyJob"; };
        },

        getImports: function()
        {
            var importObjects = [];

            var array = this.get("imports");
            for (var i = 0; i < array.length; i++)
            {
                var object = array[i];

                var sources = object["sources"];
                var targets = object["targest"];

                var importObject = {
                    "sources": object["sources"],
                    "targets": object["targets"],
                    getType: function()
                    {
                        return this.targets[this.targets.length - 1]["typeId"];
                    },
                    getSourceId: function()
                    {
                        return this.sources[this.sources.length - 1]["id"];
                    },
                    getTargetId: function()
                    {
                        return this.targets[this.targets.length - 1]["id"];
                    }
                };
                importObjects.push(importObject);
            }

            return importObjects;
        },

        getSingleImportTargetId: function()
        {
            var targetId = null;

            var importObjects = this.getImports();
            if (importObjects.length > 0)
            {
                targetId = importObjects[0].getTargetId();
            }

            return targetId;
        }

    });

})(window);
