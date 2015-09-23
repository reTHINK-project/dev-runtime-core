/**
 * ProtoStub Interface
 */
class ProtoStub {

  /**
   * To initialise the protocol stub including as input parameters its allocated component runtime url, the runtime BUS postMessage function to be invoked on messages received by the protocol stub and required configuration retrieved from protocolStub descriptor.
   * @param  {URL.RuntimeURL}                            runtimeProtoSubURL runtimeProtoSubURL
   * @param  {Message.Message} busPostMessage                           configuration
   * @param  {ProtoStubDescriptor.ConfigurationDataList}  configuration      configuration
   */
  init(runtimeProtoSubURL, busPostMessage, configuration ) {
    // Body...
  }

  /**
   * To connect the protocol stub to the back-end server
   * @param  {IDToken} identity identity
   */
  connect( identity ) {
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

}
