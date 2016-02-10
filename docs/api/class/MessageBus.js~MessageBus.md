<div class="self-detail detail">

MessageBus {#messagebus data-ice="name"}
==========

<div class="flat-list" data-ice="extendsChain">

#### Extends:

<div>

<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span> →
MessageBus

</div>

</div>

<div class="description" data-ice="description">

Message BUS Interface is an extension of the MiniBus It doesn't support
the default '\*' listener, instead it uses the registry.resolve(..)

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
data-ice="name"><span>[constructor](../../../class/src/bus/MessageBus.js~MessageBus.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(registry: <span>\*</span>)</span>

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
data-ice="name"><span>[addForward](../../../class/src/bus/MessageBus.js~MessageBus.html#instance-method-addForward)</span></span><span
data-ice="signature">(from: <span>\*</span>, to: <span>\*</span>):
<span>\*</span></span>

</div>

<div>

</div>

</div>

<div class="inherited-summary" data-ice="inheritedSummary">

Inherited Summary
-----------------

<span class="toggle closed"></span> From class
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>
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

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(registry: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MessageBus.js.html#lineNumber18)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="override">

#### Override:

<span>[MiniBus\#constructor](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-constructor-constructor)</span>

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
registry
<span>\*</span>

</div>

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addForward</span><span data-ice="signature">(from: <span>\*</span>, to: <span>\*</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MessageBus.js.html#lineNumber24)</span></span> </span> {#instance-method-addForward data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
from
<span>\*</span>
to
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
