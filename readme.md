# Hyperty Runtime Core [![Build Status](https://travis-ci.org/reTHINK-project/dev-runtime-core.svg?branch=dev-address-reusage)](https://travis-ci.org/reTHINK-project/dev-runtime-core)
--------------------

-	[Overview](#overview)
-	[User View: How to include the Hyperty Runtime Core in other Projects](#user-view)
-	[Developer View](#developer-view)
-	[Tasks](#tasks)

## <a id="note">Note</a>
In order to try speed up the instalation process, we remove the first verification of global modules, so, if you want install this repository, you should install globaly this modules:

```shell
npm install -g karma-cli gulp-cli browserify
```

## <a id="overview">Overview</a>

This repository contains the source code and associated documentation of the core components required to support the deployment and execution of Hyperties in user devices or in network servers. More information about the Hyperty concept and the reTHINK framework in general is provided [here](https://github.com/reTHINK-project/dev-service-framework/blob/master/README.md).

The Hyperty Runtime architecture follows a security by design approach since it was highly influenced by a careful [security analysis](docs/specs/securityanalysis.md) where different types of components are executed in isolated sandboxes. Thus, components downloaded from a specific Service Provider are executed in sandboxes that are different from the sandboxes used to execute components downloaded from another service provider. Communication between components running in different sandboxes is only possible through messages exchanged through a Message Bus functionality provided by the Hyperty Runtime Core Sandbox. On the other hand, and according to the [ProtoOFly concept](https://github.com/reTHINK-project/dev-service-framework/blob/master/docs/manuals/hyperty-messaging-framework.md#protocol-on-the-fly-protofly-and-protostubs), the protocol stub is executed in isolated sandbox and provides the bridge for the Hperty Runtime to communicate with associated Service Provider. The detailed specification of the Hyperty Runtime Core is provided [here](docs/specs/readme.md).

Hyperty Core Runtime components are platform agnostic and are to be included in platform specific Hyperty Runtimes, like Web Browsers and Nodejs based platforms.

## <a id="user-view">User View</a>

**How to include the Hyperty Runtime Core in other Projects**

How to include this repository in other runtime platforms, like [dev-runtime-browser](https://github.com/reTHINK-project/dev-runtime-browser) or [dev-runtime-node](https://github.com/reTHINK-project/dev-runtime-node);

Install the runtime-core like a npm module;
```shell
npm install github:rethink-project/dev-runtime-core#master --save
```

### Browser Environment

```javascript

import {Sandbox, SandboxRegistry, SandboxType} from 'runtime-core/dist/sandbox'
import MiniBus from 'runtime-core/dist/minibus';

console.log('Sandbox: ', Sandbox, SandboxRegistry);
console.log('MiniBus: ', MiniBus);
```

### Nodejs Environment

> **This code, probably, needs to be updated**

```javascript

var Sandbox = require('runtime-core').sandbox;
var MiniBus = require('runtime-core').minibus;

console.log('Sandbox: ', Sandbox);
console.log('MiniBus: ', MiniBus);

```

if you found some issues, please submit them into the respective repository;

---

## <a id="developer-view">Developer view</a>

### Setup Environment

To install the runtime-core repository in your machine, you can clone the github and run the following command;

```shell
npm install
```
---

### Issues

if you have some trouble with the environment, you can open an issue;

### Javascript Environment

JavaScript code should be written in ES6. There are direct dependencies from nodejs and npm, these can be installed separately or in conjunction with [nvm](https://github.com/creationix/nvm)

#### Dependencies

-	nodejs
-	npm
-	karma - Make the communication between unit test tool and jenkins. See more on [karma](http://karma-runner.github.io/0.13/index.html)
-	mocha - Unit test tool. See more on [http://mochajs.org](http://mochajs.org/)
-	gulp - Automate and enhance your workflow. See more about gulp on [gulp](http://gulpjs.com/)

#### Code Style and Hinting

On the root directory you will find **.jshintrc** and **.jscsrc**, these files are helpers to maintain syntax consistency, it signals syntax mistakes and makes the code equal for all developers.

-	[jscs](http://jscs.info/) - Maintain JavaScript Code Style
-	[jshint](http://jshint.com/) - Detect errors and potential problems in JavaScript code.

All IDE's and Text Editors can handle these tools.

#### Documentation

To generates api documentation, check [here](#documentation-task);

#### Unit Testing

Unit testing can be launched manually with **karma start**.

~~It's advisable to use [expect.js](https://github.com/Automattic/expect.js) instead of assert.~~

After investigate and testing the [expect.js](https://github.com/Automattic/expect.js) it don't support some features for ES6, because this tool hasn't activity at some time, that is why, it is recomended use the [chaijs](http://chaijs.com/) it is more versatile and have expect.js (but updated) and others tools that can be useful;

##### Karma

if you have some problems starting the karma tests, try running this commands for the following order:

1.	`npm uninstall karma karma-browserify karma-mocha karma-mocha-reporter karma-chrome-launcher -g`
2.	`npm install karma-cli -g`
3.	`npm install`

##### Note

This repository is ready to start working on development of runtime-core. The code will go to the **src** folder. The unit tests will be on **test** folder, following the name standard <component>.spec.js

---

## <a id="tasks">Gulp Tasks</a>

-	[Documentation](#documentation-task)
-	[License](#license)
-	[Dist](#dist)

### <a id="documentation-task">Documentation</a>

Generate all documentation associated to runtime core;

-	if you run **gulp doc** the documentation based on jsdoc3 will be generated on folder docs/jsdoc and you can interact;

`gulp doc`

-	if you run **gulp api** the documentation is generate based on docs/api/ html files, and converted to markdown;

`gulp api`

-	if you run **gulp docx** should be generated an .docx file, but **this process should be optimized**, is not working very well;

`gulp docx`

### License

To add the license text to all files in src folder;

`gulp license`

### Dist

To distribute the runtime-core, you can make a distribution file.

Run the command:

```shell
# The distribution file will be compacted and uglified;
gulp dist

# in development mode
gulp dist --development
```
