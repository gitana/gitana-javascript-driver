(function($) {

    module("chaining2");

    // Test case : Proxied object chaining
    test("Chaining 211", function()
    {
        stop();

        expect(4);


        // first and second
        // verify chaining of custom objects via subchain declarations
        var First = function() {};
        First.prototype = {
            gimme: function()
            {
                var second = new Second();
                return this.subchain(second).then(function() {
                });
            }
        };

        var Second = function() {};
        Second.prototype = {
            some: function()
            {
                var third = new Third();
                return this.subchain(third).then(function() {
                });
            }
        };


        // third
        // verify that auto-generated subchains wrap the same underlying proxied object
        // we can call prototype object methods from the proxied object and they interact
        // with the underlying object
        //
        // NOTE: if we set new properties, they don't work...
        // but if we call .object
        var Third = function() {

            var x = 0;

            // priviledged method
            this.inc = function()
            {
                x++;
            };

            this.check = function()
            {
                return x;
            };

            this.object = {};
        };
        Third.prototype = {

            love: function()
            {
                return this.subchain().then(function() {
                    this.inc();
                }).then(function() {
                    this.inc();
                    this.object.turbo = "ozone";
                }).then(function() {
                    this.inc();
                });
            }
        };

        // test that uses then() as first chain function
        var test1 = Chain(new First());
        test1.then(function() {
            this.gimme().some().love().then(function() {
                equal(this.check(), 3, "Test 1 - Increment value was 3");
                equal(this.object.turbo, "ozone", "Test 1 - Ozone came back");
            })
        });

        // verify that we can fire again using chain method()
        test1.chain().gimme().some().love().then(function() {
            ok(true, "Fired twice, good");

            window.setTimeout(again, 1000);
        });

        /*
        // TODO: this doesn't work at the moment... should it?
        // test that chains can fire methods directly
        var test2 = Chain(new First());
        test2.gimme().some().love().then(function(){
            equal(this.check(), 3, "Test 2 - Increment value was 3");
            equal(this.object.turbo, "ozone", "Test 2 - Ozone came back");

            success();
        });
        */

        var again = function()
        {
            // here we try to reuse the "test1" variable
            // its original chain should have been exhausted
            // verify that we can fire again without chain() method
            test1.gimme().some().love().then(function() {
                ok(true, "Fired third time, good");

                success();
            });
        };

        var success = function()
        {
            start();
        };
    });

}(jQuery) );
