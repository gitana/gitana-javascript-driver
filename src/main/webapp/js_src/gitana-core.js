(function(window) 
{
	var VERSION = "0.1.0";
	var _makeArray = function(nonarray) { return Array.prototype.slice.call(nonarray); };
    var _isFunction = function( obj ) { return Object.prototype.toString.call(obj) === "[object Function]"; };
    var _isString = function( obj ) { return (typeof obj == "string"); };
    var _isObject =function( obj) { return $.isPlainObject(obj); };
    var _isNumber =function( obj) { return (typeof obj == "number"); };
    var _isBoolean = function(obj) { return (typeof obj == "boolean"); };
    var _isArray = function( obj ) { return Object.prototype.toString.call(obj) === "[object Array]"; };
    var _isUndefined = function(obj) { return (typeof obj  == "undefined"); };
    var _isEmpty = function(obj) { return _isUndefined(obj) || obj == null; };	
    
    var _stringify = function(object)
    {
    	return JSON.stringify(object);
    };

    var _compactArray = function(arr) {
        var n = [], l=arr.length,i;
        for(i = 0 ; i < l ; i++) {
           if( !lang.isNull(arr[i]) && !lang.isUndefined(arr[i]) ) {
              n.push(arr[i]);
           }
        }
        return n;
     };
    
    /*
    var _escapeHTML = function(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    };
    var _spliceIn = function(source, splicePoint, splice) {
    	return source.substring(0, splicePoint) + splice + source.substring(splicePoint, source.length);
    };
    var _indexOf = function(el, arr, fn)
    {
    	var l=arr.length,i;		
		
    	if ( !_isFunction(fn) ) 
		{
    		fn = function(elt,arrElt) 
    		{ 
    			return elt === arrElt; 
    		}; 
    	}
		
		for ( i = 0 ;i < l ; i++ ) 
		{
			if ( fn.call({}, el, arr[i]) ) 
			{ 
				return i; 
			}
		}
		
		return -1;
	};
	*/    
	var _endsWith = function(text, suffix) { return text.indexOf(suffix, text.length - suffix.length) !== -1; };
    var _startsWith = function(text, prefix) { return (text.match("^"+prefix)==prefix); };
    /*
    var _isURI = function(obj) { _isString(obj) && (_startsWith(obj, "http://") || _startsWith(obj, "https://") || _startsWith(obj, "/")); };
    var _traverseObject = function(object, keys, subprop)
    {
    	if (_isString(keys))
    	{
    		keys = keys.split(".");
    	}
    	
    	var element = null;
    	var current = object;
    	
    	var key = null;
    	do
    	{
    		key = keys.shift();
    		if (subprop && key == subprop)
    		{
    			key = keys.shift();
    		}
    		if (current[key])
    		{
    			current = current[key];
        		if (keys.length == 0)
        		{
        			element = current;
        		}    			
    		}
    		else
    		{
    			keys = [];
    		}    		
    	}
    	while (keys.length > 0);
    	
    	return element;
    };
    
    var _each = function(data, func)
    {
    	if (_isArray(data))
    	{
			for (var i = 0; i < data.length; i++)
			{
				func.apply(data[i]);
			}
    	}
    	else if (_isObject(data))
    	{
    		for (var key in data)
    		{
    			func.apply(data[key]);
    		}
    	}
    };
    
    var _merge = function(obj1, obj2, validKeyFunction)
    {
    	if (!obj1)
		{
			obj1 = {};
		}
		for (var key in obj2)
    	{
    		var valid = true;
    		
    		if (validKeyFunction)
    		{
    			valid = validKeyFunction(key);
    		}
    		
    		if (valid)
    		{
				if (_isEmpty(obj2[key]))
				{
					obj1[key] = obj2[key];
				}
				else
				{
	    			if (_isObject(obj2[key]))
	    			{
	    				if (!obj1[key])
						{
							obj1[key] = {};
						}
						obj1[key] = _merge(obj1[key], obj2[key]);
	    			}
	    			else
	    			{
	    				obj1[key] = obj2[key];
	    			}
				}
    		}
    	}
    	
    	return obj1;
    }
    
    var _cloneObject = function(obj)
    {
    	var clone = { };
    	
    	for (var i in obj)
    	{
    		if (_isObject(obj[i]))
    		{
    			clone[i] = _cloneObject(obj[i]);
    		}
    		else
    		{
    			clone[i] = obj[i];
    		}
    	}
    	
    	return clone;
    };
    
    var _substituteTokens = function(text, args)
    {
    	for (var i = 0; i < args.length; i++)
    	{
    		var token = "{" + i + "}";
    		
    		var x = text.indexOf(token);
    		if (x > -1)
    		{
    			var nt = text.substring(0,x) + args[i] + text.substring(x+3);
    			text = nt;
    			//text = Alpaca.replaceAll(text, token, args[i]);
    		}
    	}
    	
    	return text;
    };
    */
    
    var _initXMLHttpClient = function() 
    {
    	var http = null;

    	try 
    	{
    		// Mozilla/Safari/IE7 (normal browsers)
    		http = new XMLHttpRequest();
    		
    	} 
    	catch (e) 
    	{
    		// IE (?!)
    		var success = false;
    		var XMLHTTP_IDS = new Array('MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
    				'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP');

    		for ( var i = 0; i < XMLHTTP_IDS.length && !success; i++) 
    		{
    			try 
    			{
    				success = true;
    				http = new ActiveXObject(XMLHTTP_IDS[i]);
    			} 
    			catch (e) 
    			{
    			}
    		}

    		if (!success)
    		{
    			throw new Error('Unable to create XMLHttpRequest!');
    		}
    	}

    	return http;
    }
    
    /**
     * Implementation of Gitana Ajax Support
     * Assumes that communication is always JSON
     */
    var _ajax = function (method, url, jsonData, successCallback, failureCallback) 
	{
		var http = _initXMLHttpClient();

		// treat the method
		if (method == null)
		{
			method = "get";
		}
		method = method.toLowerCase();

		// create the connection
		http.open(method, url, true, "admin", "admin");		
		
		// slightly different behaviors here based on method
		if (method == "get")
		{
		}
		else if (method == "post")
		{
			//http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			http.setRequestHeader("Content-Type", "application/json");
		}
		else if (method == "put")
		{
			//http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			http.setRequestHeader("Content-Type", "application/json");
		}
		else if (method == "delete")
		{
		}

		// set content header
		//http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		//application/x-www-form-urlencoded
		
		// detect when document is loaded
		http.onreadystatechange = function () 
		{
			if (http.readyState == 4) 
			{
				if(http.status == 200) 
				{
					var result = "";
					if (http.responseText)
					{
						result = http.responseText;
					}
					
					//\n's in JSON string, when evaluated will create errors in IE
					result = result.replace(/[\n\r]/g,"");
					result = eval('('+result+')'); 
	
					//Give the data to the callback function.
					if (successCallback && _isFunction(successCallback))
					{
						successCallback(result);
					}
				} 
				else 
				{
					if (failureCallback && _isFunction(failureCallback))
					{
						failureCallback(http);
					}
				}
			}
		};
		
		var toSend = null;
		if (jsonData != null)
		{
			toSend = _stringify(jsonData);
		}
		http.send(toSend);
	};

	
	
	
	/************************************************/
	/**                                            **/
	/** GITANA DRIVER                              **/
	/**                                            **/
	/************************************************/	
	
    var Gitana = function(serverURL, key)
    {
    	if (serverURL)
    	{
    		this.serverURL = serverURL;
    	}
    	else
    	{
    		this.serverURL = "/proxy";
    	}
    	
    	if (key)
    	{
    		this.key = key;
    	}
    	else
    	{
    		this.key = null;
    	}
    	
    	
    	/************************************************/
    	/**                                            **/
    	/** PRIVATE METHODS                            **/
    	/**                                            **/
    	/************************************************/
    	
    	this.makeArray = _makeArray;
    	this.isFunction = _isFunction;
    	this.isString = _isString;
    	this.isObject = _isObject;
    	this.isNumber = _isNumber;
    	this.isBoolean = _isBoolean;
    	this.isArray = _isArray;
    	this.isUndefined = _isUndefined;
    	this.isEmpty = _isEmpty;
    	this.startsWith = _startsWith;
    	this.endsWith = _endsWith;
    	this.compactArray = _compactArray;
    	
    	// ajax workhorse
    	this.ajax = function(method, url, jsonData, successCallback, failureCallback)
        {
    		// make sure we compute the real url
        	if (_startsWith(url, "/"))
        	{
        		url = this.serverURL + url;
        	}
        	
        	_ajax(method, url, jsonData, successCallback, failureCallback);
        };
        
        this.ajaxGet = function(url, successCallback, failureCallback)
        {
        	this.ajax("GET", url, null, successCallback, failureCallback);
        };
        
        this.ajaxPost = function(url, jsonData, successCallback, failureCallback)
        {
        	this.ajax("POST", url, jsonData, successCallback, failureCallback);
        };
        
        this.ajaxPut = function(url, jsonData, successCallback, failureCallback)
        {
        	this.ajax("PUT", url, jsonData, successCallback, failureCallback);
        };
        
        this.ajaxDelete = function(url, successCallback, failureCallback)
        {
        	this.ajax("DELETE", url, null, successCallback, failureCallback);
        };
        
    };  
    
    
	/************************************************/
	/**                                            **/
	/** STATIC METHODS                             **/
	/**                                            **/
	/************************************************/
    
    Gitana.ajaxErrorHandler = function(httpObject)
    {
    	alert("Error: " + httpObject.status);
    };

    Gitana.version = VERSION;
    Gitana.stringify = _stringify;
        	
    window.Gitana = Gitana;
    
})(window);
