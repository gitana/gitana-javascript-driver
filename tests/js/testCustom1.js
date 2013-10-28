(function() {

    /**
     * This test is here as a means of providing a place that support can quickly plugin tests for customer
     * environments.  In the stock test framework, it doesn't do anything other than NOOP out.
     */

    module("custom1");

    // Test case : Custom Test #1
    test("Gitana Custom #1", function()
    {
        stop();

        /*
        Gitana.connect({
            'baseURL': "http://TODO",
            'ticketMaxAge': 5
        }).then(function() {
            console.log('CONNECTED');

            start();
        });
        */

        start();

    });

}());
