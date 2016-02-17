/**
 * ProtoStub Interface
 */
class ProtoStub {

  /**
   * To initialise the protocol stub including as input parameters its allocated component runtime url, the runtime BUS postMessage function to be invoked on messages received by the protocol stub and required configuration retrieved from protocolStub descriptor.
   * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
   * @param  {Message.Message}                           busPostMessage     configuration
   * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
   */
  constructor(runtimeProtoStubURL, bus, config) {
    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;
  }

  /**
   * To connect the protocol stub to the back-end server
   * @param  {IDToken} identity identity
   */
  connect(identity) {
    // Body...
  }

  /**
   * To disconnect the protocol stub.
   */
  disconnect() {
    // Body...
  }

  /**
   * To post messages to be dispatched by the protocol stub to connected back-end server
   * @param  {Message.Message}  message       message
   */
  postMessage(message) {

  }

  /**
   * Filter method that should be used for every messages in direction: Protostub -> MessageNode
   * @param  {Message} msg Original message from the MessageBus
   * @return {boolean} true if it's to be deliver in the MessageNode
   */
  _filter(msg) {
    if (msg.body && msg.body.via === this._runtimeProtoStubURL)
      return false;
    return true;
  }

  /**
   * Method that should be used to deliver the message in direction: Protostub -> MessageBus (core)
   * @param  {Message} msg Original message from the MessageNode
   */
  _deliver(msg) {
    if (!msg.body) msg.body = {};

    msg.body.via = this._runtimeProtoStubURL;
    this._bus.postMessage(msg);
  }

}

/**
 * To activate this protocol stub, using the same method for all protostub.
 * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
 * @param  {Message.Message}                           busPostMessage     configuration
 * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
 * @return {Object} Object with name and instance of ProtoStub
 */
export default function activate(url, bus, config) {
  return {
    name: 'ProtoStub',
    instance: new ProtoStub(url, bus, config)
  };
}
