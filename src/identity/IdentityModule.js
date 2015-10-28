/**
 * IdentityModule
 *
 * Initial specification: D4.1
 *
 * The IdentityModule is a component managing user Identity. It downloads, instantiates
 * and manage Identity Provider Proxy (IdP) for its own user identity or for external
 * user identity verification. 
 * 
 */
var IdentityModule = {

/**
 *          USER'S OWN IDENTITY
 */

  /**
   * Register a new Identity with an Identity Provider
   */
  registerIdentity: function(){
    // Body...
  },
  
  /**
   * In relation with a classical Relying Party: Registration
   */
  registerWithRP: function() {
    // Body...
  },
  
  
  /**
   * In relation with a classical Relying Party: Login
   */
  loginWithRP: function() {
    // Body...
  },
  
  
  /**
   * In relation with a Hyperty Instance: Associate identity
   */
  setHypertyIdentity: function() {
    // Body...
  },
  
  /**
   * Generates an Identity Assertion for a call session
   * @param  {DOMString} contents     contents
   * @param  {DOMString} origin       origin
   * @param  {DOMString} usernameHint usernameHint
   * @return {IdAssertion}              IdAssertion
   */
  generateAssertion: function(contents, origin, usernameHint) {
    // Body...
  },


/**
 *          OTHER USER'S IDENTITY
 */
  
  /**
   * Verification of a received IdAssertion validity
   * @param  {DOMString} assertion assertion
   */
  validateAssertion: function(assertion) {
    // Body...
  },
  
  /**
   * Trust level evaluation of a received IdAssertion
   * @param  {DOMString} assertion assertion
   */
  getAssertionTrustLevel: function(assertion) {
    // Body...
  },
}

module.exports = IdentityModule
