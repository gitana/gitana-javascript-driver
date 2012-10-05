(function($) {

    module("chaining4");

    // Test case : Speed timing test (chaining 4)
    test("Chaining 420", function()
    {
        stop();
        expect(2);

        // create a JSON object
        var json1 = {
            "title": "My object",
            "description": "A description",
            "url": "http://url.com"
        };
        // stringify
        var text1 = JSON.stringify(json1);

        // chain the object
        var json2 = Chain(json1);
        // stringify
        var text2 = JSON.stringify(json2);

        // make sure the strings are the same
        //console.log("text1: " + text1);
        //console.log("text2: " + text2);

        equal(text2.length, text1.length, "JSON strings are the same length");
        equal(text2, text1, "JSON strings are the same");

        start();

    });

}(jQuery) );
