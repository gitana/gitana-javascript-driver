(function(window) {
    var Gitana = window.Gitana;

    Gitana.GitanaContext = Gitana.Chainable.extend(
    /** @lends Gitana.GitanaContext.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Abstract
         *
         * @class Utility class for providing Gitana context
         *
         * @param [Object] configs Configuration parameters
         */
        constructor: function(configs) {
            this.base(new Gitana(configs['driver'] ? configs['driver'] : {}));
            this.repository = null;
            this.branch = null;
            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // privileged methods
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////

            this.getConfigs = function() {
                return configs;
            };

            this.getRepositoryConfigs = function() {
                var repositoryConfigs = configs['repository'];
                if (typeof repositoryConfigs == "string") {
                    repositoryConfigs = {
                        "repository" : repositoryConfigs
                    };
                }
                return repositoryConfigs;
            };

            this.getBranchConfigs = function() {
                var branchConfigs = configs['branch'] ? configs['branch'] : 'master';
                if (typeof branchConfigs == "string") {
                    if (branchConfigs == 'master') {
                        branchConfigs = {    /*'type':"MASTER"*/
                            "title" : branchConfigs
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

        refresh: function () {
            this.repository = null;
            this.branch = null;
        },

        getRepository: function () {
            var _this = this;
            var errorCallback = this.getConfigs()['error'];
            if (this.repository != null) {
                return this.repository;
            } else {
                return this.getDriver().authenticate(this.getUserConfigs()['userName'], this.getUserConfigs()['password']).trap(function(error) {
                    if (errorCallback) {
                        errorCallback({
                            'message': 'Failed to get repository',
                            'error': error
                        });
                    }
                }).queryRepositories(this.getRepositoryConfigs()).count(function(count) {
                    if (errorCallback) {
                        if (count == 0) {
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
                    //Get the repository
                    _this.repository = this;
                });
            }
        },

        getBranch: function () {
            var _this = this;
            var errorCallback = this.getConfigs()['error'];
            if (this.branch != null) {
                return this.branch;
            } else {
                this.getRepository().trap(function(error) {
                    if (errorCallback) {
                        errorCallback({
                            'message': 'Failed to get branch',
                            'error': error
                        });
                    }
                }).queryBranches(this.getBranchConfigs()).count(function(count) {
                    if (errorCallback) {
                        if (count == 0) {
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
                    //Get the branch
                    _this.branch = this;
                });
            }
        }
    });
})(window);