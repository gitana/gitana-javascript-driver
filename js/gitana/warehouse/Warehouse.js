(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Warehouse = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.Warehouse.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Warehouse
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.Warehouse"; };

            this.base(platform, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_WAREHOUSE;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().warehouse(this.getPlatform(), this);
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interactions.
         *
         * @param pagination
         *
         * @chained interaction map
         */
        listInteractions: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionMap(this);
            return this.chainGet(chainable, this.getUri() + "/interactions", params);
        },

        /**
         * Reads an interaction.
         *
         * @param interactionId
         *
         * @chained interaction
         */
        readInteraction: function(interactionId)
        {
            var chainable = this.getFactory().interaction(this);
            return this.chainGet(chainable, this.getUri() + "/interactions/" + interactionId);
        },

        /**
         * Queries for interactions.
         *
         * @chained interaction map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractions: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/interactions/query";
            };

            var chainable = this.getFactory().interactionMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION APPLICATIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction applications.
         *
         * @param pagination
         *
         * @chained interaction application map
         */
        listInteractionApplications: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionApplicationMap(this);
            return this.chainGet(chainable, this.getUri() + "/applications", params);
        },

        /**
         * Reads an interaction application.
         *
         * @param interactionApplicationId
         *
         * @chained interaction application
         */
        readInteractionApplication: function(interactionApplicationId)
        {
            var chainable = this.getFactory().interactionApplication(this);
            return this.chainGet(chainable, this.getUri() + "/applications/" + interactionApplicationId);
        },

        /**
         * Queries for interaction applications.
         *
         * @chained interaction application map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionApplications: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/applications/query";
            };

            var chainable = this.getFactory().interactionApplicationMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION SESSIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction sessions.
         *
         * @param pagination
         *
         * @chained interaction session map
         */
        listInteractionSessions: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionSessionMap(this);
            return this.chainGet(chainable, this.getUri() + "/sessions", params);
        },

        /**
         * Reads an interaction session.
         *
         * @param interactionSessionId
         *
         * @chained interaction session
         */
        readInteractionSession: function(interactionSessionId)
        {
            var chainable = this.getFactory().interactionSession(this);
            return this.chainGet(chainable, this.getUri() + "/sessions/" + interactionSessionId);
        },

        /**
         * Queries for interaction sessions.
         *
         * @chained interaction session map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionSessions: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/sessions/query";
            };

            var chainable = this.getFactory().interactionSessionMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION PAGES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction pages.
         *
         * @param pagination
         *
         * @chained interaction page map
         */
        listInteractionPages: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionPageMap(this);
            return this.chainGet(chainable, this.getUri() + "/pages", params);
        },

        /**
         * Reads an interaction page.
         *
         * @param interactionPageId
         *
         * @chained interaction page
         */
        readInteractionPage: function(interactionPageId)
        {
            var chainable = this.getFactory().interactionPage(this);
            return this.chainGet(chainable, this.getUri() + "/pages/" + interactionPageId);
        },

        /**
         * Queries for interaction pages.
         *
         * @chained interaction page map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionPages: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/pages/query";
            };

            var chainable = this.getFactory().interactionPageMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION NODES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction nodes.
         *
         * @param pagination
         *
         * @chained interaction node map
         */
        listInteractionNodes: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionNodeMap(this);
            return this.chainGet(chainable, this.getUri() + "/nodes", params);
        },

        /**
         * Reads an interaction node.
         *
         * @param interactionNodeId
         *
         * @chained interaction node
         */
        readInteractionNode: function(interactionNodeId)
        {
            var chainable = this.getFactory().interactionNode(this);
            return this.chainGet(chainable, this.getUri() + "/nodes/" + interactionNodeId);
        },

        /**
         * Queries for interaction nodes.
         *
         * @chained interaction node map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionNodes: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/nodes/query";
            };

            var chainable = this.getFactory().interactionNodeMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION USERS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction users.
         *
         * @param pagination
         *
         * @chained interaction user map
         */
        listInteractionUsers: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionUserMap(this);
            return this.chainGet(chainable, this.getUri() + "/users", params);
        },

        /**
         * Reads an interaction user.
         *
         * @param interactionUserId
         *
         * @chained interaction user
         */
        readInteractionUser: function(interactionUserId)
        {
            var chainable = this.getFactory().interactionUser(this);
            return this.chainGet(chainable, this.getUri() + "/users/" + interactionUserId);
        },

        /**
         * Queries for interaction users.
         *
         * @chained interaction user map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionUsers: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/users/query";
            };

            var chainable = this.getFactory().interactionUserMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION CONTINENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction continents.
         *
         * @param pagination
         *
         * @chained interaction continent map
         */
        listInteractionContinents: Gitana.Methods.listInteractionObjects("interactionContinentMap", "continents"),

        /**
         * Reads an interaction continent.
         *
         * @param interactionContinentId
         *
         * @chained interaction continent
         */
        readInteractionContinent: Gitana.Methods.readInteractionObject("interactionContinent", "continents"),

        /**
         * Queries for interaction continents.
         *
         * @chained interaction continent map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionContinents: Gitana.Methods.queryInteractionObjects("interactionContinentMap", "continents"),



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION COUNTRIES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction countries.
         *
         * @param pagination
         *
         * @chained interaction country map
         */
        listInteractionCountries: Gitana.Methods.listInteractionObjects("interactionCountryMap", "countries"),

        /**
         * Reads an interaction country.
         *
         * @param interactionCountryId
         *
         * @chained interaction country
         */
        readInteractionCountry: Gitana.Methods.readInteractionObject("interactionCountry", "countries"),

        /**
         * Queries for interaction countries.
         *
         * @chained interaction country map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionCountries: Gitana.Methods.queryInteractionObjects("interactionCountryMap", "countries"),


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION CITIES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction cities.
         *
         * @param pagination
         *
         * @chained interaction city map
         */
        listInteractionCities: Gitana.Methods.listInteractionObjects("interactionCityMap", "cities"),

        /**
         * Reads an interaction city.
         *
         * @param interactionCityId
         *
         * @chained interaction city
         */
        readInteractionCity: Gitana.Methods.readInteractionObject("interactionCity", "cities"),

        /**
         * Queries for interaction cities.
         *
         * @chained interaction city map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionCities: Gitana.Methods.queryInteractionObjects("interactionCityMap", "cities"),


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION REGIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction regions.
         *
         * @param pagination
         *
         * @chained interaction region map
         */
        listInteractionRegions: Gitana.Methods.listInteractionObjects("interactionRegionMap", "regions"),

        /**
         * Reads an interaction region.
         *
         * @param interactionRegionId
         *
         * @chained interaction region
         */
        readInteractionRegion: Gitana.Methods.readInteractionObject("interactionRegion", "regions"),

        /**
         * Queries for interaction regions.
         *
         * @chained interaction region map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionRegions: Gitana.Methods.queryInteractionObjects("interactionRegionMap", "regions"),


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION POSTAL CODES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction postal codes.
         *
         * @param pagination
         *
         * @chained interaction postal code map
         */
        listInteractionPostalCodes: Gitana.Methods.listInteractionObjects("interactionPostalCodeMap", "postalcodes"),

        /**
         * Reads an interaction postal code.
         *
         * @param interactionPostalCodeId
         *
         * @chained interaction postal code
         */
        readInteractionPostalCode: Gitana.Methods.readInteractionObject("interactionPostalCode", "postalcodes"),

        /**
         * Queries for interaction postal codes.
         *
         * @chained interaction postal code map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionPostalCodes: Gitana.Methods.queryInteractionObjects("interactionPostalCodeMap", "postalcodes"),


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION USER AGENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction user agents.
         *
         * @param pagination
         *
         * @chained interaction user agent map
         */
        listInteractionUserAgents: Gitana.Methods.listInteractionObjects("interactionUserAgentMap", "useragents"),

        /**
         * Reads an interaction user agent.
         *
         * @param interactionUserAgentId
         *
         * @chained interaction user agent
         */
        readInteractionUserAgent: Gitana.Methods.readInteractionObject("interactionUserAgent", "useragents"),

        /**
         * Queries for interaction user agents
         *
         * @chained interaction user agent map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionUserAgents: Gitana.Methods.queryInteractionObjects("interactionUserAgentMap", "useragents"),


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION OPERATING SYSTEMS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction operating systems.
         *
         * @param pagination
         *
         * @chained interaction operating system map
         */
        listInteractionOperatingSystems: Gitana.Methods.listInteractionObjects("interactionOperatingSystemMap", "operatingsystems"),

        /**
         * Reads an interaction operating system.
         *
         * @param interactionOperatingSystemId
         *
         * @chained interaction operating system
         */
        readInteractionOperatingSystems: Gitana.Methods.readInteractionObject("interactionOperatingSystem", "operatingsystems"),

        /**
         * Queries for interaction operating systems.
         *
         * @chained interaction operating system map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionOperatingSystems: Gitana.Methods.queryInteractionObjects("interactionOperatingSystemMap", "operatingsystems"),


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION DEVICES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction devices.
         *
         * @param pagination
         *
         * @chained interaction device map
         */
        listInteractionDevices: Gitana.Methods.listInteractionObjects("interactionDeviceMap", "devices"),

        /**
         * Reads an interaction device.
         *
         * @param interactionDeviceId
         *
         * @chained interaction device
         */
        readInteractionDevice: Gitana.Methods.readInteractionObject("interactionDevice", "devices"),

        /**
         * Queries for interaction devices.
         *
         * @chained interaction device map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionDevices: Gitana.Methods.queryInteractionObjects("interactionDeviceMap", "devices"),



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION REPORTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction reports.
         *
         * @param pagination (optional)
         *
         * @chained interaction report map
         */
        listInteractionReports: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionReportMap(this);
            return this.chainGet(chainable, this.getUri() + "/reports", params);
        },

        /**
         * Reads an interaction report.
         *
         * @param interactionReportId
         *
         * @chained interaction report
         */
        readInteractionReport: function(interactionReportId)
        {
            var chainable = this.getFactory().interactionReport(this);
            return this.chainGet(chainable, this.getUri() + "/reports/" + interactionReportId);
        },

        /**
         * Queries for interaction reports.
         *
         * @param query
         * @param pagination (optional)
         *
         * @chained interaction report map
         */
        queryInteractionReports: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/reports/query";
            };

            var chainable = this.getFactory().interactionReportMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Loads information about the warehouse.
         *
         * @param callback
         */
        loadInfo: function(callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/info";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {
                callback(response);
            });
        }

    });

})(window);
