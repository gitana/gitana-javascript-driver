# Gitana Driver for Cloud CMS

This driver provides connectivity between a JavaScript application and Cloud CMS.  The JavaScript application can be
running within the browser or on the server.  The Gitana Driver supports both global namespace (conventional)
JavaScript applications as well as CommonJS/AMD containers such as NodeJS.

## In the Web Browser

To use this driver within your browser application, you first download the driver and then pull into your page
like so:

```bash
<script type="text/javascript" src="gitana.min.js"></script>
```

And then you connect to Cloud CMS by identifying your client key/secret and authentication username and password.

```bash
var platform = new Gitana({
    "clientKey": "${clientKey}",
    "clientSecret": "${clientSecret"}"
}).authenticate({
    "username": "demo",
    "password": "demo"
});
```

Where ${clientKey} and ${clientSecret} are client credentials generated with your Cloud CMS subscription.

## In Node JS

This driver is available via the NPM registry (http://www.npmjs.org) as "gitana".  Using it in Node JS is pretty
easy.  You can do something like the following:

```bash
var Gitana = require('gitana');
var platform = new Gitana({
    "clientKey": "${clientKey}",
    "clientSecret": "${clientSecret"}"
}).authenticate({
    "username": "demo",
    "password": "demo"
});
```

## Driver API and Chaining

This driver makes it really simple to work with Cloud CMS data stores and objects as though they were local objects
right within your JS application.  The driver lets you get at all of the runtime and authoring capabilities of the
system.

In addition, this driver features asynchronous method chaining.  This lets you chain together commands that go over
the wire and avoid a lot of the headache of manually managing callbacks.  As a result, your code is smaller, there
is less to manage and it's easier to read.

Here is an example

```bash
platform.createRepository().readBranch("master").createNode({"title": "Hello World"});
```

## Documentation

We've published our documentation for the JavaScript driver as well as other drivers to our
<a href="http://docs.cloudcms.com">Documentation Site</a>.

In addition, we've published <a href="http://code.cloudcms.com/gitana-javascript-driver/latest/js-doc/allclasses.html">
JavaScript-level API documentation</a>.


## Cloud CMS

You can learn more about Cloud CMS by visiting our web site at
<a href="http://www.cloudcms.com">http://www.cloudcms.com</a>.


## Maintainers
* Michael Uzquiano     uzi@cloudcms.com
* Dr. Yong Qu     drq@cloudcms.com

