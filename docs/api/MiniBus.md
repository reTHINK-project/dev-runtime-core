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

Class: MiniBus {#class-minibus .page-title}
==============

<div class="section">

MiniBus
-------

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new MiniBus() {#MiniBus .name}

Author:

:   -   micaelpedrosa@gmail.com Minimal interface and implementation to
        send and receive messages. It can be reused in many type of
        components. Components that need a message system should receive
        this class as a dependency or extend it. Extensions should
        implement the following private methods: \_onPostMessage and
        \_registerExternalListener

</div>

### Methods {#methods .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>\_onPostMessage(msg) {#_onPostMessage .name}

Not public available, used by the class extension implementation, to
process messages from the public “postMessage” without a registered
listener.

<div class="description">

Not public available, used by the class extension implementation, to
process messages from the public “postMessage” without a registered
listener. Used to send the message to an external interface, like a
WebWorker, IFrame, etc.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `msg`                    | <span                    | Message                  |
|                          | class="param-type">Messa |                          |
|                          | ge.Message</span>        |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>\_registerExternalListener() {#_registerExternalListener .name}

Not public available, used by the class extension implementation, to
process all messages that enter the MiniBus from an external interface,
like a WebWorker, IFrame, etc.

<div class="description">

Not public available, used by the class extension implementation, to
process all messages that enter the MiniBus from an external interface,
like a WebWorker, IFrame, etc. This method is called one time in the
constructor to register external listeners. The implementation will
probably call the “\_onMessage” method to publish in the local
listeners. DO NOT call “postMessage”, there is a danger that the message
enters in a cycle!

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>addListener(url, listener) {#addListener .name}

Register listener to receive message when “msg.to === url”.

<div class="description">

Register listener to receive message when “msg.to === url”. Special url
“\*” for default listener is accepted to intercept all messages.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `url`                    | <span                    | Address to intercept,    |
|                          | class="param-type">URL</ | tha is in the message    |
|                          | span>                    | “to”                     |
+--------------------------+--------------------------+--------------------------+
| `listener`               | <span                    | listener                 |
|                          | class="param-type">Liste |                          |
|                          | ner</span>               |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

instance of MsgListener

</div>

 Type 
:   <span class="param-type">MsgListener</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>addResponseListener(url, msgId, responseListener) {#addResponseListener .name}

Manually add a response listener.

<div class="description">

Manually add a response listener. Only one listener per message ID
should exist. ATENTION, there is no timeout for this listener. The
listener should be removed with a removeResponseListener, failing to do
this will result in a unreleased memory problem.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `url`                    | <span                    | Origin address of the    |
|                          | class="param-type">URL</ | message sent,            |
|                          | span>                    | “msg.from”.              |
+--------------------------+--------------------------+--------------------------+
| `msgId`                  | <span                    | Message ID that is       |
|                          | class="param-type">numbe | returned from the        |
|                          | r</span>                 | postMessage.             |
+--------------------------+--------------------------+--------------------------+
| `responseListener`       | <span                    | Callback function for    |
|                          | class="param-type">funct | the response             |
|                          | ion</span>               |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>bind(outUrl, inUrl, target) {#bind .name}

Helper method to bind listeners (in both directions) into other MiniBus
target.

<div class="description">

Helper method to bind listeners (in both directions) into other MiniBus
target.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `outUrl`                 | <span                    | Outbound URL, register   |
|                          | class="param-type">URL</ | listener for url in      |
|                          | span>                    | direction “this -&gt;    |
|                          |                          | target”                  |
+--------------------------+--------------------------+--------------------------+
| `inUrl`                  | <span                    | Inbound URL, register    |
|                          | class="param-type">URL</ | listener for url in      |
|                          | span>                    | direction “target -&gt;  |
|                          |                          | this”                    |
+--------------------------+--------------------------+--------------------------+
| `target`                 | <span                    | The other target MiniBus |
|                          | class="param-type">[Mini |                          |
|                          | Bus](MiniBus.html)</span |                          |
|                          | >                        |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

an object that contains the properties \[thisListener, targetListener\]
and the unbind method.

</div>

 Type 
:   <span class="param-type">Bound</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>postMessage(msg, responseCallback) {#postMessage .name}

Send messages to local listeners, or if not exists to external
listeners.

<div class="description">

Send messages to local listeners, or if not exists to external
listeners. It’s has an optional mechanism for automatic management of
response handlers. The response handler will be unregistered after
receiving the response, or after response timeout (default to 3s).

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `msg`                    | <span                    | Message to send. Message |
|                          | class="param-type">Messa | ID is automatically      |
|                          | ge</span>                | added to the message.    |
+--------------------------+--------------------------+--------------------------+
| `responseCallback`       | <span                    | Optional parameter, if   |
|                          | class="param-type">funct | the developer what’s     |
|                          | ion</span>               | automatic response       |
|                          |                          | management.              |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

Returns the message ID, in case it should be needed for manual
management of the response handler.

</div>

 Type 
:   <span class="param-type">number</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>removeAllListenersOf(url) {#removeAllListenersOf .name}

Remove all existent listeners for the URL

.
<div class="description">

Remove all existent listeners for the URL

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `url`                    | <span                    | Address registered       |
|                          | class="param-type">URL</ |                          |
|                          | span>                    |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>removeResponseListener(url, msgId) {#removeResponseListener .name}

Remove the response listener.

<div class="description">

Remove the response listener.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `url`                    | <span                    | Origin address of the    |
|                          | class="param-type">URL</ | message sent,            |
|                          | span>                    | “msg.from”.              |
+--------------------------+--------------------------+--------------------------+
| `msgId`                  | <span                    | Message ID that is       |
|                          | class="param-type">numbe | returned from the        |
|                          | r</span>                 | postMessage              |
+--------------------------+--------------------------+--------------------------+

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
