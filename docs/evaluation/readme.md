## Runtime evaluation

### Description of Component

The Hyperty Runtime supports the execution of Hyperties including:
•	Deployment of Hyperties
•	Deployment of Protocol Stubs
•	Communication between Hyperties
•	Management of Identities associated to Hyperties


###	Metrics

Device side Hyperty Runtime (browser and standalone runtime) as well as Server side Runtime (NodeJS runtime) were implemented based on common runtime core platform.

#### Functional Metrics

More than 150 functional metrics are defined to evaluate the Hyperty Runtime including:

Hyperty is correctly deployed in the Runtime:

*	Address Allocation
*	Registration in the Domain Registry
*	Associated with user Identity

Protostub is correctly deployed in the Runtime:

*	Address Allocation
*	Connected to the Message Node

Idp Proxy is correctly deployed in the Runtime:

*	Address Allocation
*	Connected to the IDP

Messages are correctly delivered by the Runtime:

*	Among Hyperties in the same runtime (intra-runtime)
*	Among Hyperties in different runtimes, from the same domain (intra-domain)
*	Among Hyperties in different runtimes, from different domains (inter-domain)

Identity Management:

*	User is able to select IDP to be used independently of the Hyperty
*	User is able to login with selected IDP
*	Identity Assertions are correctly generated and added to the body of outgoing Messages
*	Identity Assertions contained in the body of incoming messages are correctly validated by the IDP
* Communication between two hyperties is encrypted with tokens generated from the IdP Proxies.

Data Synchronisation:

* Reporter creates a new object and invites one or more Observers
* Observer subscribes an existing object
* The object handled by the Observer is synchronised with the changes performed by the Reporter

Address reusage and data objects resume:

* Address allocated to hyperty is reused between sessions
* Address allocated to data objects are reused between sessions
* Data Objects created by Reporters are resumed between sessions
* Data Objects subscribed by Observers are resumed between sessions

#### Non-Functional Metrics

For the Core runtime, the execution time is the only non-functional metric used. For the NodeJS runtime, since it can be used in a server, additional non-functional metrics are defined:

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


###	Functional Runtime Tests

The evaluation of the Hyperty Runtime is performed with Karma Unit tests implemented [here](https://github.com/reTHINK-project/dev-runtime-core/tree/master/test), and for each one the execution time was measured as defined above. For quality control purposes, these tests are automatically executed every time a `git push` or `git pull request` is performed to develop and master branch and its status is depicted following best Continuous Delivery practices. The quality status is depicted in the Github repository *readme* page:

![Runtime Quality Status](build-status.PNG)

The most updated full detailed report of the tests execution are provided at https://travis-ci.org/reTHINK-project/dev-runtime-core where we can continuously monitor the runtime quality including:

* Hyperties are correctly deployed in the Runtime including the allocation of addresses, the registration in the Domain Registry and the association of User Identities;
* Protostubs are correctly deployed in the Runtime including Protocol Stub is successfully retrieved from the Catalogue server, an Hyperty Runtime URL is successfully allocated to the Protocol Stub, and the Protocol Stub is instantiated and connected to the Message Node.
* Idp Proxy is correctly deployed in the Runtime that is used to authenticate user with  selected IdP e.g. Google IdP. The IDP Proxy is successfully retrieved from the Catalogue server, an Hyperty Runtime URL is successfully allocated to the IDP Proxy, and the IDP Proxy is instantiated and successfully connected to Google IDP.
* Messages are correctly delivered by the Runtime including:
 * messages were successfully exchanged among Hyperties running in different runtimes, from the same domain (intra-domain).
 * messages were successfully exchanged among two Hyperties running in different runtimes, from different domains (inter-domain).
* User is able to select IDP to be used independently of the Hyperty
* The user successfully authenticates with selected IdP.
* Identity Assertions are correctly generated and added to the body of outgoing Messages
* Identity Assertions contained in the body of incoming messages are correctly validated by the IDP


![Travis Automated Tests Report Sample](travis-report.PNG)

###	Non-Functional Runtime Tests

The Core Runtime was evaluated in two versions:

* in the normal minified version including all implemented components with 1.315KB size;
* in the light version where the Graph Connector was removed with 500KB size;

A following execution time measurements were taken (Average):

| **Test**                                 | **Runtime Execution Time (ms)**          | **Runtime Light Execution Time (ms)** |
| :--------------------------------------: | :--------------------------------------: | :--------------------------------------: |
| Runtime installation                     |                 52                 |                39                 |
| Protostub deployment                     |                 23                 |                18                 |
| Idp Proxy deployment                     |                 9                |                 8                 |
| Intra-runtime Hyperty Message Delivery   |                 6                 |                 5                 |
| Inter-runtime Hyperty Message Delivery   |                 6                 |                 6                 |
| New Hypert Address Allocation            |                 4                 |                 4                 |
| Hypert Address Reusage                   |                 2                 |                 2                 |
| New Data Object Address Allocation       |                 1                 |                 1                 |
| Data Object Address Reusage              |                 1                 |                 1                 |
| Data Object creation (new Reporter)      |                 28                 |                 28                 |
| Data Object subscription (new Observer)  |                 61                 |                 63                 |
| Data Object Update synchronised with Observer   |                 16                 |                 16                 |
| Data Object Observer Resume              |                 31                 |                 31                 |
| Data Object Reporter Resume              |                 28                 |                 28                 |

Additional non-functional evaluations are provided for:

* Identity Module (see [here](identity-module/IdMEvaluation.md))
* Policy Engine (see [here](policy-engine/README.md))


### Evaluation analysis

The results obtained for the runtime core evaluation shows in general, good results. We can conclude that the overhead introduced by the messaging framework (the message bus components) and by the security components (policy engine and identity module) is marginal (always under 10 ms) and does compensate the benefits gained by the security by design approach. The execution time for the dynamic deployment of Protostubs and IdP Proxies is also very small (8 to 23 ms) and does not hurt the user experience. It means the network download time from the Catalogue is the one that may impact the user experience and the storage of these components by the Runtime Catalogue has significantly increase the Runtime performance. The Runtime installation execution time is better than expected (around 50 ms ) and we have noticed that there is a non-linear correlation with the size of the runtime execution file (around 25 percent of improvement when comparing the normal runtime installation time with the light runtime installation time). Since the file size has a higher impact on the download time from the Catalogue, we can conclude that the reduction of the runtime components size, notably of the Graph Connector, is one important aspect to be improved in future.
The execution time for the data synchronization is approximately 50% of the full process, taking into account the message delivery time is around 8ms (see inter-runtime message delivery test). We should however note that the data object subscription execution is much higher than the data object creation time and should be further improved in future optimizations.
