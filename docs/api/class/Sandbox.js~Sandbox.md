</div>

<div class="self-detail detail">

Sandbox {#sandbox data-ice="name"}
=======

<div class="flat-list" data-ice="extendsChain">

#### Extends:

<div>

<span>[Bus](../../../class/src/bus/Bus.js~Bus.html)</span> →
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span> →
Sandbox

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
data-ice="name"><span>[constructor](../../../class/src/sandbox/Sandbox.js~Sandbox.html#instance-constructor-constructor)</span></span>

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
data-ice="name"><span>[deployComponent](../../../class/src/sandbox/Sandbox.js~Sandbox.html#instance-method-deployComponent)</span></span><span
data-ice="signature">(componentSourceCode:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
componentURL: <span>URL</span>, configuration: <span>Config</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;</span>

</div>

<div>

<div data-ice="description">

Deploy an instance of the component into the sandbox.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeComponent](../../../class/src/sandbox/Sandbox.js~Sandbox.html#instance-method-removeComponent)</span></span><span
data-ice="signature">(componentURL: <span>URL</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;</span>

</div>

<div>

<div data-ice="description">

Remove the instance of a previously deployed component.

</div>

</div>

</div>

<div class="inherited-summary" data-ice="inheritedSummary">

Inherited Summary
-----------------

<span class="toggle closed"></span> From class
<span>[Bus](../../../class/src/bus/Bus.js~Bus.html)</span>
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addListener](../../../class/src/bus/Bus.js~Bus.html#instance-method-addListener)</span></span><span
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
data-ice="name"><span>[addResponseListener](../../../class/src/bus/Bus.js~Bus.html#instance-method-addResponseListener)</span></span><span
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
data-ice="name"><span>[bind](../../../class/src/bus/Bus.js~Bus.html#instance-method-bind)</span></span><span
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
data-ice="name"><span>[postMessage](../../../class/src/bus/Bus.js~Bus.html#instance-method-postMessage)</span></span><span
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
data-ice="name"><span>[removeAllListenersOf](../../../class/src/bus/Bus.js~Bus.html#instance-method-removeAllListenersOf)</span></span><span
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
data-ice="name"><span>[removeResponseListener](../../../class/src/bus/Bus.js~Bus.html#instance-method-removeResponseListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, msgId:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>)</span>

</div>

<div>

<div data-ice="description">

Remove the response listener.

</div>

</div>

<span class="toggle closed"></span> From class
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[postMessage](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-postMessage)</span></span><span
data-ice="signature">(inMsg: <span>\*</span>, responseCallback:
<span>\*</span>): <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/sandbox/Sandbox.js.html#lineNumber11)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="override">

#### Override:

<span>[MiniBus\#constructor](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-constructor-constructor)</span>

</div>

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">deployComponent</span><span data-ice="signature">(componentSourceCode: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, componentURL: <span>URL</span>, configuration: <span>Config</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/sandbox/Sandbox.js.html#lineNumber29)</span></span> </span> {#instance-method-deployComponent data-ice="anchor"}

<div data-ice="description">

Deploy an instance of the component into the sandbox.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
componentSourceCode
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
Component source code (Hyperty, ProtoStub, etc)

componentURL
<span>URL</span>
Hyperty, ProtoStub, or any other component address.

configuration
<span>Config</span>
Config parameters of the component

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | return deployed if successful, or    |
| zilla.org/en-US/docs/Web/JavaScript/ | any other string with an error       |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>&lt;<span>[string](https://devel |                                      |
| oper.mozilla.org/en-US/docs/Web/Java |                                      |
| Script/Reference/Global_Objects/Stri |                                      |
| ng)</span>&gt;                       |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeComponent</span><span data-ice="signature">(componentURL: <span>URL</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/sandbox/Sandbox.js.html#lineNumber62)</span></span> </span> {#instance-method-removeComponent data-ice="anchor"}

<div data-ice="description">

Remove the instance of a previously deployed component.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
componentURL
<span>URL</span>
Hyperty, ProtoStub, or any other component address.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | return undeployed if successful, or  |
| zilla.org/en-US/docs/Web/JavaScript/ | any other string with an error       |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>&lt;<span>[string](https://devel |                                      |
| oper.mozilla.org/en-US/docs/Web/Java |                                      |
| Script/Reference/Global_Objects/Stri |                                      |
| ng)</span>&gt;                       |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
