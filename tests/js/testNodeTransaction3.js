(function($) {

    module("nodeTransaction3");

    // Test case : Node Transaction 3
    _asyncTest("Node Transaction 3", function()
    {
        expect(5);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // create a repository and get the master branch
            var branch = null;
            this.createRepository().readBranch("master").then(function() {
                branch = this;
            });

            this.then(function() {

                // create a transaction

                // TODO: this syntax doesn't work
                //var t = Gitana.transactions().create();
                //t.for(branch);

                var t = Gitana.transactions().create(branch);

                // create the following hierarchy
                //
                //      /
                //        /folder1
                //          /folder2
                //            /file1.txt
                //            /file2.txt
                //        /folder3
                //          /file3.txt
                //        /file4.txt

                t.create({
                    "title": "folder1",
                    "_parentFolderPath": "/"
                });
                t.create({
                    "title": "folder2",
                    "_parentFolderPath": "/folder1"
                });
                t.create({
                    "title": "file1.txt",
                    "p1": "v1",
                    "_parentFolderPath": "/folder1/folder2"
                });
                t.create({
                    "title": "file2.txt",
                    "p1": "v1",
                    "_parentFolderPath": "/folder1/folder2"
                });
                t.create({
                    "title": "folder3",
                    "_parentFolderPath": "/"
                });
                t.create({
                    "title": "file3.txt",
                    "_parentFolderPath": "/folder3"
                });
                t.create({
                    "title": "file4.txt",
                    "_parentFolderPath": "/"
                });

                // commit
                t.commit().then(function(results) {

                    // now do some verification
                    ok(results.ok, "Transaction was OK");
                    ok(results.totalCount == results.successCount, "Transaction count was OK");

                    // find the two files (file1.txt and file2.txt, both which have property p1 == v1)
                    Chain(branch).queryNodes({
                        "p1": "v1"
                    }).count(function(count) {
                        equal(2, count, "Found two matching nodes");
                    }).each(function() {

                        // for each, find the parent folder
                        // should be 1 parent folder
                        this.listRelatives({
                            "type": "a:child",
                            "direction": "incoming"
                        }).each(function() {
                            ok(this.title == "folder2");
                        });

                    }).then(function() {
                        success();
                    });

                });
            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
