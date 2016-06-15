'use strict';

var path = require('path'),
    glob = require('glob');

module.exports = function(options, actualVersion, callback) {

  options = options || {};
  options.silent = options.silent || false;
  options.path = path.resolve(options.path || './versions');

  function log(text, inline) {
    if (!options.silent) {
      if (inline) {
        process.stdout.write(text);
      }
      else {
        console.log(text);
      }
    }
  }

  function versionGreaterThan(versionA, versionB) {
    versionA = versionA.split('.');
    versionB = versionB.split('.');

    for (var i = 0; i < 3; i++) {
      versionA[i] = versionA[i] ? parseInt(versionA[i], 10) : 0;
      versionB[i] = versionB[i] ? parseInt(versionB[i], 10) : 0;

      if (versionA[i] > versionB[i]) {
        return 1;
      }
      else if (versionA[i] < versionB[i]) {
        return -1;
      }
    }

    return 0;
  }

  function loopEvolveFiles(actualVersion, files, done, i, newVersion) {
    i = i || 0;
    newVersion = newVersion || '0.0.0';

    if (i > files.length - 1) {
      return done(newVersion);
    }

    var file = files[i],
        version = file.split('version-').pop().split('.js')[0];

    log('► Task version ' + version + '... ', true);

    if (versionGreaterThan(version, actualVersion) > 0) {
      var task = require(file);

      if (task) {
        task(actualVersion, version, function() {
          log('[APPLIED]\n', true);

          if (versionGreaterThan(version, newVersion)) {
            newVersion = version;
          }

          loopEvolveFiles(actualVersion, files, done, ++i, newVersion);
        });
      }

      return;
    }

    if (versionGreaterThan(version, newVersion) > 0) {
      newVersion = version;
    }

    log('[ALREADY APPLIED]\n', true);

    loopEvolveFiles(actualVersion, files, done, ++i, newVersion);
  }

  actualVersion = actualVersion || '0.0.0';

  var files = glob.sync(path.join(options.path, '**', '*version-*.js'));

  files.sort(function(a, b) {
    var startA = a.indexOf('version-') + 'version-'.length,
        startB = b.indexOf('version-') + 'version-'.length,
        versionA = a.substr(startA, a.length - startA - 3),
        versionB = b.substr(startB, b.length - startB - 3);

    return versionGreaterThan(versionA, versionB);
  });

  console.log(files);

  log('\n--- EVOLV ---\n');
  log('► From version: ' + actualVersion);

  loopEvolveFiles(actualVersion, files, function(newVersion) {
    log('\n--- /EVOLV ---');

    if (callback) {
      callback(actualVersion, newVersion);
    }
  });

};
