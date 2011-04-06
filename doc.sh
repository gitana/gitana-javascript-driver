mvn clean install

java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js -a -t=jsdoc-toolkit/templates/tably target/gitana-javascript-driver-1.0.0-SNAPSHOT/js/gitana.js -d=doc
