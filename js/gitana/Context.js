(function(window) {
/**
 * @ignore
 */
    const Gitana = window.Gitana;

    Gitana.Context = Gitana.Chainable.extend(
    /** @lends Gitana.Context.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Chainable
         *
         * @class Utility class for providing Gitana context
         *
         * @param {Object} configs Configuration parameters
         */
        constructor: function(configs) {
            this.base(new Gitana(configs['driver'] ? configs['driver'] : {}));

            // cache
            if (!this.cache) {
                this.cache = {};
            }
            this.cache["repository"] = null;
            this.cache["branch"] = null;
            this.cache["platform"] = null;

            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // privileged methods
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////

            this.getConfigs = function() {
                return configs;
            };

            this.getRepositoryConfigs = function() {
                let repositoryConfigs = configs['repository'];
                if (typeof repositoryConfigs === "string") {
                    repositoryConfigs = {
                        "repository" : repositoryConfigs
                    };
                }
                return repositoryConfigs;
            };

            this.getBranchConfigs = function() {
                let branchConfigs = configs['branch'] ? configs['branch'] : 'master';
                if (typeof branchConfigs === "string") {
                    if (branchConfigs === 'master') {
                        branchConfigs = {
                            'type' : 'MASTER'
                        };
                    } else {
                        branchConfigs = {
                            "_doc" : branchConfigs
                        };
                    }
                }
                return branchConfigs;
            };

            this.getUserConfigs = function() {
                return configs['user'];
            };

            this.getDriverConfigs = function() {
                return configs['driver'];
            };
        },

        platform: function(platform)
        {
            if (platform || platform === null) {
                this.cache.platform = platform;
            }

            return this.cache.platform ? Chain(this.cache.platform) : null;
        },

        repository: function(repository)
        {
            if (repository || repository === null) {
                this.cache.repository = repository;
            }

            return this.cache.repository ? Chain(this.cache.repository) : null;
        },

        branch: function(branch)
        {
            if (branch || branch === null) {
                this.cache.branch = branch;
            }

            return this.cache.branch ? Chain(this.cache.branch) : null;
        },

        /**
         * Hands back an initialized version of the Gitana Context object
         *
         * @chained gitana context
         */
        init: function () {

            const self = this;

            const loadPlatform = function(successCallback, errorCallback)
            {
                if (!self.platform())
                {
                    const authentication = self.getConfigs()["authentication"];

                    self.getDriver().authenticate(authentication, function(http) {
                        if (errorCallback) {
                            errorCallback({
                                'message': 'Failed to login Gitana.',
                                'reason': 'INVALID_LOGIN',
                                'error': http
                            });
                        }
                    }).then(function() {

                        self.platform(this);

                        // now move on to repository
                        loadRepository(successCallback, errorCallback);
                    });
                }
                else
                {
                    loadRepository(successCallback, errorCallback);
                }
            };

            const loadRepository = function(successCallback, errorCallback)
            {
                if (!self.repository())
                {
                    self.platform().trap(function(error) {
                        if (errorCallback) {
                            errorCallback({
                                'message': 'Failed to get repository',
                                'error': error
                            });
                        }
                    }).queryRepositories(self.getRepositoryConfigs()).count(function(count) {
                        if (errorCallback) {
                            if (count === 0) {
                                errorCallback({
                                    'message': 'Cannot find any repository'
                                });
                            }
                            if (count > 1) {
                                errorCallback({
                                    'message': 'Found more than one repository'
                                });
                            }
                        }
                    }).keepOne().then(function() {

                        self.repository(this);

                        // now move on to branch
                        loadBranch(successCallback, errorCallback);
                    });
                }
                else
                {
                    loadBranch(successCallback, errorCallback);
                }
            };

            const loadBranch = function(successCallback, errorCallback)
            {
                if (!self.branch())
                {
                    self.repository().trap(function(error) {
                        if (errorCallback) {
                            errorCallback({
                                'message': 'Failed to get branch',
                                'error': error
                            });
                        }
                    }).queryBranches(self.getBranchConfigs()).count(function(count) {
                        if (errorCallback) {
                            if (count === 0) {
                                errorCallback({
                                    'message': 'Cannot find any branch'
                                });
                            }
                            if (count > 1) {
                                errorCallback({
                                    'message': 'Found more than one branch'
                                });
                            }
                        }
                    }).keepOne().then(function() {

                        self.branch(this);

                        // now fire the success callback
                        successCallback.call();
                    });
                }
                else
                {
                    // fire the success callback
                    successCallback.call();
                }
            };

            // we hand back a chained version of ourselves
            const result = Chain(this);

            // preload work onto the chain
            return result.subchain().then(function() {

                const chain = this;

                loadPlatform(function() {

                    // success, advance chain manually
                    chain.next();

                }, function(err) {

                    const errorCallback = self.getConfigs()['error'];
                    if (errorCallback)
                    {
                        errorCallback.call(self, err);
                    }

                });

                // return false so that the chain doesn't complete until we manually complete it
                return false;
            });
        }
    });

    /**
     * Static helper function to build and init a new context.
     *
     * @param config
     */
    Gitana.Context.create = function(config)
    {
        const context = new Gitana.Context(config);
        return context.init();
    };

})(window);