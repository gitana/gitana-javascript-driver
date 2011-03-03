var testLogin = function()
{
    var gitana = new Gitana();
    gitana.security().authenticate("admin", "admin", function() {
        if (gitana.ticket)
        {
            alert("Successfully acquired ticket: " + gitana.ticket);
        }
        else
        {
            alert("#FAIL");
        }
    });
};    
