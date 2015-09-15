# Runtime-Core

## Set Environment

If is the first time you are cloning this repository, you need to run the command ```npm run init-setup```;
After this command you need to have 2 folders (node_modules and vendor), these folder don't go to the repository, is only for development;

## Javascript Environment

We have an direct dependencies from nodejs and npm, they can be installed separately or both with [nvm](https://github.com/creationix/nvm)

### dependencies:

* nodejs
* npm
* karma - Make the communication between unit test tool and jenkins. See more on [karma](http://karma-runner.github.io/0.13/index.html)
* mocha - Unit test tool. See more on [http://mochajs.org](http://mochajs.org/)
* jspm - Don't need compile the code, it use babel (or traucer or typescript) to run ES6 code on browser. Know more in [jspm.io](http://jspm.io/)

### Code Style and Hinting

On root of this directory, hidden, you will find **.jshintrc** and **.jscsrc**, this files can  help and prevent some syntax mistakes, and make the code equal for all, respectively;

With these tools all developers can read the code in same way.

- [jscs](http://jscs.info/) - JavaScript Code Style
- [jshint](http://jshint.com/) - tool that helps to detect errors and potential problems in your JavaScript code.

All IDEs and Text Editors can handle with this tools;

### Note
This repository is already ready to start working on development of runtime-core;

Your code going to the src folder;

You can test your code installing and running [live-server](https://www.npmjs.com/package/live-server), for example, **it isn't mandatory;**
