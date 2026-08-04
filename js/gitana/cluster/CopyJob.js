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

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.CopyJob(this.getCluster(), this);
        },

        readExportJob: function()
        {
            var exportJobId = this.get("children")[0];

            return this.subchain(this.getCluster()).readJob(exportJobId, "transfer_export");
        },

        readImportJob: function()
        {
            var importJobId = this.get("children")[1];

            return this.subchain(this.getCluster()).readJob(importJobId, "transfer_import");
        }

    });

})(window);
