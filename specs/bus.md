A simple bus API to send and receive messages:

`postMessage(inMsg, responseCallback)` that is used to post messages in order to communicate with registered listeners.

`addListener(url, listener)` that is used to register a listener to receive message when `msg.to === url`.
