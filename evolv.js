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

    return !!(
      versionA[0] > versionB[0] ||
      (versionA[0] == versionB[0] && versionA[1] > versionB[1]) ||
      (versionA[0] == versionB[0] && versionA[1] == versionB[1] && versionA[2] > versionB[2])
    );
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

    if (versionGreaterThan(version, actualVersion)) {
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

    if (versionGreaterThan(version, newVersion)) {
      newVersion = version;
    }

    log('[ALREADY APPLIED]\n', true);

    loopEvolveFiles(actualVersion, files, done, ++i, newVersion);
  }

  actualVersion = actualVersion || '0.0.0';

  var files = glob.sync(path.join(options.path, '**', 'version-*.js'));

  log('\n--- EVOLV ---\n');
  log('► From version: ' + actualVersion);

  loopEvolveFiles(actualVersion, files, function(newVersion) {
    log('\n--- /EVOLV ---');

    if (callback) {
      callback(actualVersion, newVersion);
    }
  });

};
