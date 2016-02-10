<div class="self-detail detail">

MiniBus {#minibus data-ice="name"}
=======

<div class="flat-list" data-ice="directSubclass">

#### Direct Subclass:

<div>

<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>,
<span>[Sandbox](../../../class/src/sandbox/Sandbox.js~Sandbox.html)</span>

</div>

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-constructor-constructor)</span></span>

</div>

<div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[pipeline](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-get-pipeline)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-addListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, listener:
<span>Listener</span>): <span>MsgListener</span></span>

</div>

<div>

<div data-ice="description">

Register listener to receive message when "msg.to === url".

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addResponseListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-addResponseListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, msgId:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>,
responseListener:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>)</span>

</div>

<div>

<div data-ice="description">

Manually add a response listener.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[bind](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-bind)</span></span><span
data-ice="signature">(outUrl: <span>URL</span>, inUrl: <span>URL</span>,
target:
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>):
<span>Bound</span></span>

</div>

<div>

<div data-ice="description">

Helper method to bind listeners (in both directions) into other MiniBus
target.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[postMessage](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-postMessage)</span></span><span
data-ice="signature">(msg: <span>Message</span>, responseCallback:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>):
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span></span>

</div>

<div>

<div data-ice="description">

Send messages to local listeners, or if not exists to external
listeners.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeAllListenersOf](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-removeAllListenersOf)</span></span><span
data-ice="signature">(url: <span>URL</span>)</span>

</div>

<div>

<div data-ice="description">

Remove all existent listeners for the URL

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeResponseListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-removeResponseListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, msgId:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>)</span>

</div>

<div>

<div data-ice="description">

Remove the response listener.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber20)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">pipeline</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber35)</span></span> </span> {#instance-get-pipeline data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addListener</span><span data-ice="signature">(url: <span>URL</span>, listener: <span>Listener</span>): <span>MsgListener</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber44)</span></span> </span> {#instance-method-addListener data-ice="anchor"}

<div data-ice="description">

Register listener to receive message when "msg.to === url". Special url
"\*" for default listener is accepted to intercept all messages.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL</span>
Address to intercept, tha is in the message "to"

listener
<span>Listener</span>
listener

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>MsgListener</span>             | instance of MsgListener              |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addResponseListener</span><span data-ice="signature">(url: <span>URL</span>, msgId: <span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>, responseListener: <span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber66)</span></span> </span> {#instance-method-addResponseListener data-ice="anchor"}

<div data-ice="description">

Manually add a response listener. Only one listener per message ID
should exist. ATENTION, there is no timeout for this listener. The
listener should be removed with a removeResponseListener, failing to do
this will result in a unreleased memory problem.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL</span>
Origin address of the message sent, "msg.from".

msgId
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>
Message ID that is returned from the postMessage.

responseListener
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>
Callback function for the response

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">bind</span><span data-ice="signature">(outUrl: <span>URL</span>, inUrl: <span>URL</span>, target: <span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>): <span>Bound</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber151)</span></span> </span> {#instance-method-bind data-ice="anchor"}

<div data-ice="description">

Helper method to bind listeners (in both directions) into other MiniBus
target.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
outUrl
<span>URL</span>
Outbound URL, register listener for url in direction "this -&gt; target"

inUrl
<span>URL</span>
Inbound URL, register listener for url in direction "target -&gt; this"

target
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>
The other target MiniBus

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>Bound</span>                   | an object that contains the          |
|                                      | properties \[thisListener,           |
|                                      | targetListener\] and the unbind      |
|                                      | method.                              |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">postMessage</span><span data-ice="signature">(msg: <span>Message</span>, responseCallback: <span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>): <span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber95)</span></span> </span> {#instance-method-postMessage data-ice="anchor"}

<div data-ice="description">

Send messages to local listeners, or if not exists to external
listeners. It's has an optional mechanism for automatic management of
response handlers. The response handler will be unregistered after
receiving the response, or after response timeout (default to 3s).

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
msg
<span>Message</span>
Message to send. Message ID is automatically added to the message.

responseCallback
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>
Optional parameter, if the developer what's automatic response
management.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[number](https://developer.moz | Returns the message ID, in case it   |
| illa.org/en-US/docs/Web/JavaScript/R | should be needed for manual          |
| eference/Global_Objects/Number)</spa | management of the response handler.  |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeAllListenersOf</span><span data-ice="signature">(url: <span>URL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber83)</span></span> </span> {#instance-method-removeAllListenersOf data-ice="anchor"}

<div data-ice="description">

Remove all existent listeners for the URL

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL</span>
Address registered

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeResponseListener</span><span data-ice="signature">(url: <span>URL</span>, msgId: <span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber75)</span></span> </span> {#instance-method-removeResponseListener data-ice="anchor"}

<div data-ice="description">

Remove the response listener.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-5 data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL</span>
Origin address of the message sent, "msg.from".

msgId
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>
Message ID that is returned from the postMessage

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
