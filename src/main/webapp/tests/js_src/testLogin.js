(function($) {

    module("login");
    // Test case : Login.
    test("Login", function() {
        stop();

        expect(1);
        var driver = new Gitana.Driver();
        driver.security().authenticate("admin", "admin", function() {

            ok(driver.ticket, "Successfully acquired ticket: " + driver.ticket);

            start();

        });
    });

}(jQuery) );