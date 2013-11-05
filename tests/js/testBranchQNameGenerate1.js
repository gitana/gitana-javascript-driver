(function($) {

    module("branchQNameGenerate1");

    // Test case : Branch QName generation..
    _asyncTest("Branch QName generation.", function()
    {
        expect(1);

        // object upon which we base the qname
        var object = {
            "title": "My First Title"
        };

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana
                .createRepository()
                .readBranch("master")
                .generateQName(object, function(qname) {

            equal(qname , "custom:myfirsttitle0", "QName should have been: custom:myfirsttitle0");
            success();

        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
