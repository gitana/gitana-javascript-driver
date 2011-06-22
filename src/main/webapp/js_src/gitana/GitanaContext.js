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

            // cache
            if (!this.cache) {
                this.cache = {};
            }
            this.cache["repository"] = null;
            this.cache["branch"] = null;
            this.cache["server"] = null;

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

        /**
         * Resets context.
         *
         * @public
         */
        refresh: function () {
            this.cache["repository"] = null;
            this.cache["branch"] = null;
            this.cache["server"] = null;
        },

        /**
         * Authenticates the driver as the given user.
         * If authenticated, a ticket is returned and stored in the driver.
         *
         * @param {String} username the user name
         * @param {String} password password
         * @param [Function] authentication failure handler
         */
        login: function(userName,password,onError) {
            var _this = this;
            this.getConfigs()["user"] = {
                "userName" : userName,
                "password" : password
            };
            return this.getDriver().authenticate(userName,password, function (http) {
                if (onError) {
                    onError({
                        'message': 'Failed to login Gitana.',
                        'reason': 'INVALID_LOGIN',
                        'error': http
                    });
                }
            }).then(function(){
                _this.cache["server"] = this;
            });
        },

        /**
         * Clears authentication against the server.
         *
         * @chained server
         *
         * @public
         */
        logout: function () {
            return this.getServer().logout();
        },

        /**
         * Retrieves context server.
         *
         * @chained server
         */
        getServer: function () {
            var _this = this;
            var errorCallback = this.getConfigs()['error'];
            if (this.server != null) {
                return Chain(this.server);
            } else {
                return this.login(this.getConfigs()["user"]['userName'],this.getConfigs()["user"]['password'],errorCallback);
            }
        },

        /**
         * Retrieves context repository.
         *
         * @chained repository
         */
        getRepository: function () {
            var _this = this;
            var errorCallback = this.getConfigs()['error'];
            if (this.repository != null) {
                return Chain(this.repository);
            } else {
                return this.getServer().trap(function(error) {
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

        /**
         * Retrieves context branch.
         *
         * @chained branch
         */
        getBranch: function () {
            var _this = this;
            var errorCallback = this.getConfigs()['error'];
            if (this.branch != null) {
                return Chain(this.branch);
            } else {
                return this.getRepository().trap(function(error) {
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