var testLogin = function()
{
    var driver = new Gitana.Driver();
    driver.security().authenticate("admin", "admin", function() {

        if (driver.ticket)
        {
            alert("Successfully acquired ticket: " + driver.ticket);
        }
        else
        {
            alert("#FAIL");
        }
        
    });
};    
