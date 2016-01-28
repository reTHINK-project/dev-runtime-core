<div class="navbar navbar-default navbar-fixed-top">

<div class="container">

<div class="navbar-header">

[Documentation](index.html){.navbar-brand}
<span class="icon-bar"></span> <span class="icon-bar"></span> <span
class="icon-bar"></span>

</div>

<div id="topNavigation" class="navbar-collapse collapse">

-   [Modules****](modules.list.html){.dropdown-toggle}
    -   [utils](module-utils.html)
-   [Classes****](classes.list.html){.dropdown-toggle}
    -   [AddressAllocation](AddressAllocation.html)
    -   [BloomFilter](BloomFilter.html)
    -   [EventEmitter](EventEmitter.html)
    -   [GlobalRegistryRecord](GlobalRegistryRecord.html)
    -   [GraphConnector](GraphConnector.html)
    -   [GraphConnectorContactData](GraphConnectorContactData.html)
    -   [HypertyDiscovery](HypertyDiscovery.html)
    -   [HypertyInstance](HypertyInstance.html)
    -   [IdentityModule](IdentityModule.html)
    -   [MessageBus](MessageBus.html)
    -   [MiniBus](MiniBus.html)
    -   [ObjectAllocation](ObjectAllocation.html)
    -   [Pipeline](Pipeline.html)
    -   [PolicyEngine](PolicyEngine.html)
    -   [ProtoStub](ProtoStub.html)
    -   [QoSUA](QoSUA.html)
    -   [Registry](Registry.html)
    -   [RegistryDataModel](RegistryDataModel.html)
    -   [RuntimeUA](RuntimeUA.html)
    -   [Sandbox](Sandbox.html)
    -   [SandboxRegistry](SandboxRegistry.html)
    -   [SyncherManager](SyncherManager.html)

<div class="col-sm-3 col-md-3">

<div class="input-group">

<div class="input-group-btn">

**

</div>

</div>

</div>

</div>

</div>

</div>

<div id="toc-content" class="container">

<div class="row">

<div class="col-md-8">

<div id="main">

<div class="section readme-section">

Runtime-Core
------------

