# Evolv

Apply new versions of your project instance

## Follow the project

* [Licence](https://github.com/XavierBoubert/evolv/blob/master/LICENSE)
* [Changelog](https://github.com/XavierBoubert/evolv/blob/master/CHANGELOG.md)
* [Milestones](https://github.com/XavierBoubert/evolv/issues/milestones?state=open)

## Installation

Use the CDN version:
```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/evolv/0.1.0/evolv.min.js"></script>
```

Or copy the [dist](https://github.com/XavierBoubert/evolv/tree/master/dist) folder into your project and include ```evolv.js``` or ```evolv.min.js``` (production) file in your HTML page or your node project.

## How to use

 - [Introduction](#introduction)
 - [Apply versions](#apply-versions)
 - [Create version tasks](#create-version-tasks)
 - [Start from a specific version](#start-from-a-specific-version)
 - [Get the last version applied](#get-the-last-version-applied)

### Introduction

Evolv is used to apply nodejs scripts updates in your project. When you deploy in a production server you have to apply database modifications, change folders structure, etc. Evolv executes version by version script to update your server instance to the last production version.

### Apply versions

Require and use Evolv in your project:
```javascript
var evolv = require('evolv');

evolv({}, '0.0.0', function(actualVersion, newVersion) {
  // callback
});
```

The first parameter lets you set options:
- **path** (default: './version'): Set the path where your tasks are stacked.
- **silent** (default: false): If you don't want to see all console.log from Evolv

The second parameter lets you start the script from a predefined version. By default it re-apply all versions.

The third parameter is the callback function. It gives you the predefined version given at first and the most recent version applied by Evolv.

### Create version tasks

In your ```versions``` directory, you have to make one folder by MAJOR.MINOR version. On the inside, you have to create a ```version-MAJOR.MINOR.PATCH.js``` file with your task.

E.g.:
```
+-- version
    +-- 0.1
        +-- version-0.1.0.js
        +-- version-0.1.1.js
    +-- 0.2
        +-- version-0.2.10-my-feature.js
```

A task file works like a true NodeJS module. It's required like any other module but passing arguments:
```javascript
'use strict';

module.exports = function(actualVersion, fileVersion, done) {

  // Do your evolve job here then call done()

  done();
};
```

- **actualVersion**: The predefined version sent at first.
- **fileVersion**: The version of the actual task file.
- **done**: The callback function to call at the end.

## Contribute

To contribute to the project, read the [Contribution guidelines](https://github.com/XavierBoubert/evolv/blob/master/CONTRIBUTING.md).
After that, you can create your own Pull Requests (PR) and submit them here.

## Lead contribution team

* [Xavier Boubert](http://xavierboubert.fr) [@xavierboubert](http://twitter.com/XavierBoubert)
