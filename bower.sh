#!/bin/bash

cp -r ./dist/* ../cloudcms-components/gitana
cd ../cloudcms-components/gitana
git add *
git commit -m "update to latest release"
git push origin master
cd ../../gitana-javascript-driver