-   [Release 0.1.0](release_notes_0.1.0.md)
-   [Example](#example)
-   [Tasks](#tasks)
-   [Notes](#notes)

### Setup Environment

On the first time you are cloning this repository, you need to run the
command:

``` {.prettyprint .source}
npm run init-setup
```

After running successfully this command you will have 2 folders
(node\_modules and vendor), these folders are excluded from the commit
process, and are only for development.

if you already have the project configured on your machine, you only
need run the next command to add new dependencies:

``` {.prettyprint .source}
npm install
jspm install
```

------------------------------------------------------------------------

**Private Repository Note**

if you have problems with the `npm install` command, like “access was
forbidden”, “404 not found”, and have the service framework module
reference, it is an authentication problem;

you may need following the steps present on [Github
Help](https://help.github.com/articles/generating-ssh-keys/). and select
operation system you are using.

This could happen because it is a private module and need your GitHub
authentication to allow cloning the repository.

If you have some troubles with authentication on windows using the Git
Shell, you can try [caching your GitHub
password](https://help.github.com/articles/caching-your-github-password-in-git/#platform-windows).
This should avoid the constant prompt for username and password;

**Instalation through jspm**

We need configure jspm config using github tokens, for that, following
this (based on issue
[3](https://github.com/reTHINK-project/dev-runtime-browser/issues/3)):

1.  [Here](https://github.com/settings/tokens), generate token with
    public\_repo permission enabled
2.  Save the token generated;
3.  Execute the command `jspm registry config github` and you’ll be
    asked for the credentials;
4.  Now you can execute command `jspm install -y and the runtime-core`
    or
    `jspm install runtime-core=github:reTHINK-project/dev-runtime-core`
    or only `jspm install`;

------------------------------------------------------------------------

**Issues**

if you have some trouble with the environment, you can open an issue;

### Javascript Environment

JavaScript code should be written in ES6. There are direct dependencies
from nodejs and npm, these can be installed separately or in conjunction
with [nvm](https://github.com/creationix/nvm)

#### Dependencies

-   nodejs
-   npm
-   karma - Make the communication between unit test tool and jenkins.
    See more on [karma](http://karma-runner.github.io/0.13/index.html)
-   mocha - Unit test tool. See more on
    [http://mochajs.org](http://mochajs.org/)
-   jspm - Don’t need compile the code, it uses babel (or traucer
    or typescript) to run ES6 code on browser. Know more in
    [jspm.io](http://jspm.io/)
-   gulp - Automate and enhance your workflow. See more about gulp on
    [gulp](http://gulpjs.com/)

#### Code Style and Hinting

On the root directory you will find **.jshintrc** and **.jscsrc**, these
files are helpers to maintain syntax consistency, it signals syntax
mistakes and makes the code equal for all developers.

-   [jscs](http://jscs.info/) - Maintain JavaScript Code Style
-   [jshint](http://jshint.com/) - Detect errors and potential problems
    in JavaScript code.

All IDE’s and Text Editors can handle these tools.

#### Documentation

To generates api documentation you can run `gulp doc`

### Unit Testing

Unit testing can be launched manually with **karma start**.

~~It’s advisable to use
[expect.js](https://github.com/Automattic/expect.js) instead of
assert.~~

After investigate and testing the
[expect.js](https://github.com/Automattic/expect.js) it don’t support
some features for ES6, because this tool hasn’t activity at some time,
that is why, it is recomended use the [chaijs](http://chaijs.com/) it is
more versatile and have expect.js (but updated) and others tools that
can be useful;

------------------------------------------------------------------------

### How to include this runtime-core code into others parts of reTHINK Project;

How to include this repository in other software parts, like
[dev-runtime-browser](https://github.com/reTHINK-project/dev-runtime-browser)
or
[dev-runtime-node](https://github.com/reTHINK-project/dev-runtime-node)
- for example;

#### browser project

example:
[dev-runtime-browser](https://github.com/reTHINK-project/dev-runtime-browser)

Verify these use cases:

1.  if you will create a new repository, you can use this template, and
    can configure your development environment;
2.  if you already have an respository cloned;

for both cases you just have run the command:

``` {.prettyprint .source}
jspm install runtime-core=github:rethink-project/dev-runtime-core@dev-0.2
```

and on javascript code you need import the script like other modules;

``` {.prettyprint .source}
import RuntimeUA from 'runtime-core/dist/runtimeUA';
import {Sandbox, SandboxRegistry} from 'runtime-core/dist/sandbox'
import MiniBus from 'runtime-core/dist/minibus';

console.log('Runtime: ', RuntimeUA);
console.log('Sandbox: ', Sandbox, SandboxRegistry);
console.log('MiniBus: ', MiniBus);
```

#### nodejs

[dev-runtime-node](https://github.com/reTHINK-project/dev-runtime-node)

``` {.prettyprint .source}
npm install github:rethink-project/dev-runtime-core#dev-0.2 --save
```

after this you can require the runtime-core like other modules on node;

``` {.prettyprint .source}
var RuntimeUA = require('runtime-core').runtimeUA;

var runtime = new RuntimeUA();
```

if you found some issues, please submit them into the respective
repository;

------------------------------------------------------------------------

### Karma

if you have some problems starting the karma tests, try running this
commands for the following order:

1.  `npm uninstall karma karma-browserify karma-mocha karma-mocha-reporter karma-chrome-launcher -g`
2.  `npm install karma-cli -g`
3.  `npm install`
4.  `jspm update`

#### Note

This repository is ready to start working on development of
runtime-core. The code will go to the **src** folder. The unit tests
will be on **test** folder, following the name standard .spec.js

To run karma tests is mandatory to run **live-server** because of the
mock-up’s dependencies:

``` {.prettyprint .source}
live-server --port=4000
```

### [Tasks](){#Tasks}

-   [Documentation](#documentation)
-   [Dist](#dist)
-   [Build](#build)
-   [Encode](#encode)

##### Documentation

Generate all documentation associated to runtime core; Run the command:

``` {.prettyprint .source}
gulp docs
```

##### Dist

To distribute the runtime-core, you can make a distribution file.

Run the command:

``` {.prettyprint .source}
// compact true | false;
gulp dist --compact=false
```

##### Build

To distribute the runtime-core, but with the source code maps, and to
detect where is some error.

Run the command:

``` {.prettyprint .source}
gulp build
```

##### Encode

In this repository, we have some tasks which can help you. If you need
change some resource file, like an Hyperty or ProtoStub, and load it to
the Hyperties.json or ProtoStubs.json, run the following command, and
answer to the questions;

``` {.prettyprint .source}
gulp compile --file=path/to/file;
```

### [Example](){#example}

This repository have a folder with an working example of Hyperty
Connector and we can send message and make a WebRTC call between remote
hyperties through the vertx;

To run the demo on example folder:

-   this example have a dependecy from
    [dev-msg-node-vertx](https://github.com/reTHINK-project/dev-msg-node-vertx/tree/dev-0.2#unit-testing)
    and
    [dev-registry-domain](https://github.com/reTHINK-project/dev-registry-domain#dev-registry-domain)
    for communication between hyperties in two distinct browsers
    or tabs. **At this moment you need run locally
    [dev-msg-node-vertx](https://github.com/reTHINK-project/dev-msg-node-vertx/tree/dev-0.2#unit-testing)
    and
    [dev-registry-domain](https://github.com/reTHINK-project/dev-registry-domain#dev-registry-domain)**
-   you need, in the root folder, run command: `npm start`
-   in your browser, access to https://127.0.0.1:8080/example

### [Notes]()

It was done an version of RuntimeCatalogue for local instances, based on
the RuntimeCatalogue, and is activated by default;

</div>

</div>

</div>

<div class="clearfix">

</div>

<div class="col-md-3">

<div id="toc" class="col-md-3 hidden-xs hidden-sm hidden-md">

</div>

</div>

</div>

</div>

<div id="searchResults" class="modal fade">

<div class="modal-dialog">

<div class="modal-content">

<div class="modal-header">

<span aria-hidden="true">×</span>
#### Search results {#search-results .modal-title}

</div>

<div class="modal-body">

</div>

<div class="modal-footer">

Close

</div>

</div>

</div>

</div>

<span class="jsdoc-message"> Documentation generated by [JSDoc
3.4.0](https://github.com/jsdoc3/jsdoc) on January 26th 2016, 6:27:00 pm
using the [DocStrap template](https://github.com/docstrap/docstrap).
</span>