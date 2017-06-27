## Runtime evaluation

*to be completed*

###	Metrics

Device side Hyperty Runtime (browser and standalone runtime) as well as Server side Runtime (NodeJS runtime) were.

#### Functional Metrics

Only functional metrics are used to evaluate the Hyperty Runtime in the Browser including:

Hyperty is correctly deployed in the Runtime including:
•	Address Allocation
•	Registration in the Domain Registry
•	Associated with user Identity

Protostub is correctly deployed in the Runtime including:
•	Address Allocation
•	Connected to the Message Node

Idp Proxy is correctly deployed in the Runtime including:
•	Address Allocation
•	Connected to the IDP

Messages are correctly delivered by the Runtime:
•	Among Hyperties in the same runtime (intra-runtime)
•	Among Hyperties in different runtimes, from the same domain (intra-domain)
•	Among Hyperties in different runtimes, from different domains (inter-domain)

Identity Management
•	User is able to select IDP to be used independently of the Hyperty
•	User is able to login with selected IDP
•	Identity Assertions are correctly generated and added to the body of outgoing Messages
•	Identity Assertions contained in the body of incoming messages are correctly validated by the IDP

Data Synchronisation
* Reporter creates a new object and invites one or more Observers
* Observer subscribes an existing object
* The object handled by the Observer is synchronised with the changes performed by the Reporter

Address reusage and data objects resume
* Address allocated to hyperty is reused between sessions
* Address allocated to data objects are reused between sessions
* Data Objects created by Reporters are resumed between sessions
* Data Objects subscribed by Observers are resumed between sessions

P2P Hyperty Communication
*


#### Non-Functional Metrics

The following non-functional metrics are used to evaluate the NodeJS runtime:

**Deployment Performance**

1. Number of Hyperties deployed / sec
1. Number of Protostubs deployed / sec

**Reporte-Observer data synchronisation performance**

1. Number of Data Objects created / sec
1. Number of Data Objects created / sec with data object children
1. Number of Data Objects subscribed / sec
1. Number of Data Objects subscribed / sec with data object children
1. Number of Subscribers per Data Object
1. Number of Subscribers per Data Object with data object children
1. Number of Data Objects changed / sec with different number of subscribers and size of the change
1. Number of Data Objects Childs created / sec with different number of subscribers and size of the data
1. Number of Reporter data objects resumed / sec
1. Number of Reporter parent data objects resumed / sec with different numbers of data object childs
1. Number of Observer data objects resumed / sec
1. Number of Observer parent data objects resumed / sec with different numbers of data object childs


###	Functional Tests
*to be updated*
The evaluation of the Hyperty Runtime was performed with the Hello World Reporter and Hello World Observer Hyperties hosted by “hysmart.rethink.ptinovacao.pt” domain. In general all tests were successfully performed.
Hyperty is correctly deployed in the Runtime including:
The Hyperty Deployment was tested with Hello World Reporter Hyperty that was successfully deployed in the Runtime, including the allocation of addresses, the registration in the Domain Registry and the association of User Identities:



 *Hyperty Deployment in The Runtime picture*
Protostub is correctly deployed in the Runtime including:
The allocation of Hyperty addresses triggers the deployment of the Protocol Stub process that is used to connect to the Message Node serving “hybroker.rethink.ptinovacao.pt” domain. The Protocol Stub is successfully retrieved from the Catalogue server, an Hyperty Runtime URL is successfully allocated to the protocol stub, and the protocol stub is instantiated and connected to the Message Node (in this case is Vertx Message Node).

Figure 9 – Protocol Stub deployed in the Runtime
Idp Proxy is correctly deployed in the Runtime including:
During the deployment of the Hello World Hyperty, the association with a User Identity triggers the deployment of the Google IDP Proxy process that is used to authenticate user with a Google account. The Google IDP Proxy is successfully retrieved from the Catalogue server, an Hyperty Runtime URL is successfully allocated to the IDP Proxy, and the IDP Proxy is instantiated and successfully connected to Google IDP.

Figure 10 – IDP Proxy deployed in the Runtime
Messages are correctly delivered by the Runtime:
The Hello World Reporter Hyperty and the Hello World Observer Hyperty were successfully executed with users from the same domain i.e. messages were successfully exchanged among these two Hyperties running in different runtimes, from the same domain (intra-domain). In this case an update on Object Hello performed by the Hello World Reporter Hyperty (see Figure 11) is received by the Hello World Observer Hyperty (see Figure 12).

Figure 11 – Hello World Reporter publishes updates to Hello World Data Object

Figure 12 - Hello World Observer receives updates on Hello World Data Object

Also the Hello World Reporter Hyperty and the Hello World Observer Hyperty were successfully executed with users from different domains i.e. messages were successfully exchanged among these two Hyperties running in different runtimes, from different domains (inter-domain).

Identity Management
During the deployment of the Hello World Hyperty and the association with an Identity, the user was successfully authenticated with a Google account.
The following functionalities are still pending:
•	User is able to select IDP to be used independently of the Hyperty
•	Identity Assertions are correctly generated and added to the body of outgoing Messages
•	Identity Assertions contained in the body of incoming messages are correctly validated by the IDP
