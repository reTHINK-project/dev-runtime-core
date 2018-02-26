'use strict mode';
import chaiAsPromised from 'chai-as-promised';
import assertArrays from 'chai-arrays';
import MessageBus from '../src/bus/MessageBus';
import IdentityModule from '../src/identity/IdentityModule';
import { runtimeFactory } from './resources/runtimeFactory';
import DataObjectsStorage from '../src/store-objects/DataObjectsStorage';
import PEP from '../src/policy/PEP';
import RuntimeCoreCtx from '../src/policy/context/RuntimeCoreCtx';
import Crypto from '../src/cryptoManager/Crypto';
import CryptoManager from '../src/cryptoManager/CryptoManager';

chai.config.truncateThreshold = 0;
chai.use(chaiAsPromised);
chai.use(assertArrays);

const expect = chai.expect;
const assert = chai.assert;

let crypto = undefined;

let bus = undefined;
let storageManager = undefined;
let runtimeCapabilities = undefined;
let hyperURL1 = undefined;
let runtimeURL = undefined;
let objURL = undefined;
let idpDomain = undefined;
let idpDomainURL = undefined;
let policyEngine = undefined;
let msgNodeResponseFunc = undefined;
let coreDiscovery = undefined;
let idmURL = undefined;
let identityModule = undefined;
let userEmail = undefined;
let guiURL = undefined;
let userURL = undefined;
let cn = undefined;
let loginUrl = undefined;
let assertionVal = undefined;


