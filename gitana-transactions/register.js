// lib/gitana-transactons/register.js
//
// Overwrites Module.prototype.require with with another function which
// intercepts the loading of the gitana module and adds transaction support to
// it.

var Module = require('module');

var oldRequire = Module.prototype.require;

var extendGitana = require('./gitana/');

var Gitana;

Module.prototype.require = function(name) {
  if (name === 'gitana') {
    if (!Gitana) {
      var Gitana = oldRequire.apply(this, arguments);
      extendGitana(Gitana);
    }
    return Gitana;
  } else {
    return oldRequire.apply(this, arguments);
  }
};
