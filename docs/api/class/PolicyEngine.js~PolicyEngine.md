</div>

<div class="self-detail detail">

PolicyEngine {#policyengine data-ice="name"}
============

<div class="description" data-ice="description">

Core Policy Engine (PDP/PEP) Interface According to:
<https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/runtime-apis.md#core-policy-engine-pdppep-interface>

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
data-ice="name"><span>[constructor](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(IdentityModule: <span>\*</span>, Registry:
<span>\*</span>)</span>

</div>

<div>

<div data-ice="description">

To initialise the Policy Engine

</div>

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
data-ice="name"><span>[addPolicies](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-method-addPolicies)</span></span><span
data-ice="signature">(hyperty: <span>URL.HypertyURL</span>, policies:
<span>HypertyPolicyList</span>)</span>

</div>

<div>

<div data-ice="description">

To add policies to be enforced for a certain deployed Hyperty Instance
Example of an hyperty:
hyperty-instance://tecnico.pt/e1b8fb0b-95e2-4f44-aa18-b40984741196
Example of a policy: {subject: 'message.header.from', target:
'blacklist', action: 'deny'}

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[authorise](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-method-authorise)</span></span><span
data-ice="signature">(message: <span>Message.Message</span>):
<span>AuthorisationResponse</span></span>

</div>

<div>

<div data-ice="description">

Authorisation request to accept a Subscription for a certain resource.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[checkPolicies](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-method-checkPolicies)</span></span><span
data-ice="signature">(message: <span>\*</span>):
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removePolicies](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-method-removePolicies)</span></span><span
data-ice="signature">(hyperty: <span>URL.HypertyURL</span>)</span>

</div>

<div>

<div data-ice="description">

To remove previously added policies for a certain deployed Hyperty
Instance

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(IdentityModule: <span>\*</span>, Registry: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber12)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

To initialise the Policy Engine

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
IdentityModule
<span>\*</span>
identityModule identityModule

Registry
<span>\*</span>
runtimeRegistry runtimeRegistry

</div>

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addPolicies</span><span data-ice="signature">(hyperty: <span>URL.HypertyURL</span>, policies: <span>HypertyPolicyList</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber29)</span></span> </span> {#instance-method-addPolicies data-ice="anchor"}

<div data-ice="description">

To add policies to be enforced for a certain deployed Hyperty Instance
Example of an hyperty:
hyperty-instance://tecnico.pt/e1b8fb0b-95e2-4f44-aa18-b40984741196
Example of a policy: {subject: 'message.header.from', target:
'blacklist', action: 'deny'}

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
hyperty
<span>URL.HypertyURL</span>
hyperty

policies
<span>HypertyPolicyList</span>
policies

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">authorise</span><span data-ice="signature">(message: <span>Message.Message</span>): <span>AuthorisationResponse</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber48)</span></span> </span> {#instance-method-authorise data-ice="anchor"}

<div data-ice="description">

Authorisation request to accept a Subscription for a certain resource.
Returns a Response Message to be returned to Subscription requester

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
message
<span>Message.Message</span>
message

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>AuthorisationResponse</span>   | AuthorisationResponse                |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">checkPolicies</span><span data-ice="signature">(message: <span>\*</span>): <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber90)</span></span> </span> {#instance-method-checkPolicies data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
message
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ----------------------------------------------------------------------------------------------------------------
  <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
  ----------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removePolicies</span><span data-ice="signature">(hyperty: <span>URL.HypertyURL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber38)</span></span> </span> {#instance-method-removePolicies data-ice="anchor"}

<div data-ice="description">

To remove previously added policies for a certain deployed Hyperty
Instance

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
hyperty
<span>URL.HypertyURL</span>
hyperty

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
