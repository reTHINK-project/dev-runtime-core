## dev-msg-node-vertx

### Setup Environment

#### JavaScript
On the first time you are cloning this repository, you need to run the command ```npm run init-setup```;

After running successfully this command you will have 2 folders (node_modules and vendor), these folders are excluded from the commit process, and are only for development.

If you already have the project configured on your machine, you only need run the command ```npm install``` to add new dependencies;

If you have some trouble with the environment, you can open an issue;

#### Java
Follow the link to [Install Maven](https://maven.apache.org/install.html).
* Build the project with: mvn package
* Run vertx node with: mvn exec:java

### Use of VertxProtoStub
Once the MessageNode is active, we are able to connect with the ProtoStub. The best example of how this is done is in the test/VertxProtoStub.js in "runtime connectivity" test. It's important to send the "runtimeURL" in the config parameter, because it will be used to link the connection channel to the runtime.

With this it's possible to send messages between runtimes, but Hyperty registration is something that should be done externally.

The connection is auto managed. It means, there is no need to call "connect()" explicitly, and it will always try to be in "connected" until "disconnect()" is called. Status messages are sent to "runtimeProtoStubURL/status".