describe('Identity Module tests', function() {

  before('Init structures once before all tests', function() {
    crypto = new Crypto(runtimeFactory);

    hyperURL1 = 'hyperty://h1.domain/h1';
    runtimeURL = 'runtime://fake-runtime';
    idmURL = runtimeURL + '/idm';
    idpDomain = 'google.com';
    idpDomainURL = 'domain-idp://' + idpDomain;
    userEmail = 'testandthink123@gmail.com';
    guiURL = runtimeURL + '/identity-gui';
    objURL = 'resource://obj1';
    userURL = 'user://google.com/testandthink123@gmail.com';
    idps = [
      { domain: 'google.com', type: 'idToken' },
      { domain: 'microsoft.com', type: 'idToken' },
      { domain: 'orange.fr', type: 'idToken' },
      { domain: 'slack.com', type: 'Legacy' }
    ];
    cn = 'testandthink123';
    loginUrl =
      'https://accounts.google.com/o/oauth2/auth?scope=openid%20email%20profile&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com&redirect_uri=https://localhost&response_type=code token id_token&state=state&access_type=offline&nonce=NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTQ3LDc3LDE2MiwyMjUsNzYsMTE5LDM4LDI1MSw3MiwyMjcsNTIsMjA4LDE4MSwxODQsMTUzLDU4LDExOCwxNTksODUsOTksNzEsMTE4LDQzLDIzMiwxMTUsMTEsMTgwLDE2LDIwNCwyMTIsODgsMjUwLDIyOCw0NywxNDksMTExLDc4LDEzNCwxMjEsMjA1LDIxNiwxOTgsMTYsMTE5LDEwMywxNTQsMjM5LDE1NSwxMjMsMTk4LDUxLDE3Niw4NywxNTcsMjQ0LDE1MiwxMDUsMTIsMjA1LDg5LDI1MiwyNTIsNDgsMTU4LDE1OCwyOSwxNzYsMTAzLDE1MSwyMDQsNzgsMjEsODAsMTQzLDEyMCwxMDcsMjQ1LDI0NSwzLDkxLDIwNiwyNCwxMjAsNzMsMTgwLDEyOCwxNjAsMTA0LDIxNyw4OSwzOCwyMzEsMjksMjI3LDI1Myw0OCwyOSw4MywxMDksMTU0LDI2LDIxNSwxMzEsMjQxLDIzNyw1MCwxMzEsMjM0LDc4LDcwLDEzOCwyNDMsNSwyNTMsMTgyLDkxLDIyNSwxODIsMTgwLDUyLDE3LDE1LDEwOSwxMSwxMjYsOTUsMjE2LDM3LDIyNCwxNCwwLDIxNSwyMDQsNjEsMTU2LDIwNywxMzEsMTIxLDc2LDkzLDE2OCwxNTEsNDAsMTcsMTI0LDExMCw4MiwyMTksMjA1LDIxNSwyNDksMTcsMjA4LDk2LDExNCwxOTQsNjcsMjMsMTUsMjA2LDIyNiwxMzIsMTg0LDE0MSwxMTgsMTAsMTA1LDkyLDg3LDYwLDE3NiwxNTYsMTMxLDk0LDUyLDEwLDI0OCwyNTUsMjM5LDgsMTgxLDE3Myw2NywxODEsMjUsNzYsMjU1LDUzLDE3NSwxOCwxMzgsMTkwLDEyNCwxODIsMTU1LDE4LDE5OSwxMzIsNzUsMjMyLDUsMTU2LDE1MiwxODcsMTIyLDU4LDIzNiwxNTgsMTY3LDQ3LDE5MywxMzYsODIsMjM0LDIxMSwxNzYsODAsMTg1LDE3MSwxMjMsMCw2LDE5OCwyMTQsMjEsMTAzLDc4LDIyNywzNywxMDIsNjksMTYsNjAsOCwyMDMsNTQsMTc0LDE3MiwyMDksMTY0LDIyMSwyNywxNTUsODUsMTI2LDE1NSwyNDEsODMsMSwxMTgsMTE3LDIsMjM3LDEwMSw3MiwxMDcsMiwzLDEsMCwx';
    assertionVal =
      'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqZGxZMkkxTkdObE56RmtOakU0WWpJNE16QmpZMlZqT1RreE9EZ3hPR1UzTXpneE1EQm1NbUVpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SW1Ka2FHVjJkVU0zU0RaNVpuSkpWakZEVURsdmFIY2lMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVZURk1SRWwzVFVOM2VFMXBkelZPUTNkNFQwUkZjMDFxUlRSTVJFVXlUbmwzZUUxVVozTk9SRkZ6VGxSUmMwMTZZM05OYWsxM1RFUkplVTVUZHpGUFEzZDRUMVJGYzAxVVdUUk1SRTB5VEVSTk1VeEVSVEZPVTNjMVRubDNNazlUZDNsTmFsVnpUVlJKZVV4RVozbE1SRVY2VFhsM01reEVTVEJPVTNkNlRYbDNlazE1ZDNsT1ZGRnpUVlJWZVV4RVJUVk5hWGQ0VFVSamMwMVVZek5NUkVWNlRtbDNNRTVwZDNwTVJHTnpUMVJuYzA1cVFYTk5la0Z6VGtSSmMwMXFRVFZNUkVVeVRsTjNlVTFVVlhOTlZGVXdURVJGTUUxNWQzaE9hbGx6VGtSQmMwNXFTWE5OVkVVelRFUlJla3hFU1RKTVJFbDVUbmwzTVU1RGQzaE5lbGx6VG1wVmMwOVVZM05OYVhjMFRubDNlRTE2WTNOT2VsRnpUVlJyZVV4RVdUUk1SRWwzVGtOM2VFOUVaM05OYWxGNlRFUkZkMDVEZDNoTmFrbHpUMVJqYzAxVVl6Tk1SRVY2VFZOM2VFOUVSWE5OVkdNMVRFUm5lRXhFVlhsTVJFVXhUa04zZVU1cGR6Sk1SRlY2VEVSamVFeEVhekZNUkVWNVRVTjNlVTFxV1hOTlZFRjNURVJKZVUxRGQzbE5SR3R6VFZSck1VeEVSVE5OVTNjeFRubDNlRTlFVFhOTmVsbHpUVlJaTlV4RVJUQk9VM2MxVDBOM2VFMUVXWE5OVkdkelRXcEJNa3hFUlRSTlEzZDRUVVJCYzAxVVdUTk1SRmw0VEVSRmQwNTVkekJOVTNkNlRrTjNlVXhFU1RCT2VYZDVUa1JSYzAxVVZYZE1SRVV5VG5sM2VVMUVVWE5OYWtVeVRFUlZOVXhFU1hsT2VYYzBURVJKTWt4RVZUTk1SRVUwVDFOM2VFNUVSWE5OVkdjMFRFUm5Na3hFU1hsT1UzZDRUVlJuYzAxVVJYaE1SRVV6VG5sM2VFOUVTWE5OVkdONFRFUkZOVXhFV1hkTVJFVTBUbmwzZUUxNlRYTk5hbEZ6VFZSWk1FeEVSVEJQUTNkNFQwUnJjMDlFVlhOTlZHTjZURVJGTlUxVGQzbE5WRWx6VFdwUk0weEVTWGROVTNkNFQwUkZjMDU2UlhOUFJHZHpUVlJGZVV4RVJUSlBRM2Q0VFhwRmMwMVVZekJNUkZrelRFUlpNRXhFUlRGUFUzZDVUVVJaYzAxVVVUTk1SRlV3VEVSVk1FeEVSVEJPZVhjMFRtbDNNVTlEZDNsTmFsVnpUV3ByYzAxNlFYTk5WRWwzVEVSSk1FNXBkM2hPYW1OelRucG5jMDU2UlhOTlZGRjVURVJKZVU5RGR6Uk5VM2Q1VFhwbmMwMVVRWHBNUkZsNVRFUkpNRTE1ZDNsT1JFVnpUV3BKTWt4RVJURk5hWGN5VFhsM2VFNXBkelZQUTNkNFRucE5jMDE2WTNOTlZHc3lURVJWZVV4RVZUUk1SRkUxVEVSRk5FMVRkekJPYVhkNFRrUnJjMDFVUVRSTVJFVXdUMU4zTUU5VGR6Tk1SR2Q2VEVSRmVFOURkM2xOYW10elRXcFZNRXhFU1hoT2VYZDRUbXBqYzAxVVdUTk1SRWw1VEVSSk1FNTVkM2hQVkZWelRWUkZlVXhFUlhoT1UzZDVUbFJCYzAxRGQzaE9WR056VFdwVmVFeEVSVE5QUTNkNVRVUnJjMDU2U1hOTlZGVTFURVJGZVU1NWQzaFBSRVZ6VFZSRmVVeEVUWGRNUkdNeFRFUnJjMDFxVFRKTVJFbDVURVJGZVUxcGR6Sk5RM2N4VDBOM2VFeEVSWGxPVTNkNVRXcEJjMDFxVFRGTVJFbDVUbE4zZVUxcVozTk5hbEY2VEVSSk1FNURkM2xOVkZselRWUkpkMHhFUlhkT2VYZDRUbXBCYzAxcVJYbE1SRVY1VGtOM2VVMXFWWE5PZWtWelRWUnJNMHhFVFRSTVJFVXpUVU4zZUUxcVRYTk5WRmswVEVSTk5VeEVUVEJNUkVVeVQxTjNlRTlFVVhOT1ZHZHpUVlJGZVV4RVozZE1SR014VEVSRk5VMURkM2xOUkdOelRWUmplVXhFU1hoTmVYZDVURVJOYzAxVGQzZE1SRVU5SWl3aWFYTnpJam9pYUhSMGNITTZMeTloWTJOdmRXNTBjeTVuYjI5bmJHVXVZMjl0SWl3aWFXRjBJam94TlRBMU5Ea3hOelF5TENKbGVIQWlPakUxTURVME9UVXpOREo5LktHYWp6N0NjamtPUnIxS055TFgwRHFXaVRRM2s3d2Q0NDRsU0RiSFYtRV9adHY0bzhDdVlTTVJQRU12eGtncG5PaDBGd241OWROd2F5LXdqSkFZZWhCVWpCdllQZHgzejMzZDF0Uk5OcTlBUV9NQXJqZGVqQnkxcFpkR1FaY1diRUpMSUtPYXZuNGs2LS1mb0M4OUdkXzI2aU9tV1A1ZE9BcjRRU0tyVlZyRURlNDNnQXZ0Mms5anVpaGFnX1B5U0ROMjZXbVJDTVY4N2lFY3lzS3JfTTlXVExYS3k2NWU5czloNEpQYmdqMzZvSllrX3Bpbmk0YlJ6MERCd0lOLVI5TlAtZmkyT2VlRFptbXd4YzJXdnd1c05yaFJZamxGMmNkMjZwUFhaeTlMWlZPTU1fRERoTVpsMVVMclJvZnVFT1BMVXEtWFZZV3lmUXRMZnBPRkthdyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJiZGhldnVDN0g2eWZySVYxQ1A5b2h3Iiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFUxTERJd01Dd3hNaXc1TkN3eE9ERXNNakU0TERFMk55d3hNVGdzTkRRc05UUXNNemNzTWpNd0xESXlOU3cxT0N3eE9URXNNVFk0TERNMkxETTFMREUxTlN3NU55dzJPU3d5TWpVc01USXlMRGd5TERFek15dzJMREkwTlN3ek15d3pNeXd5TlRRc01UVXlMREU1TWl3eE1EY3NNVGMzTERFek5pdzBOaXd6TERjc09UZ3NOakFzTXpBc05ESXNNakE1TERFMk5Td3lNVFVzTVRVMExERTBNeXd4TmpZc05EQXNOaklzTVRFM0xEUXpMREkyTERJeU55dzFOQ3d4TXpZc05qVXNPVGNzTWl3NE55d3hNemNzTnpRc01Ua3lMRFk0TERJd05Dd3hPRGdzTWpRekxERXdOQ3d4TWpJc09UY3NNVGMzTERFek1Td3hPREVzTVRjNUxEZ3hMRFV5TERFMU5Dd3lOaXcyTERVekxEY3hMRGsxTERFeU1Dd3lNallzTVRBd0xESXlNQ3d5TURrc01UazFMREUzTVN3MU55d3hPRE1zTXpZc01UWTVMREUwTlN3NU9Dd3hNRFlzTVRnc01qQTJMREU0TUN3eE1EQXNNVFkzTERZeExERXdOeXcwTVN3ek5Dd3lMREkwTnl3eU5EUXNNVFV3TERFMk55d3lNRFFzTWpFMkxEVTVMREl5Tnl3NExESTJMRFUzTERFNE9Td3hOREVzTVRnNExEZzJMREl5TlN3eE1UZ3NNVEV4TERFM055d3hPRElzTVRjeExERTVMRFl3TERFNE55d3hNek1zTWpRc01UWTBMREUwT0N3eE9Ea3NPRFVzTVRjekxERTVNU3d5TVRJc01qUTNMREl3TVN3eE9ERXNOekVzT0Rnc01URXlMREUyT0N3eE16RXNNVGMwTERZM0xEWTBMREUxT1N3eU1EWXNNVFEzTERVMExEVTBMREUwTnl3NE5pdzFPQ3d5TWpVc01qa3NNekFzTVRJd0xESTBOaXd4Tmpjc056Z3NOekVzTVRReUxESXlPQ3c0TVN3eU16Z3NNVEF6TERZeUxESTBNeXd5TkRFc01qSTJMREUxTWl3Mk15d3hOaXc1T0N3eE56TXNNemNzTVRrMkxEVXlMRFU0TERRNUxERTRNU3cwTml3eE5Ea3NNVEE0TERFME9TdzBPU3czTERnekxERXhPQ3d5TWprc01qVTBMREl4Tnl3eE5qY3NNVFkzTERJeUxESTBOeXd4T1RVc01URXlMREV4TlN3eU5UQXNNQ3d4TlRjc01qVXhMREUzT0N3eU1Ea3NOeklzTVRVNUxERXlOeXd4T0RFc01URXlMRE13TERjMUxEa3NNak0yTERJeUxERXlNaXcyTUN3MU9Dd3hMREV5TlN3eU1qQXNNak0xTERJeU5Td3lNamdzTWpRekxESTBOQ3d5TVRZc01USXdMREV3Tnl3eE5qQXNNakV5TERFeU5Dd3lNalVzTnpFc01UazNMRE00TERFM01Dd3hNak1zTVRZNExETTVMRE0wTERFMk9Td3hPRFFzTlRnc01URXlMRGd3TERjMUxERTVNQ3d5TURjc01UY3lMREl4TXl3eUxETXNNU3d3TERFPSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE1MDU0OTE3NDIiLCJleHAiOiIxNTA1NDk1MzQyIiwiYWxnIjoiUlMyNTYiLCJraWQiOiI3ZWNiNTRjZTcxZDYxOGIyODMwY2NlYzk5MTg4MThlNzM4MTAwZjJhIn19';

    msgNodeResponseFunc = msgNodeResponseFuncPopulate;
    coreDiscovery = coreDiscoveryPopulate;
    storageManager = runtimeFactory.storageManager('idModule:identities');
    runtimeCapabilities = runtimeFactory.runtimeCapabilities(storageManager);
  });

  beforeEach('Init structures before each test', function() {
    bus = new MessageBus(registryPopulate);
    bus.pipeline = {};
    bus.pipeline.handlers = handlersPopulate;
    bus._onPostMessage = msg => {
      msgNodeResponseFunc(bus, msg);
    };

    let cryptoManager = CryptoManager;

    let dataObjectsStorage = new DataObjectsStorage(storageManager, {});
    identityModule = new IdentityModule(
      runtimeURL,
      runtimeCapabilities,
      storageManager,
      dataObjectsStorage,
      cryptoManager,
      runtimeFactory.createRuntimeCatalogue()
    );
    identityModule.messageBus = bus;
    identityModule.registry = registryPopulate;
    identityModule.coreDiscovery = coreDiscovery;

    let runtimeCoreCtx = new RuntimeCoreCtx(
      runtimeURL,
      identityModule,
      registryPopulate,
      storageManager,
      runtimeFactory.runtimeCapabilities()
    );
    policyEngine = new PEP(runtimeCoreCtx);
  });

  it('Check GUI deployment', function() {
    identityModule.deployGUI();
    assert(identityModule.guiDeployed, 'IDM is not deployed');
  });

  it('Check Identities to Choose', function() {
    identityModule.getIdentitiesToChoose().then(result => {
      expect(result).to.have.property('defaultIdentity');
      expect(result).to.have.property('identities');
      expect(result).to.have.property('idps');
    });
  });

  it('Check messageBus', function() {
    identityModule.messageBus = bus;
    assert.equal(
      bus,
      identityModule.messageBus,
      'MessageBus content is different'
    );
  });

  it('Check coreDiscovery', function() {
    identityModule.coreDiscovery = coreDiscovery;
    assert.equal(
      coreDiscovery,
      identityModule.coreDiscovery,
      'CoreDiscovery  content is different'
    );
  });

  it('Check registry', function() {
    assert.equal(
      registryPopulate,
      identityModule.registry,
      'Registry count is different'
    );
  });

  it.skip('test sendGenerateMessage', function(done) {
    let contents = 'BASE64_CONTENT';
    let origin = hyperURL1;

    bus._onPostMessage = msg => {
      let result =
        msg.type === 'execute' &&
        msg.to === idpDomainURL &&
        msg.from === idmURL &&
        msg.body.resource === 'identity' &&
        msg.body.method === 'generateAssertion' &&
        msg.body.params.contents === contents &&
        msg.body.params.origin === origin &&
        msg.body.params.usernameHint === loginUrl;
      assert(result, 'message content is not the expected');
      msgNodeResponseFunc(bus, msg);
    };

    identityModule
      .sendGenerateMessage(contents, origin, loginUrl, idpDomain)
      .then(resMsg => {
        assert.equal(
          resMsg.assertion,
          assertionVal,
          'Received message is not OK'
        );
      })
      .then(function() { done(); });
  });

  it('test requestIdentityToGUI', function(done) {
    let identities = identityModule.getIdentitiesToChoose().identities;
    let idps = identityModule.getIdentitiesToChoose().idps;

    bus._onPostMessage = msg => {
      let result =
        msg.type === 'create' &&
        msg.to === guiURL &&
        msg.from === idmURL &&
        msg.body.value.identities === identities &&
        msg.body.value.idps === idps;
      msgNodeResponseFunc(bus, msg);
    };

    identityModule.deployGUI();
    identityModule
      .requestIdentityToGUI(identities, idps)
      .then(resMsg => {
        assert.equal(resMsg.value, userEmail, 'Expected email was not found');
      })
      .then(function() { done(); });
  });

  //Does not exist any more
  it.skip('test getIdentities', function(done) {
    let returnedAssertionValue = returnedAssertionValuePopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .storeIdentity(returnedAssertionValue, keyPair)
        .then(result => {
          let storedIDData = identityModule.getIdentities();
          assert(
            storedIDData[0].hasOwnProperty('assertion'),
            'Identity was not found'
          );
        })
        .then(function() { done(); });
    });
  });

  //Methods have changed
  it.skip('test storeIdentity', function(done) {
    let returnedAssertionValue = returnedAssertionValuePopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .storeIdentity(returnedAssertionValue, keyPair)
        .then(result => {
          let hasAllRequiredFields =
            result.hasOwnProperty('userProfile') &&
            result.hasOwnProperty('idp') &&
            result.hasOwnProperty('assertion') &&
            result.hasOwnProperty('expires');
          assert(
            hasAllRequiredFields,
            'Returned data has not all the expected fields'
          );

          let storedIDData = identityModule.getIdentities();
          assert(
            storedIDData[0].hasOwnProperty('assertion'),
            'Stored data is not the exprected one'
          );
          assert.equal(identityModule.emailsList, userEmail);
        })
        .then(function() { done(); });
    });
  });

  it('test getIdentity', function() {
    identityModule.identities.addAssertion(sendGenerateMessageResponse);
    let retrivedID = identityModule.getIdentity(userURL);
    assert.equal(
      sendGenerateMessageResponse.assertion,
      retrivedID.assertion,
      'Retrived ID is not the same'
    );
  });


  it('test deleteIdentity', function() {
    identityModule.identities.addAssertion(sendGenerateMessageResponse);
    identityModule.deleteIdentity(userURL);
    let retrivedID = identityModule.getIdentity(userURL);
    assert.isEmpty(retrivedID, 'Identity was not removed');
  });


  it('test callIdentityModuleFunc', function(done) {
    let methodName = 'openPopup';
    let parameters = {
      urlreceived:
        'https://accounts.google.com/o/oauth2/auth?scope=openid%20email%20profile&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com&redirect_uri=https://localhost&response_type=code token id_token&state=state&access_type=offline&nonce=NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTQ3LDc3LDE2MiwyMjUsNzYsMTE5LDM4LDI1MSw3MiwyMjcsNTIsMjA4LDE4MSwxODQsMTUzLDU4LDExOCwxNTksODUsOTksNzEsMTE4LDQzLDIzMiwxMTUsMTEsMTgwLDE2LDIwNCwyMTIsODgsMjUwLDIyOCw0NywxNDksMTExLDc4LDEzNCwxMjEsMjA1LDIxNiwxOTgsMTYsMTE5LDEwMywxNTQsMjM5LDE1NSwxMjMsMTk4LDUxLDE3Niw4NywxNTcsMjQ0LDE1MiwxMDUsMTIsMjA1LDg5LDI1MiwyNTIsNDgsMTU4LDE1OCwyOSwxNzYsMTAzLDE1MSwyMDQsNzgsMjEsODAsMTQzLDEyMCwxMDcsMjQ1LDI0NSwzLDkxLDIwNiwyNCwxMjAsNzMsMTgwLDEyOCwxNjAsMTA0LDIxNyw4OSwzOCwyMzEsMjksMjI3LDI1Myw0OCwyOSw4MywxMDksMTU0LDI2LDIxNSwxMzEsMjQxLDIzNyw1MCwxMzEsMjM0LDc4LDcwLDEzOCwyNDMsNSwyNTMsMTgyLDkxLDIyNSwxODIsMTgwLDUyLDE3LDE1LDEwOSwxMSwxMjYsOTUsMjE2LDM3LDIyNCwxNCwwLDIxNSwyMDQsNjEsMTU2LDIwNywxMzEsMTIxLDc2LDkzLDE2OCwxNTEsNDAsMTcsMTI0LDExMCw4MiwyMTksMjA1LDIxNSwyNDksMTcsMjA4LDk2LDExNCwxOTQsNjcsMjMsMTUsMjA2LDIyNiwxMzIsMTg0LDE0MSwxMTgsMTAsMTA1LDkyLDg3LDYwLDE3NiwxNTYsMTMxLDk0LDUyLDEwLDI0OCwyNTUsMjM5LDgsMTgxLDE3Myw2NywxODEsMjUsNzYsMjU1LDUzLDE3NSwxOCwxMzgsMTkwLDEyNCwxODIsMTU1LDE4LDE5OSwxMzIsNzUsMjMyLDUsMTU2LDE1MiwxODcsMTIyLDU4LDIzNiwxNTgsMTY3LDQ3LDE5MywxMzYsODIsMjM0LDIxMSwxNzYsODAsMTg1LDE3MSwxMjMsMCw2LDE5OCwyMTQsMjEsMTAzLDc4LDIyNywzNywxMDIsNjksMTYsNjAsOCwyMDMsNTQsMTc0LDE3MiwyMDksMTY0LDIyMSwyNywxNTUsODUsMTI2LDE1NSwyNDEsODMsMSwxMTgsMTE3LDIsMjM3LDEwMSw3MiwxMDcsMiwzLDEsMCwx'
    };
    bus._onPostMessage = msg => {
      let result =
        msg.type === 'execute' &&
        msg.to === guiURL &&
        msg.from === idmURL &&
        msg.body.resource === 'identity' &&
        msg.body.method === methodName &&
        msg.body.params === parameters;
      assert(result, 'message content is not the expected');
      msgNodeResponseFunc(bus, msg);
    };
    identityModule
      .callIdentityModuleFunc(methodName, parameters)
      .then(resCode => {
        assert.equal(resCode, loginUrl, 'message content is not the exepected');
      })
      .then(function() { done(); });
  });

  it.skip('test generateAssertion', function(done) {
    let contents = '[1,2,3,4,5,6,7,8,9]';
    let origin = 'undefined';
    bus._onPostMessage = msg => {
      let result =
          msg.type === 'execute' &&
          msg.to === idpDomainURL &&
          msg.from === idmURL &&
          msg.body.resource === 'identity' &&
          msg.body.method === 'generateAssertion' &&
          msg.body.params.contents === contents &&
          msg.body.params.origin === origin &&
          msg.body.params.usernameHint === loginUrl;
      assert(result, 'message content is not the expected');
      msgNodeResponseFunc(bus, msg);
    };

    identityModule
      .generateAssertion(contents, origin, loginUrl, idpDomain)
      .then(result => {
        let hasRequiredFields =
            result.hasOwnProperty('userProfile') &&
            result.hasOwnProperty('idp') &&
            result.hasOwnProperty('assertion');

        let hasRequiredData =
            result.userProfile.username === userEmail &&
            result.userProfile.cn === cn &&
            result.userProfile.userURL === userURL;

        assert(
          hasRequiredFields && hasRequiredData,
          'Received data has not the requiered properties'
        );
      })
      .then(function() { done(); });
  });

  it.skip('test callGenerateMethods', function(done) {
    identityModule
      .callGenerateMethods(idpDomain)
      .then(result => {
        let hasRequiredFields =
          result.hasOwnProperty('userProfile') &&
          result.hasOwnProperty('idp') &&
          result.hasOwnProperty('assertion');

        let hasRequiredData =
          result.userProfile.username === userEmail &&
          result.userProfile.cn === cn &&
          result.userProfile.userURL === userURL;

        assert(
          hasRequiredFields && hasRequiredData,
          'Received data has not the requiered properties'
        );
      })
      .then(function() { done(); });
  });

  it('test validateAssertion', function(done) {
    identityModule
      .validateAssertion(assertionVal, undefined, idpDomain)
      .then(result => {
        assert.equal(
          result.contents,
          validateAssertionValuePopulate.contents,
          'Received data is not the expected'
        );
      })
      .then(function() { done(); });
  });

  it('test loginSelectedIdentity', function(done) {
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .loginSelectedIdentity(
          assertionVal,
          hyperURL1,
          idpDomain,
          keyPair,
          loginUrl
        )
        .then(result => {
          assert.equal(result, 'Login was successfull', 'Login failed');
        })
        .then(function() { done(); });
    });
  });

  it.skip('test selectIdentityFromGUI', function(done) {
    identityModule
      .selectIdentityFromGUI(undefined)
      .then(result => {
        assert(
          result.hasOwnProperty('userProfile'),
          'result does not have the required fields'
        );
      })
      .then(function() { done(); });
  });

  it.skip('test selectIdentityForHyperty', function(done) {
    identityModule
      .selectIdentityForHyperty(hyperURL1, idpDomain, '')
      .then(resMsg => {
        log(resMsg);
        let assertValue =
          resMsg.hasOwnProperty('userProfile') &&
          resMsg.hasOwnProperty('assertion') &&
          resMsg.assertion === returnedAssertionValuePopulate.assertion;

        assert(assertValue, 'Data or fields are not the expected ones');
      })
      .then(done);
  });


  it.skip('test getIdentityAssertion', function(done) {
    identityModule.runtimeCapabilities.isAvailable = runtimeCapabilitiesPopulate;
    identityModule
      .getIdentityAssertion(undefined)
      .then(result => {
        assert(
          result.hasOwnProperty('userProfile'),
          'Result does not contain the expected fields'
        );
      })
      .then(function() { done(); });
  });

  it.skip('test getIdToken', function(done) {
    let returnedAssertionValue = returnedAssertionValuePopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .storeIdentity(returnedAssertionValue, keyPair)
        .then(result => {
          identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
          identityModule
            .getIdToken(hyperURL1)
            .then(result => {
              assert(
                result.hasOwnProperty('userProfile'),
                'Result does not contain the expected fields'
              );
            })
            .then(function() { done(); });
        });
    });
  });

  it.skip('test _getValidToken', function(done) {
    let returnedAssertionValue = returnedAssertionValuePopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .storeIdentity(returnedAssertionValue, keyPair)
        .then(result => {
          identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
          identityModule
            ._getValidToken(hyperURL1)
            .then(result => {
              assert(
                result.hasOwnProperty('userProfile'),
                'Result does not contain the expected fields'
              );
            })
            .then(function() { done(); });
        });
    });
  });

  it.skip('test getToken', function(done) {
    let returnedAssertionValue = returnedAssertionValuePopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .storeIdentity(returnedAssertionValue, keyPair)
        .then(result => {
          identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
          identityModule.registry.isLegacy = function(arg) {
            return Promise.resolve(false);
          };
          identityModule
            .getToken(hyperURL1, runtimeURL)
            .then(result => {
              assert(
                result.hasOwnProperty('userProfile'),
                'Result does not contain the expected fields'
              );
            })
            .then(function() { done(); });
        });
    });
  });

  it('test _resolveDomain', function() {
    let expectedResult = 'domain-idp://google.com';
    assert.equal(
      identityModule._resolveDomain(''),
      expectedResult,
      'Result is not the expected one'
    );
    assert.equal(
      identityModule._resolveDomain('google.com'),
      expectedResult,
      'Result is not the expected one'
    );
  });
});

