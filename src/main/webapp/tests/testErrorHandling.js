var testErrorHandling = function()
{
    var driver = new Gitana.Driver();
    driver.debug = true;

    var onSuccess = function(repository)
    {
        alert("This shouldn't have been called");
    };

    var onFailure = function(http)
    {
        if (http.status != 404)
        {
            alert("Should have got back a 404!")
        }
        
        alert("SUCCESS");
    };

    driver.repositories().read("SOMETHING_THAT_DOESNT_EXIST", onSuccess, onFailure);
};    
