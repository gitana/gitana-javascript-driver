/**
 * Exercises the driver's HTTP layer against a local server, through the Node XHR
 * shim. This covers the seam between the driver and fetch without needing a
 * Cloud CMS instance.
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import http from "node:http";
import { Gitana } from "./support/driver.mjs";

var server = null;
var baseURL = null;
var received = [];

before(function() {

    server = http.createServer(function(req, res) {

        var chunks = [];
        req.on("data", function(chunk) { chunks.push(chunk); });
        req.on("end", function() {

            received.push({
                "method": req.method,
                "url": req.url,
                "headers": req.headers,
                "body": Buffer.concat(chunks).toString("utf8")
            });

            if (req.url === "/slow")
            {
                // never responds; the driver should time out and abort
                return;
            }

            if (req.url === "/missing")
            {
                res.writeHead(404, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ "message": "not found" }));
            }

            if (req.url === "/boom")
            {
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ "message": "server error" }));
            }

            res.writeHead(200, {
                "Content-Type": "application/json",
                "X-Custom-Header": "custom-value"
            });
            res.end(JSON.stringify({ "ok": true, "method": req.method }));
        });
    });

    return new Promise(function(resolve) {
        server.listen(0, "127.0.0.1", function() {
            baseURL = "http://127.0.0.1:" + server.address().port;
            resolve();
        });
    });
});

after(function() {
    return new Promise(function(resolve) {
        server.close(resolve);
    });
});

var request = function(options)
{
    return new Promise(function(resolve, reject) {

        var http = new Gitana.Http();

        http.request(Object.assign({}, options, {
            "success": function(response, xhr) { resolve({ "response": response, "xhr": xhr }); },
            "failure": function(response, xhr) { reject({ "response": response, "xhr": xhr }); }
        }));
    });
};

describe("node xhr shim", function() {

    it("performs a GET and returns the body", async function() {

        received = [];

        var result = await request({ "method": "GET", "url": baseURL + "/thing" });

        assert.equal(result.xhr.status, 200);
        assert.deepStrictEqual(JSON.parse(result.response.text), { "ok": true, "method": "GET" });
        assert.equal(received[0].method, "GET");
        assert.equal(received[0].url, "/thing");
    });

    it("sends a request body on POST", async function() {

        received = [];

        var payload = JSON.stringify({ "title": "hello" });

        await request({
            "method": "POST",
            "url": baseURL + "/thing",
            "data": payload,
            "headers": { "Content-Type": "application/json" }
        });

        assert.equal(received[0].method, "POST");
        assert.equal(received[0].body, payload);
        assert.equal(received[0].headers["content-type"], "application/json");
    });

    it("passes request headers through", async function() {

        received = [];

        await request({
            "method": "GET",
            "url": baseURL + "/thing",
            "headers": { "Authorization": "Bearer token-123" }
        });

        assert.equal(received[0].headers["authorization"], "Bearer token-123");

        // the driver sets these itself
        assert.equal(received[0].headers["accept"], "application/json");
        assert.equal(received[0].headers["x-requested-with"], "XMLHttpRequest");
    });

    it("exposes response headers to the driver", async function() {

        var result = await request({ "method": "GET", "url": baseURL + "/thing" });

        assert.equal(result.response.responseHeaders["x-custom-header"], "custom-value");
    });

    it("routes 404 to the failure handler", async function() {

        await assert.rejects(
            request({ "method": "GET", "url": baseURL + "/missing" }),
            function(err) {
                assert.equal(err.xhr.status, 404);
                assert.deepStrictEqual(JSON.parse(err.response.text), { "message": "not found" });
                return true;
            }
        );
    });

    it("routes 500 to the failure handler", async function() {

        await assert.rejects(
            request({ "method": "GET", "url": baseURL + "/boom" }),
            function(err) {
                assert.equal(err.xhr.status, 500);
                return true;
            }
        );
    });

    it("times out and aborts a hanging request", async function() {

        var previous = Gitana.HTTP_TIMEOUT;
        Gitana.HTTP_TIMEOUT = 250;

        try
        {
            await assert.rejects(
                request({ "method": "GET", "url": baseURL + "/slow" }),
                function(err) {
                    assert.equal(err.response.timeout, true);
                    return true;
                }
            );
        }
        finally
        {
            Gitana.HTTP_TIMEOUT = previous;
        }
    });
});
