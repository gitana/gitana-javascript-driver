(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.TransferExportJob = Gitana.Job.extend(
    /** @lends Gitana.TransferExportJob.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class TransferExportJob
         *
         * @param {Gitana.Cluster} cluster
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(cluster, object)
        {
            this.base(cluster, object);

            this.objectType = function() { return "Gitana.TransferExportJob"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.TransferExportJob(this.getCluster(), this);
        },

        getImports: function()
        {
            const importObjects = [];

            const array = this.get("imports");
            for (let i = 0; i < array.length; i++)
            {
                const object = array[i];

                const sources = object["sources"];
                const targets = object["targets"];

                const importObject = {
                    sources,
                    targets,
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
            let targetId = null;

            const importObjects = this.getImports();
            if (importObjects.length > 0)
            {
                targetId = importObjects[0].getTargetId();
            }

            return targetId;
        }
    });

})(window);
