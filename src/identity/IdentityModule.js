/**
 * Functions to deal with assertions compliant with WebRTC RTCIdentityProvider
 */
class IdentityModule {

  /**
   * Generates an Identity Assertion
   * @param  {DOMString} contents     contents
   * @param  {DOMString} origin       origin
   * @param  {DOMString} usernameHint usernameHint
   * @return {IdAssertion}              IdAssertion
   */
  generateAssertion(contents, origin, usernameHint) {
    // Body...
  }

  /**
   * Validates an Identity Assertion
   * @param  {DOMString} assertion assertion
   * @param  {DOMString} origin    origin
   */
  validateAssertion(assertion, origin) {
    // Body...
  }

}

export default IdentityModule;
