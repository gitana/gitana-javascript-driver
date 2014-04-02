#!/bin/bash

cd ../gitana-node-js
grunt
git add lib
git add package.json
git add index.js
git commit -m "update to latest release"
git push origin master
npm publish --force
cd ../gitana-javascript-driver