let runtimeCapabilitiesPopulate = arg => {
  if (arg === 'node') return Promise.resolve(true);
  else return Promise.resolve(false);
};

let handlersPopulate = [
  function(ctx) {
    policyEngine
      .authorise(ctx.msg)
      .then(function(changedMgs) {
        console.log('Authorized');
        changedMgs.body.identity = {
          userProfile: {
            userURL: userURL
          }
        };
        ctx.msg = changedMgs;
        ctx.next();
      })
      .catch(function(reason) {
        console.error(reason);
        ctx.fail(reason);
      });
  }
];

let msgNodeResponseFuncPopulate = (bus, msg) => {
  console.log('BUS RESPONSE');
  if (msg.type === 'subscribe') {
    log('msgNodeResponse subscribe: ' + msg);
    if (msg.id === 2) {

      //reporter subscribe
      expect(msg).to.contain.all.keys({
        id: 2, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.h1.domain/sm',
        body: { resources: [objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL1 }
      });
    } else {

      //observer subscribe
      expect(msg).to.contain.all.keys({
		  id: 5, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.obj1/sm',
		  body: { resources: [objURL + '/changes', objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL2 }
      });
	  }
  } else if (msg.type === 'execute') {
    log('msgNodeResponseFunc EXE');
    let resMsg = {
      id: msg.id,
      type: 'response',
      to: msg.from,
      from: msg.to,
      body: {
        auth: false,
        code: 200,
        value: ''
      }
    };
    log(resMsg);

    //		if(msg.body.method === 'generateAssertion' && msg.body.params.usernameHint != ''){
    if (msg.body.method === 'generateAssertion') {
      log('msgNodeResponseFunc generateAssertion');

      // if(msg.body.params.usernameHint == ''){
      // 	log('msgNodeResponseFunc loginUrl');
      // 	resMsg.body.value = {loginUrl: loginUrl};
      // }else{
      log('msgNodeResponseFunc assertionVal');
      resMsg.body.value = sendGenerateMessageResponse;

      //			}
    } else if (msg.body.method === 'openPopup') {
      log('msgNodeResponseFunc openPopup');
      resMsg.body.value = loginUrl;
 		} else if (msg.body.resource === 'identity') {
      if (msg.body.method === 'validateAssertion') {
        log('msgNodeResponseFunc validateAssertion');
        resMsg.body.value = validateAssertionValuePopulate;
      } else {
        log('msgNodeResponseFunc identity');
        resMsg.body.value = sendGenerateMessageResponse;
			 }
    }
    bus.postMessage(resMsg);
  } else if (msg.type === 'create') {
    log('msgNodeResponse generateAssertion: ' + msg);
    let resMsg = {
      id: msg.id,
      type: 'response',
      to: msg.from,
      from: msg.to,
      body: {
        code: 200,
        type: 'identity',
        value: userEmail
      }
    };
    log(resMsg);
	  bus.postMessage(resMsg);
  }
};

let registryPopulate = {
  registerDataObject: objectRegistration => {
    log('REGISTRY-OBJECT: ', objectRegistration);
    return new Promise(resolve => {
      resolve('ok');
    });
  },

  isInterworkingProtoStub: url => {
    log('isInterworkingProtoStub: ', url);
    return false;
  },

  unregisterDataObject: url => {
    log('Unregister Data Object:', url);
    return true;
  },

  getPreAuthSubscribers: () => {
    return ['hyperty://domain/hyperty-instance'];
  },
  getHypertyName: () => {
    return 'HypertyChat';
  },
  isDataObjectURL: dataObjectURL => {
    let splitURL = dataObjectURL.split('://');
    return splitURL[0] === 'comm';
  },
  registerSubscribedDataObject: () => {},
  registerSubscriber: () => {},
  isLocal: url => {
    log('isLocal: ', url);
    return false;
  },
  runtimeURL: runtimeURL
};

let sendGenerateMessageResponse =
{assertion: 'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkltSmhOR1JsWkRkbU5XRTVNalF5T1dZeU16TTFOakZoTXpabVpqWXhNMlZrTXpnM05qSmpNMlFpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWpGemREbExibEZsZWxWMVVqSXRObVJEUTFseVFrRWlMQ0p1YjI1alpTSTZJbHMwT0N3eE16QXNNU3d6TkN3ME9Dd3hNeXcyTERrc05ESXNNVE0wTERjeUxERXpOQ3d5TkRjc01UTXNNU3d4TERFc05Td3dMRE1zTVRNd0xERXNNVFVzTUN3ME9Dd3hNekFzTVN3eE1Dd3lMREV6TUN3eExERXNNQ3d4T1RBc01qUTRMREl5TWl3eE1qWXNNVEk0TERFM015d3lNRElzTVRNNExERTVNeXd4T0RJc01UZ3hMRFV5TERFeE1Td3hOVFVzTWpBeUxEWTRMREl3TERReExERXlNU3cyTVN3MU1DdzROeXcxTWl3eE56a3NPVEVzTkRFc01qUTRMREU0Tml3eU16Y3NPREFzTWpBMkxEa3dMREUzTXl3eE9EWXNNVFEwTERFMk9Td3hORFFzTWpFMExESXhNaXd5TVRBc01UZzVMREV5TkN3NU1pd3lORElzTVRBNUxESXdNaXd4TkRBc01qRXNNVE0yTERFMU9Td3lMRFl6TERBc01UVXlMREUyTml3eE9EWXNNVFkwTERFNE55d3hNVFlzTmpBc01UTTBMREkwTWl3eE1Ua3NNakUzTERZd0xERTRNaXd4TmpFc01UZ3dMRE0xTERnNExEYzBMREUxTnl3NU1pd3lNVEFzTWpRMUxEWTVMREV6Tml3eE56TXNOamNzTVRJNUxEZzBMREl3TERFM01pdzBPQ3d4TlRVc01USTVMREUwTERJeU9Td3hORGdzT1RVc01URXpMREV4Tnl3eU1UQXNNemNzTVRJNExERTNNU3d4TnpVc05UQXNNVGd6TERJMU5DdzVPU3czT1N3eE5UZ3NNVEl6TERVMUxERTRNQ3d5T1N3NU15d3hPRGtzT1Rrc09UTXNNVGt3TERZekxERTFNaXcwTUN3eU1EVXNNVGN5TERFM01pd3hPRGNzTUN3eU5USXNNVEk0TERFMk5Dd3lORFFzT0RBc016WXNPVE1zTVRnekxEUTVMREl3TVN3eE1Td3pPU3d4TWl3eE5UZ3NNQ3d5TkN3eE5UY3NNVGd6TERJeU5pd3lORElzTWpBekxERTJPU3d5TkRrc01UQTVMREV6T0N3eE1UQXNOakFzTVRjNUxERTVNQ3d4TWpVc01qUTFMREU1TERFMU9TdzBNaXd4TlRRc01qQTVMREUwTlN3eU5EQXNPVGdzTlRZc09USXNNakkzTERnc01UQTJMREV4TlN3eE1qY3NNalF4TERJMkxETXlMREUwTVN3eE9EZ3NOemtzTXpBc01UTXhMRFlzTVRZd0xESXpNaXczTlN3eU16TXNNalEwTERnd0xEVXhMREVzTlRJc01UTTNMREl3TUN3eU1URXNNemtzTVRVMkxERTBOaXd5TkRZc01qVXpMRFkxTERFeU5pdzVOQ3d4TVRjc01UVXhMREkxTWl3eU1qUXNNak0zTERZNUxERXdNQ3d4TURnc01qTXpMREl4TkN3eU1pd3lNakFzTVRNMkxERTBNU3d6Tnl3NU5pd3hOeXd5TVRJc01qQTJMREkxTERFeE9Dd3lNRGtzT1RZc01UUXlMREV4TERJeU1Dd3hPRFVzTWpFNExEUTJMREV5TlN3ek9DdzBPQ3d4TWpRc05EY3NNak1zTVRJNUxERXdPU3d5TURZc01UQTBMREl4TERJd05Dd3lNVGdzTWpBeUxERXpMREV6T0N3eE56VXNNVEUwTERFM05Td3lORGtzTlRRc05qWXNNVE16TERFMk55dzJOU3d4TkRJc05qZ3NNVFExTERFNE5Dd3hPU3d4Tnl3M015d3lMRE1zTVN3d0xERmRJaXdpWlhod0lqb3hOVEU0TVRBeU1qTXpMQ0pwYzNNaU9pSmhZMk52ZFc1MGN5NW5iMjluYkdVdVkyOXRJaXdpYW5ScElqb2laakE0WWpGa1pXVmpNbVEwWkdabE4yWXlNV1k0WkRjeE5ERmlOalZoTVROaFlUbGpNak0zTUNJc0ltbGhkQ0k2TVRVeE9EQTVPRFl6TTMwLlpSV1JXbkZTMmlkdHlKWnZYX0gyMHZkZ2FBYlllV3lQYzVIc2N0bzhrRVo3Z0VENDJDb1NjbS1WQ0l6SUF3R2J4V0F6ZG1xWFBFSDFNd1JfSWNJY2pZMGdRY0NKZVpkZy0xTFhZME5NWFVhZmNVQWdlcjdIeGJVNzU2b0tyQXZDQWdiRlJUenk3QW1qNDNPVkdYdDR5MXY4alpoWlRpLVU2cWJaOVBaOE1Ka1gwNExPUzMxQVRvZ1RnTURRWHRyV3N1dno3RHhKZ0U2djVBbkozemgyT0xCUHlJcWw0N0R4SGRhSURCcGsxQklMR19hRnJuc09oUTFRbWtqRDA2d0diUFNKVWtBdUVYbDNRYUFTY0QxLW9vTlNjREtxcDI2MkJ4Q2otVlFfMXpEY3NCd0s3UHp3TnBfVVpWVkVtRzYxcUVhMDZLdkJ6anllQzdiNjY0SUl0QSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiIxc3Q5S25RZXpVdVIyLTZkQ0NZckJBIiwibm9uY2UiOiJbNDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTkwLDI0OCwyMjIsMTI2LDEyOCwxNzMsMjAyLDEzOCwxOTMsMTgyLDE4MSw1MiwxMTEsMTU1LDIwMiw2OCwyMCw0MSwxMjEsNjEsNTAsODcsNTIsMTc5LDkxLDQxLDI0OCwxODYsMjM3LDgwLDIwNiw5MCwxNzMsMTg2LDE0NCwxNjksMTQ0LDIxNCwyMTIsMjEwLDE4OSwxMjQsOTIsMjQyLDEwOSwyMDIsMTQwLDIxLDEzNiwxNTksMiw2MywwLDE1MiwxNjYsMTg2LDE2NCwxODcsMTE2LDYwLDEzNCwyNDIsMTE5LDIxNyw2MCwxODIsMTYxLDE4MCwzNSw4OCw3NCwxNTcsOTIsMjEwLDI0NSw2OSwxMzYsMTczLDY3LDEyOSw4NCwyMCwxNzIsNDgsMTU1LDEyOSwxNCwyMjksMTQ4LDk1LDExMywxMTcsMjEwLDM3LDEyOCwxNzEsMTc1LDUwLDE4MywyNTQsOTksNzksMTU4LDEyMyw1NSwxODAsMjksOTMsMTg5LDk5LDkzLDE5MCw2MywxNTIsNDAsMjA1LDE3MiwxNzIsMTg3LDAsMjUyLDEyOCwxNjQsMjQ0LDgwLDM2LDkzLDE4Myw0OSwyMDEsMTEsMzksMTIsMTU4LDAsMjQsMTU3LDE4MywyMjYsMjQyLDIwMywxNjksMjQ5LDEwOSwxMzgsMTEwLDYwLDE3OSwxOTAsMTI1LDI0NSwxOSwxNTksNDIsMTU0LDIwOSwxNDUsMjQwLDk4LDU2LDkyLDIyNyw4LDEwNiwxMTUsMTI3LDI0MSwyNiwzMiwxNDEsMTg4LDc5LDMwLDEzMSw2LDE2MCwyMzIsNzUsMjMzLDI0NCw4MCw1MSwxLDUyLDEzNywyMDAsMjExLDM5LDE1NiwxNDYsMjQ2LDI1Myw2NSwxMjYsOTQsMTE3LDE1MSwyNTIsMjI0LDIzNyw2OSwxMDAsMTA4LDIzMywyMTQsMjIsMjIwLDEzNiwxNDEsMzcsOTYsMTcsMjEyLDIwNiwyNSwxMTgsMjA5LDk2LDE0MiwxMSwyMjAsMTg1LDIxOCw0NiwxMjUsMzgsNDgsMTI0LDQ3LDIzLDEyOSwxMDksMjA2LDEwNCwyMSwyMDQsMjE4LDIwMiwxMywxMzgsMTc1LDExNCwxNzUsMjQ5LDU0LDY2LDEzMywxNjcsNjUsMTQyLDY4LDE0NSwxODQsMTksMTcsNzMsMiwzLDEsMCwxXSIsImV4cCI6IjE1MTgxMDIyMzMiLCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiZjA4YjFkZWVjMmQ0ZGZlN2YyMWY4ZDcxNDFiNjVhMTNhYTljMjM3MCIsImlhdCI6IjE1MTgwOTg2MzMiLCJhbGciOiJSUzI1NiIsImtpZCI6ImJhNGRlZDdmNWE5MjQyOWYyMzM1NjFhMzZmZjYxM2VkMzg3NjJjM2QifX0=',
  idp: {
    domain: 'google.com',
    protocol: 'OIDC'},
  expires: '1518102233',
  userProfile: {
    sub: '117959105295761687889',
    name: 'test think',
    given_name: 'test',
    family_name: 'think',
    picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
    email: 'testandthink123@gmail.com',
    email_verified: true,
    locale: 'en',
    userURL: 'user://google.com/testandthink123@gmail.com',
    preferred_username: 'testandthink123'}};


let returnedAssertionValuePopulate = {
  assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqZGxZMkkxTkdObE56RmtOakU0WWpJNE16QmpZMlZqT1RreE9EZ3hPR1UzTXpneE1EQm1NbUVpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SW1Ka2FHVjJkVU0zU0RaNVpuSkpWakZEVURsdmFIY2lMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVZURk1SRWwzVFVOM2VFMXBkelZPUTNkNFQwUkZjMDFxUlRSTVJFVXlUbmwzZUUxVVozTk9SRkZ6VGxSUmMwMTZZM05OYWsxM1RFUkplVTVUZHpGUFEzZDRUMVJGYzAxVVdUUk1SRTB5VEVSTk1VeEVSVEZPVTNjMVRubDNNazlUZDNsTmFsVnpUVlJKZVV4RVozbE1SRVY2VFhsM01reEVTVEJPVTNkNlRYbDNlazE1ZDNsT1ZGRnpUVlJWZVV4RVJUVk5hWGQ0VFVSamMwMVVZek5NUkVWNlRtbDNNRTVwZDNwTVJHTnpUMVJuYzA1cVFYTk5la0Z6VGtSSmMwMXFRVFZNUkVVeVRsTjNlVTFVVlhOTlZGVXdURVJGTUUxNWQzaE9hbGx6VGtSQmMwNXFTWE5OVkVVelRFUlJla3hFU1RKTVJFbDVUbmwzTVU1RGQzaE5lbGx6VG1wVmMwOVVZM05OYVhjMFRubDNlRTE2WTNOT2VsRnpUVlJyZVV4RVdUUk1SRWwzVGtOM2VFOUVaM05OYWxGNlRFUkZkMDVEZDNoTmFrbHpUMVJqYzAxVVl6Tk1SRVY2VFZOM2VFOUVSWE5OVkdNMVRFUm5lRXhFVlhsTVJFVXhUa04zZVU1cGR6Sk1SRlY2VEVSamVFeEVhekZNUkVWNVRVTjNlVTFxV1hOTlZFRjNURVJKZVUxRGQzbE5SR3R6VFZSck1VeEVSVE5OVTNjeFRubDNlRTlFVFhOTmVsbHpUVlJaTlV4RVJUQk9VM2MxVDBOM2VFMUVXWE5OVkdkelRXcEJNa3hFUlRSTlEzZDRUVVJCYzAxVVdUTk1SRmw0VEVSRmQwNTVkekJOVTNkNlRrTjNlVXhFU1RCT2VYZDVUa1JSYzAxVVZYZE1SRVV5VG5sM2VVMUVVWE5OYWtVeVRFUlZOVXhFU1hsT2VYYzBURVJKTWt4RVZUTk1SRVUwVDFOM2VFNUVSWE5OVkdjMFRFUm5Na3hFU1hsT1UzZDRUVlJuYzAxVVJYaE1SRVV6VG5sM2VFOUVTWE5OVkdONFRFUkZOVXhFV1hkTVJFVTBUbmwzZUUxNlRYTk5hbEZ6VFZSWk1FeEVSVEJQUTNkNFQwUnJjMDlFVlhOTlZHTjZURVJGTlUxVGQzbE5WRWx6VFdwUk0weEVTWGROVTNkNFQwUkZjMDU2UlhOUFJHZHpUVlJGZVV4RVJUSlBRM2Q0VFhwRmMwMVVZekJNUkZrelRFUlpNRXhFUlRGUFUzZDVUVVJaYzAxVVVUTk1SRlV3VEVSVk1FeEVSVEJPZVhjMFRtbDNNVTlEZDNsTmFsVnpUV3ByYzAxNlFYTk5WRWwzVEVSSk1FNXBkM2hPYW1OelRucG5jMDU2UlhOTlZGRjVURVJKZVU5RGR6Uk5VM2Q1VFhwbmMwMVVRWHBNUkZsNVRFUkpNRTE1ZDNsT1JFVnpUV3BKTWt4RVJURk5hWGN5VFhsM2VFNXBkelZQUTNkNFRucE5jMDE2WTNOTlZHc3lURVJWZVV4RVZUUk1SRkUxVEVSRk5FMVRkekJPYVhkNFRrUnJjMDFVUVRSTVJFVXdUMU4zTUU5VGR6Tk1SR2Q2VEVSRmVFOURkM2xOYW10elRXcFZNRXhFU1hoT2VYZDRUbXBqYzAxVVdUTk1SRWw1VEVSSk1FNTVkM2hQVkZWelRWUkZlVXhFUlhoT1UzZDVUbFJCYzAxRGQzaE9WR056VFdwVmVFeEVSVE5QUTNkNVRVUnJjMDU2U1hOTlZGVTFURVJGZVU1NWQzaFBSRVZ6VFZSRmVVeEVUWGRNUkdNeFRFUnJjMDFxVFRKTVJFbDVURVJGZVUxcGR6Sk5RM2N4VDBOM2VFeEVSWGxPVTNkNVRXcEJjMDFxVFRGTVJFbDVUbE4zZVUxcVozTk5hbEY2VEVSSk1FNURkM2xOVkZselRWUkpkMHhFUlhkT2VYZDRUbXBCYzAxcVJYbE1SRVY1VGtOM2VVMXFWWE5PZWtWelRWUnJNMHhFVFRSTVJFVXpUVU4zZUUxcVRYTk5WRmswVEVSTk5VeEVUVEJNUkVVeVQxTjNlRTlFVVhOT1ZHZHpUVlJGZVV4RVozZE1SR014VEVSRk5VMURkM2xOUkdOelRWUmplVXhFU1hoTmVYZDVURVJOYzAxVGQzZE1SRVU5SWl3aWFYTnpJam9pYUhSMGNITTZMeTloWTJOdmRXNTBjeTVuYjI5bmJHVXVZMjl0SWl3aWFXRjBJam94TlRBMU5Ea3hOelF5TENKbGVIQWlPakUxTURVME9UVXpOREo5LktHYWp6N0NjamtPUnIxS055TFgwRHFXaVRRM2s3d2Q0NDRsU0RiSFYtRV9adHY0bzhDdVlTTVJQRU12eGtncG5PaDBGd241OWROd2F5LXdqSkFZZWhCVWpCdllQZHgzejMzZDF0Uk5OcTlBUV9NQXJqZGVqQnkxcFpkR1FaY1diRUpMSUtPYXZuNGs2LS1mb0M4OUdkXzI2aU9tV1A1ZE9BcjRRU0tyVlZyRURlNDNnQXZ0Mms5anVpaGFnX1B5U0ROMjZXbVJDTVY4N2lFY3lzS3JfTTlXVExYS3k2NWU5czloNEpQYmdqMzZvSllrX3Bpbmk0YlJ6MERCd0lOLVI5TlAtZmkyT2VlRFptbXd4YzJXdnd1c05yaFJZamxGMmNkMjZwUFhaeTlMWlZPTU1fRERoTVpsMVVMclJvZnVFT1BMVXEtWFZZV3lmUXRMZnBPRkthdyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJiZGhldnVDN0g2eWZySVYxQ1A5b2h3Iiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFUxTERJd01Dd3hNaXc1TkN3eE9ERXNNakU0TERFMk55d3hNVGdzTkRRc05UUXNNemNzTWpNd0xESXlOU3cxT0N3eE9URXNNVFk0TERNMkxETTFMREUxTlN3NU55dzJPU3d5TWpVc01USXlMRGd5TERFek15dzJMREkwTlN3ek15d3pNeXd5TlRRc01UVXlMREU1TWl3eE1EY3NNVGMzTERFek5pdzBOaXd6TERjc09UZ3NOakFzTXpBc05ESXNNakE1TERFMk5Td3lNVFVzTVRVMExERTBNeXd4TmpZc05EQXNOaklzTVRFM0xEUXpMREkyTERJeU55dzFOQ3d4TXpZc05qVXNPVGNzTWl3NE55d3hNemNzTnpRc01Ua3lMRFk0TERJd05Dd3hPRGdzTWpRekxERXdOQ3d4TWpJc09UY3NNVGMzTERFek1Td3hPREVzTVRjNUxEZ3hMRFV5TERFMU5Dd3lOaXcyTERVekxEY3hMRGsxTERFeU1Dd3lNallzTVRBd0xESXlNQ3d5TURrc01UazFMREUzTVN3MU55d3hPRE1zTXpZc01UWTVMREUwTlN3NU9Dd3hNRFlzTVRnc01qQTJMREU0TUN3eE1EQXNNVFkzTERZeExERXdOeXcwTVN3ek5Dd3lMREkwTnl3eU5EUXNNVFV3TERFMk55d3lNRFFzTWpFMkxEVTVMREl5Tnl3NExESTJMRFUzTERFNE9Td3hOREVzTVRnNExEZzJMREl5TlN3eE1UZ3NNVEV4TERFM055d3hPRElzTVRjeExERTVMRFl3TERFNE55d3hNek1zTWpRc01UWTBMREUwT0N3eE9Ea3NPRFVzTVRjekxERTVNU3d5TVRJc01qUTNMREl3TVN3eE9ERXNOekVzT0Rnc01URXlMREUyT0N3eE16RXNNVGMwTERZM0xEWTBMREUxT1N3eU1EWXNNVFEzTERVMExEVTBMREUwTnl3NE5pdzFPQ3d5TWpVc01qa3NNekFzTVRJd0xESTBOaXd4Tmpjc056Z3NOekVzTVRReUxESXlPQ3c0TVN3eU16Z3NNVEF6TERZeUxESTBNeXd5TkRFc01qSTJMREUxTWl3Mk15d3hOaXc1T0N3eE56TXNNemNzTVRrMkxEVXlMRFU0TERRNUxERTRNU3cwTml3eE5Ea3NNVEE0TERFME9TdzBPU3czTERnekxERXhPQ3d5TWprc01qVTBMREl4Tnl3eE5qY3NNVFkzTERJeUxESTBOeXd4T1RVc01URXlMREV4TlN3eU5UQXNNQ3d4TlRjc01qVXhMREUzT0N3eU1Ea3NOeklzTVRVNUxERXlOeXd4T0RFc01URXlMRE13TERjMUxEa3NNak0yTERJeUxERXlNaXcyTUN3MU9Dd3hMREV5TlN3eU1qQXNNak0xTERJeU5Td3lNamdzTWpRekxESTBOQ3d5TVRZc01USXdMREV3Tnl3eE5qQXNNakV5TERFeU5Dd3lNalVzTnpFc01UazNMRE00TERFM01Dd3hNak1zTVRZNExETTVMRE0wTERFMk9Td3hPRFFzTlRnc01URXlMRGd3TERjMUxERTVNQ3d5TURjc01UY3lMREl4TXl3eUxETXNNU3d3TERFPSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE1MDU0OTE3NDIiLCJleHAiOiIxNTA1NDk1MzQyIiwiYWxnIjoiUlMyNTYiLCJraWQiOiI3ZWNiNTRjZTcxZDYxOGIyODMwY2NlYzk5MTg4MThlNzM4MTAwZjJhIn19',
  identity: 'user://google.com/testandthink123@gmail.com',
  idp: {
    domain: 'google.com',
    protocol: 'OIDC'
  },
  info: {
    accessToken:
          'ya29.GlvHBPvz5L_9BXW-Bur0qZT7PIcQTEHVqtVexuyy9nk6C…RDnHKbHMj209B26C4sHaa3Q89dbE5SOebteYb8o8mUxsjA5sF',
    idToken:
          'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdlY2I1NGNlNzFkNjE4Yj…PXZy9LZVOMM_DDhMZl1ULrRofuEOPLUq-XVYWyfQtLfpOFKaw',
    refreshToken: '1/mbg9sQp1fhrnH8IkglzzkGsl9nTgU__BTyp7lcdmBA4',
    tokenType: 'Bearer',
    infoToken: {
      sub: '117959105295761687889',
      name: 'test think',
      given_name: 'test',
      family_name: 'think',
      picture:
            'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
    },
    keyPair: {
      public: new Uint8Array(294),
      private: new Uint8Array(1218)
    },
    messageInfo: {
      userProfile: 'userProfile',
      idp: 'google.com',
      assertion: 'assertion_repeated',
      expires: '1505495342'
    }
  }
};

let validateAssertionValuePopulate = {
  identity: 'testandthink321@gmail.com',
  contents: 'NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTU4LDE0NCwxNjEsOTcsMTU1LDIxNyw0MCw1MiwxMzgsMTQ3LDI4LDIwNiwxNTgsMjMyLDE0Miw1OSwxMTksNjEsMTE1LDYwLDIzMSwyMDMsNzksNTcsNTQsMTg3LDUyLDEyNCw2MSw3MCwyNywxOTIsNzgsMTYyLDExMywxMTIsMjksNTksMTg3LDQ2LDE3NSwxMDUsMTUsMTQwLDE1NCw2NCwxOTgsMTI5LDE0Myw1OSwyMjksMTA3LDk2LDExNiw3Myw2MywxNjAsMTUxLDE0MiwxMTIsOTUsMTIsMzUsMTE3LDI1MCw3MiwyMjEsMTc1LDU3LDIxNSwxMzksNDcsMTY5LDIzLDE3MywyMzIsMjAwLDE2NSwxNCwyMzcsNTYsMTUyLDIwMyw3LDEzOSwxMzQsMjQ5LDExMCwxNTMsMTYyLDY1LDIzNSw0MywxODIsMjIyLDE2NCwyMDcsNzQsMjQ5LDkwLDUxLDEzNiwyMjUsNTYsMTE5LDk1LDEzOCwxNjUsMjUsMTc3LDI1NCwyMjYsMjExLDg4LDI0MywxNiwxMDksODYsMTYxLDE0NywxNDQsMTM5LDE0NCw2LDcyLDQ0LDE2MywxMjAsNjEsMTk5LDk4LDEwNiwxMzMsMTg3LDEzMiwyMCwyNDQsMjcsMjM2LDIyOSwxOTcsMTE5LDE5NiwzNywxNDcsMTMwLDEzOSwyMzcsMTQ0LDE5MSwyMzMsMTY3LDEzMyw1MSwxNDYsMTEsMjA3LDYyLDE1NywxMzYsMzEsNzksMTYzLDQ4LDE4NCwxNTAsMjIyLDE1NCwyMCw3OCwyMzMsMjE2LDU1LDEzNCwxNzQsOTksMjIxLDgsOTQsMTQxLDE2Niw0NywxMzAsODksMjQ3LDIwMiwyMDMsMTIwLDk3LDEwMywyMTksMTA4LDQwLDUzLDEyNiwxODYsMywyMTksODYsODksMjM0LDE4Miw0Miw0OCwxNTIsMjAyLDYsMTMxLDE4NCwxMDUsNzIsOTMsMTA3LDIxNywxNzAsNzEsMTMwLDE4MywxMzYsMjU0LDEyMiw5OCwxNjQsNzUsMjM2LDE0NiwxMjcsMjcsMjYsMTQzLDExMiwxMTIsMjMyLDI0NCwxOSwxOTUsMjUzLDEwMywxODksNzgsMTI5LDIzMiwxNDcsMTg3LDk2LDQsMjMsMTQsMyw1MCwxMzMsOTMsMjMyLDI0NywyMDgsMjA1LDIsMywxLDAsMQ=='
};

let coreDiscoveryPopulate = function(arg1, arg2) {
  return Promise.resolve({ dataObject: 'hyperty://h1.domain/h1' });
};

function log(arg1, arg2) {
  console.log(arg1, arg2)
}

let getHypertyOwnerPopulate = arg => {
  return 'user://google.com/testandthink123@gmail.com';
};
