# Hyperty Runtime Core

### Build status

| Master                                   | Develop                                  |
| ---------------------------------------- | ---------------------------------------- |
| [![Build Status](https://travis-ci.org/reTHINK-project/dev-runtime-core.svg?branch=master)](https://travis-ci.org/reTHINK-project/dev-runtime-core) | [![Build Status](https://travis-ci.org/reTHINK-project/dev-runtime-core.svg?branch=develop)](https://travis-ci.org/reTHINK-project/dev-runtime-core)


--------------------

-	[Overview](#overview)
-	[User View: How to include the Hyperty Runtime Core in other Projects](#user-view)
-	[Developer View](#developer-view)
-	[Tasks](#tasks)

## <a id="note">Note</a>
In order to speed up the installation process, we have removed the first verification of global modules, so, if you want to install this repository, you should globally install  this module:

```shell
npm install -g karma-cli
```

## <a id="overview">Overview</a>

This repository contains the source code and associated documentation of the core components required to support the deployment and execution of Hyperties in user devices or in network servers. The full specification is provided [here]().

The Hyperty Runtime architecture follows a security by design approach where different types of components are executed in isolated sandboxes. Thus, components downloaded from a specific Service Provider are executed in sandboxes that are different from the sandboxes used to execute components downloaded from another service provider. Communication between components running in different sandboxes is only possible through messages exchanged through a Message Bus functionality provided by the Hyperty Runtime Core Sandbox. On the other hand, and according to the ProtoOFly concept, the protocol stub is executed in isolated sandbox and provides the bridge for the Hperty Runtime to communicate with associated Service Provider.

Hyperty Core Runtime components are platform agnostic and are to be included in platform specific Hyperty Runtimes, like Web Browsers and Nodejs based platforms.

The detailed specification of the Hyperty Runtime Core is provided [here](https://github.com/reTHINK-project/specs/blob/master/runtime/readme.md) and the full reTHINK Framework is provided [here](https://github.com/reTHINK-project/specs).

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

if you find some issues, please submit them into the respective repository;

---

## <a id="developer-view">Developer view</a>

### Setup Environment

To install the runtime-core repository in your machine, you can clone the github and run the following command;

```shell
# install all the dependencies
npm install
```
---

### Issues

if you have some trouble with the environment, you can open an issue [here](https://github.com/reTHINK-project/dev-runtime-core/issues);


### Javascript Environment

JavaScript code should be written in ES6. There are direct dependencies from nodejs and npm, these can be installed separately or in conjunction with [nvm](https://github.com/creationix/nvm)

#### Dependencies

-  nodejs

-  npm

-  karma - Make the communication between unit test tool and jenkins. See more on [karma](http://karma-runner.github.io/0.13/index.html)

-  mocha - Unit test tool. See more on [http://mochajs.org](http://mochajs.org/)

   ​

#### Code Style and Hinting

On the root directory you will find **.eslintrc.yml** based on the [google style code](http://eslint.org/docs/user-guide/migrating-from-jscs#converting-presets) without some restrictions, this file are helpers to maintain syntax consistency (this could be changed if we understand), it signals syntax mistakes and makes the code equal for all developers.

-	[eslint](http://eslint.org/) - Maintain JavaScript Code Style

All IDE's and Text Editors can handle these tools.

```shell
# to check if the code is aligned with the style code
npm run test:lint
```


#### Documentation

To generates api documentation, check [here](#documentation-task);

#### Unit Testing

Unit testing can be launched manually with **karma start**.
The tool to do the tests is the [chaijs](http://chaijs.com/), with expect;

##### Karma

if you have some problems starting the karma tests, try running this commands for the following order:

1.  `npm uninstall karma karma-browserify karma-mocha karma-mocha-reporter karma-chrome-launcher -g`

2.  `npm install karma-cli -g`

3.  `npm install`

    ​

##### Note

This repository is ready to start working on development of runtime-core. The code will go to the **src** folder. The unit tests will be on **test** folder, following the name standard <component>.spec.js

---

## <a id="tasks">Gulp Tasks</a>

-	[Documentation](#documentation-task)
-	[License](#license)
-	[Dist](#dist)

### <a id="documentation-task">Documentation</a>

```shell
# Generate all the associated to the runtime core;
npm run build:doc
```

> Generate all documentation associated to runtime core;
>
> -  if you run **gulp doc** the documentation based on jsdoc3 will be generated on folder docs/jsdoc and you can interact;
>
>    `gulp doc`  **deprecated**
>
> -  if you run **gulp api** the documentation is generate based on docs/api/ html files, and converted to markdown;
>
>    `gulp api`  **deprecated**
>
> -  if you run **gulp docx** should be generated an .docx file, but **this process should be optimized**, is not working very well;
>
>    `gulp docx ` **deprecated**

### License

The license text will be added to all files after it build

> To add the license text to all files in src folder;
>
> `gulp license` **deprecated**



### Dist

To distribute the runtime-core, you can make a distribution file.

Run the command:

```shell
# make a build of core components to be used for development; The files could be a little large because include the sourceMaps;
npm run build:dev

# make a build of core components to be used form production;
npm run build:prod
```
