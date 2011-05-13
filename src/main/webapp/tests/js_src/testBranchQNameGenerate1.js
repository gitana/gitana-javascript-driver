(function($) {

    module("branchQNameGenerate1");

    // Test case : Branch QName generation..
    test("Branch QName generation.", function() {
        stop();

        expect(1);

        // object upon which we base the qname
        var object = {
            "title": "My First Title"
        };

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin")
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
