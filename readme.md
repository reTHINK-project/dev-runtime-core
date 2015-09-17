# Runtime-Core

## Setup Environment
On the first time you are cloning this repository, you need to run the command ```npm run init-setup```;
After running successfully this command you will have 2 folders (node_modules and vendor), these folders are excluded from the commit process, and are only for development.

## Javascript Environment
JavaScript code should be written in ES6.
There are direct dependencies from nodejs and npm, these can be installed separately or in conjunction with [nvm](https://github.com/creationix/nvm)

### dependencies:
* nodejs
* npm
* karma - Make the communication between unit test tool and jenkins. See more on [karma](http://karma-runner.github.io/0.13/index.html)
* mocha - Unit test tool. See more on [http://mochajs.org](http://mochajs.org/)
* jspm - Don't need compile the code, it uses babel (or traucer or typescript) to run ES6 code on browser. Know more in [jspm.io](http://jspm.io/)

### Code Style and Hinting
On the root directory you will find **.jshintrc** and **.jscsrc**, these files are helpers to maintain syntax consistency, it signals syntax mistakes and makes the code equal for all developers.

- [jscs](http://jscs.info/) - Maintain JavaScript Code Style
- [jshint](http://jshint.com/) - Detect errors and potential problems in JavaScript code.

All IDE's and Text Editors can handle these tools.

## Unit Testing
Unit testing can be launched manually with **karma start**.
It's advisable to use [expect.js](https://github.com/Automattic/expect.js) instead of assert.

### Note
This repository is ready to start working on development of runtime-core.
The code will go to the **src** folder.
The unit tests will be on **test** folder, following the name standard <component>.spec.js

The npm module **live-server** can be used for development tests, but it's not mandatory: [live-server](https://www.npmjs.com/package/live-server)
