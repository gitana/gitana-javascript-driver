(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.TeamMember = Gitana.AbstractObject.extend(
    /** @lends Gitana.TeamMember.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class TeamMember
         *
         * @param {Gitana.Cluster} team
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(team, object)
        {
            this.base(team.getDriver(), object);

            this.objectType = function() { return "Gitana.TeamMember"; };



            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getTeam = function() { return team; };
            this.getCluster = function() { return team.getCluster(); };
            this.getClusterId = function() { return team.getClusterId(); };
        }

        /*,

        domain: function()
        {
            const self = this;

            const result = this.subchain(new Gitana.Domain({
                "_doc": this.domainId
            }));

            return result.then(function() {
                // TODO: read the domain and populate
            });
        },

        principal: function()
        {
            const self = this;

            // domain
            const domain = new Gitana.Domain({
                ""
            })
            // temp web host
            const webhost = new Gitana.WebHost(this.getPlatform());

            // we hand back a deployed application and preload some work
            const chainable = this.getFactory().deployedApplication(webhost);
            return this.chainPost(chainable, uriFunction).then(function() {

                // load the real web host
                const webhostId = self["deployments"][deploymentKey]["webhost"];
                this.subchain(this.getPlatform()).readWebHost(webhostId).then(function() {
                    webhost.loadFrom(this);
                });

            });
        }
        */
    });

})(window);
