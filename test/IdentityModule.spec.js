'use strict mode';
import chaiAsPromised from 'chai-as-promised';
import assertArrays from 'chai-arrays';
import MessageBus from '../src/bus/MessageBus';
import IdentityModule from '../src/identity/IdentityModule';
import { runtimeFactory } from './resources/runtimeFactory';
import DataObjectsStorage from '../src/store-objects/DataObjectsStorage';
import PEP from '../src/policy/PEP';
import RuntimeCoreCtx from '../src/policy/context/RuntimeCoreCtx';
import Crypto from '../src/identity/Crypto';

chai.config.truncateThreshold = 0;
chai.use(chaiAsPromised);
chai.use(assertArrays);

const assert = chai.assert;
const SHOULD = chai.should;

const IV_SIZE = 16;
const RANDOM_VALUE_SIZE = 32;
const PMS_SIZE = 48;

let crypto = undefined;

let bus = undefined;
let storageManager = undefined;
let runtimeCapabilities = undefined;
let hyperURL1 = undefined;
let hyperURL2 = undefined;
let runtimeURL = undefined;
let idpDomain = undefined;
let idpDomainURL = undefined;
let usernameHint = undefined;
let policyEngine = undefined;
let msgNodeResponseFunc = undefined;
let coreDiscovery = undefined;
let idmURL = undefined;
let objURL = undefined;
let handlers = undefined;
let identityModule = undefined;
let userEmail = undefined;
let guiURL = undefined;
let userURL = undefined;
let idps = undefined;
let cn = undefined;
let loginUrl = undefined;
let loginURLResponse = undefined;
let assertion_val = undefined;

describe('Crypto tests', function() {

  before('Init structures before test', function() {
    crypto = new Crypto(runtimeFactory);
    console.log(crypto);
  });

  //note: new TextEncoder('utf-8').encode(s);
  //      new TextDecoder('utf-8').decode(s);

  it.skip('Code and encode test', function() {
    let value = new Uint8Array([10, 15, 25, 55, 18, 4, 6]);
    let encodedValue = crypto.encode(value);
    let decodedValue = crypto.decode(encodedValue);
    console.log(value, decodedValue);
    expect(value).to.be.equalTo(decodedValue);
  });

  it('Test generated IVs', function() {
    let IV_1 = crypto.generateIV();
    let IV_2 = crypto.generateIV();
    expect(IV_1).to.be.ofSize(IV_SIZE);
    expect(IV_2).to.be.ofSize(IV_SIZE);
    expect(IV_1).not.to.be.equalTo(IV_2);
  });

  it('Test generated random values', function() {
    let rand_1 = crypto.generateRandom();
    let rand_2 = crypto.generateRandom();
    expect(rand_1).to.be.ofSize(RANDOM_VALUE_SIZE);
    expect(rand_2).to.be.ofSize(RANDOM_VALUE_SIZE);
    expect(rand_1).not.to.be.equalTo(rand_2);
  });

  it('Test generatePMS key', function() {
    let PMS_1 = crypto.generatePMS();
    let PMS_2 = crypto.generatePMS();
    expect(PMS_1).to.be.ofSize(PMS_SIZE);
    expect(PMS_2).to.be.ofSize(PMS_SIZE);
    expect(PMS_1).not.to.be.equalTo(PMS_2);
  });

  it('Test generateMasterSecret key', function(done) {
    let oldKey = crypto.generateRandom();
    let seed = crypto.generateRandom();

    crypto.generateMasterSecret(oldKey, seed).then(key1 => {
      crypto
        .generateMasterSecret(oldKey, seed)
        .then(key2 => {
          expect(key1).to.be.ofSize(PMS_SIZE);
          expect(key2).to.be.ofSize(PMS_SIZE);
          expect(key1).to.be.equalTo(key2);
        })
        .then(done, done);
    });
  });

  it('Test concatPMSwithRandoms key', function() {
    let PMSKey = crypto.generatePMS();
    let rand1 = crypto.generateRandom();
    let rand2 = crypto.generateRandom();
    let totalSize = PMSKey.length + rand1.length + rand2.length;
    let concat1 = crypto.concatPMSwithRandoms(PMSKey, rand1, rand2);
    let concat2 = crypto.concatPMSwithRandoms(PMSKey, rand1, rand2);
    expect(concat1).to.be.ofSize(totalSize);
    expect(concat2).to.be.ofSize(totalSize);
    expect(concat1).to.be.equalTo(concat2);
  });

  it('Test generateKeys', function(done) {
    let secret = crypto.generateRandom();
    let seed = crypto.generateRandom();
    crypto.generateKeys(secret, seed).then(key1 => {
      crypto
        .generateKeys(secret, seed)
        .then(key2 => {
          expect(key1).to.be.ofSize(4);
          expect(key1[0]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key1[1]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key1[2]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key1[3]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key2).to.be.ofSize(4);
          expect(key2[0]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key2[1]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key2[2]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key2[3]).to.be.ofSize(RANDOM_VALUE_SIZE);
          expect(key1).not.to.be.equalTo(key2);
        })
        .then(done, done);
    });
  });

  it('Test genereated keys pair with encrypt and decrypt data', function(done) {
    crypto.generateRSAKeyPair().then(keyPair => {
      let data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      crypto.encryptRSA(keyPair.public, data).then(encryptedData => {
        crypto
          .decryptRSA(keyPair.private, encryptedData)
          .then(decryptedData => {
            expect(data).to.be.equalTo(decryptedData);
          })
          .then(done, done);
      });
    });
  });

  it('Test AES algorithm', function(done) {
    let AESKey = crypto.generateRandom();
    let IV = crypto.generateIV();
    expect(AESKey).to.be.ofSize(RANDOM_VALUE_SIZE);
    expect(IV).to.be.ofSize(IV_SIZE);
    let data = '0,1,2,3,4,5,6,7,8,9';
    crypto.encryptAES(AESKey, data, IV).then(encryptedData => {
      crypto
        .decryptAES(AESKey, encryptedData, IV)
        .then(decryptedData => {
          expect(data).to.equal(decryptedData);
        })
        .then(done, done);
    });
  });

  //NOTE: encryptRSA and signRSA use different encode types (_utf8Encode vs. Uint8Array)
  it.skip('Test genereated keys pair, signRSA and verifyRSA', function(done) {
    crypto.generateRSAKeyPair().then(keyPair => {
      //			log(keyPair.private)
      let data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      crypto.signRSA(keyPair.private, data).then(signedData => {
        crypto
          .verifyRSA(keyPair.public, data, signedData)
          .then(verificationResult => {
            assert.isTrue(verificationResult, 'The signitured is different');
          })
          .then(done, done);
      });
    });
  });

  it('Test hashHMAC and verifyHMAC', function(done) {
    let key = crypto.generateRandom();
    let data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    crypto.hashHMAC(key, data).then(HMAC => {
      crypto
        .verifyHMAC(key, data, HMAC)
        .then(verificationResult => {
          assert.isTrue(verificationResult, 'HMAC is different');
        })
        .then(done, done);
    });
  });
});

describe('Identity Module tests', function() {

  before('Init structures once before all tests', function() {
    crypto = new Crypto(runtimeFactory);

    hyperURL1 = 'hyperty://h1.domain/h1';
    hyperURL2 = 'hyperty://h2.domain/h2';
    runtimeURL = 'runtime://fake-runtime';
    idmURL = runtimeURL + '/idm';
    objURL = 'resource://obj1';
    idpDomain = 'google.com';
    idpDomainURL = 'domain-idp://' + idpDomain;
    usernameHint = 'usernameHint';
    userEmail = 'testandthink123@gmail.com';
    guiURL = runtimeURL + '/identity-gui';
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
    loginURLResponse =
      'https://localhost/#state=state&code=4/8HTc7jG3P6q3YwJQ5qAtwVRHXYvZakRLTINxxFJBBFM&access_token=ya29.GlvOBPazlCr7mGEJgoQnXlqSZIvlFDi6vRnGQP4yd-flNwoWZZqCNuMFcXTpgB7rLoNSPiW6Xz8zK1yRXCozWcHABAHzu8YqLD3HpmQNXaNEvnE13_8MuklNfy8K&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImU2YmEyOTY5NTU2NWY3ODQ3OTkwMWNmMzU5ZmQ2ZTliZGJiZDdjY2QifQ.eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NTkxMDUyOTU3NjE2ODc4ODkiLCJlbWFpbCI6InRlc3RhbmR0aGluazEyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjVkUnVaOXh5X3NxRm5ucVhMX3lkQ3ciLCJjX2hhc2giOiJJMldjY3U4SGZhenNSNkZpQXdoam9RIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFEzTERjM0xERTJNaXd5TWpVc056WXNNVEU1TERNNExESTFNU3czTWl3eU1qY3NOVElzTWpBNExERTRNU3d4T0RRc01UVXpMRFU0TERFeE9Dd3hOVGtzT0RVc09Ua3NOekVzTVRFNExEUXpMREl6TWl3eE1UVXNNVEVzTVRnd0xERTJMREl3TkN3eU1USXNPRGdzTWpVd0xESXlPQ3cwTnl3eE5Ea3NNVEV4TERjNExERXpOQ3d4TWpFc01qQTFMREl4Tml3eE9UZ3NNVFlzTVRFNUxERXdNeXd4TlRRc01qTTVMREUxTlN3eE1qTXNNVGs0TERVeExERTNOaXc0Tnl3eE5UY3NNalEwTERFMU1pd3hNRFVzTVRJc01qQTFMRGc1TERJMU1pd3lOVElzTkRnc01UVTRMREUxT0N3eU9Td3hOellzTVRBekxERTFNU3d5TURRc056Z3NNakVzT0RBc01UUXpMREV5TUN3eE1EY3NNalExTERJME5Td3pMRGt4TERJd05pd3lOQ3d4TWpBc056TXNNVGd3TERFeU9Dd3hOakFzTVRBMExESXhOeXc0T1N3ek9Dd3lNekVzTWprc01qSTNMREkxTXl3ME9Dd3lPU3c0TXl3eE1Ea3NNVFUwTERJMkxESXhOU3d4TXpFc01qUXhMREl6Tnl3MU1Dd3hNekVzTWpNMExEYzRMRGN3TERFek9Dd3lORE1zTlN3eU5UTXNNVGd5TERreExESXlOU3d4T0RJc01UZ3dMRFV5TERFM0xERTFMREV3T1N3eE1Td3hNallzT1RVc01qRTJMRE0zTERJeU5Dd3hOQ3d3TERJeE5Td3lNRFFzTmpFc01UVTJMREl3Tnl3eE16RXNNVEl4TERjMkxEa3pMREUyT0N3eE5URXNOREFzTVRjc01USTBMREV4TUN3NE1pd3lNVGtzTWpBMUxESXhOU3d5TkRrc01UY3NNakE0TERrMkxERXhOQ3d4T1RRc05qY3NNak1zTVRVc01qQTJMREl5Tml3eE16SXNNVGcwTERFME1Td3hNVGdzTVRBc01UQTFMRGt5TERnM0xEWXdMREUzTml3eE5UWXNNVE14TERrMExEVXlMREV3TERJME9Dd3lOVFVzTWpNNUxEZ3NNVGd4TERFM015dzJOeXd4T0RFc01qVXNOellzTWpVMUxEVXpMREUzTlN3eE9Dd3hNemdzTVRrd0xERXlOQ3d4T0RJc01UVTFMREU0TERFNU9Td3hNeklzTnpVc01qTXlMRFVzTVRVMkxERTFNaXd4T0Rjc01USXlMRFU0TERJek5pd3hOVGdzTVRZM0xEUTNMREU1TXl3eE16WXNPRElzTWpNMExESXhNU3d4TnpZc09EQXNNVGcxTERFM01Td3hNak1zTUN3MkxERTVPQ3d5TVRRc01qRXNNVEF6TERjNExESXlOeXd6Tnl3eE1ESXNOamtzTVRZc05qQXNPQ3d5TURNc05UUXNNVGMwTERFM01pd3lNRGtzTVRZMExESXlNU3d5Tnl3eE5UVXNPRFVzTVRJMkxERTFOU3d5TkRFc09ETXNNU3d4TVRnc01URTNMRElzTWpNM0xERXdNU3czTWl3eE1EY3NNaXd6TERFc01Dd3giLCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiY2YwYTMzZjY5OGRhN2M5ZmEwM2UxNmQ5Y2U5OWQ4NGUwNzk5ZWVhZiIsImlhdCI6MTUwNjA4NzI5NywiZXhwIjoxNTA2MDkwODk3fQ.pngFfaQ8u9PRYBJ986PyR5S3Qg9EqDU0Rn2ELikR9dh9bVeJBQgn-JLGMpu6lReNSuPDY-O0UTbgaIlGaz5-_HO4_mxZf8A8b0KbTsq9tBmO55PdjGTwc86BPSeWUcS_Y7J6Y09Oz6NN8nycNZAWANi2PJykLQu64RseIy5HJktrU6LODfDPNbQpi_qZLM0DNDRB8geKKu0k2V4BNB29aEOQTc0atjmVQBjDIkZAxbATx_BmXaG2AvomEUPhd9kIATu7u6ZE-NnrTQPYn6YOAK9rCIdb5A0-JHDkqIUXnJBbPpYr_RZmKQZgF1Jql6yH3QpAPG2-3TTVoyw_TRWJ-g&authuser=0&session_state=576b72758ecad0f00705f024a89f7f6d3a7d17dd..939b&prompt=consent';
    assertion_val =
      'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqZGxZMkkxTkdObE56RmtOakU0WWpJNE16QmpZMlZqT1RreE9EZ3hPR1UzTXpneE1EQm1NbUVpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SW1Ka2FHVjJkVU0zU0RaNVpuSkpWakZEVURsdmFIY2lMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVZURk1SRWwzVFVOM2VFMXBkelZPUTNkNFQwUkZjMDFxUlRSTVJFVXlUbmwzZUUxVVozTk9SRkZ6VGxSUmMwMTZZM05OYWsxM1RFUkplVTVUZHpGUFEzZDRUMVJGYzAxVVdUUk1SRTB5VEVSTk1VeEVSVEZPVTNjMVRubDNNazlUZDNsTmFsVnpUVlJKZVV4RVozbE1SRVY2VFhsM01reEVTVEJPVTNkNlRYbDNlazE1ZDNsT1ZGRnpUVlJWZVV4RVJUVk5hWGQ0VFVSamMwMVVZek5NUkVWNlRtbDNNRTVwZDNwTVJHTnpUMVJuYzA1cVFYTk5la0Z6VGtSSmMwMXFRVFZNUkVVeVRsTjNlVTFVVlhOTlZGVXdURVJGTUUxNWQzaE9hbGx6VGtSQmMwNXFTWE5OVkVVelRFUlJla3hFU1RKTVJFbDVUbmwzTVU1RGQzaE5lbGx6VG1wVmMwOVVZM05OYVhjMFRubDNlRTE2WTNOT2VsRnpUVlJyZVV4RVdUUk1SRWwzVGtOM2VFOUVaM05OYWxGNlRFUkZkMDVEZDNoTmFrbHpUMVJqYzAxVVl6Tk1SRVY2VFZOM2VFOUVSWE5OVkdNMVRFUm5lRXhFVlhsTVJFVXhUa04zZVU1cGR6Sk1SRlY2VEVSamVFeEVhekZNUkVWNVRVTjNlVTFxV1hOTlZFRjNURVJKZVUxRGQzbE5SR3R6VFZSck1VeEVSVE5OVTNjeFRubDNlRTlFVFhOTmVsbHpUVlJaTlV4RVJUQk9VM2MxVDBOM2VFMUVXWE5OVkdkelRXcEJNa3hFUlRSTlEzZDRUVVJCYzAxVVdUTk1SRmw0VEVSRmQwNTVkekJOVTNkNlRrTjNlVXhFU1RCT2VYZDVUa1JSYzAxVVZYZE1SRVV5VG5sM2VVMUVVWE5OYWtVeVRFUlZOVXhFU1hsT2VYYzBURVJKTWt4RVZUTk1SRVUwVDFOM2VFNUVSWE5OVkdjMFRFUm5Na3hFU1hsT1UzZDRUVlJuYzAxVVJYaE1SRVV6VG5sM2VFOUVTWE5OVkdONFRFUkZOVXhFV1hkTVJFVTBUbmwzZUUxNlRYTk5hbEZ6VFZSWk1FeEVSVEJQUTNkNFQwUnJjMDlFVlhOTlZHTjZURVJGTlUxVGQzbE5WRWx6VFdwUk0weEVTWGROVTNkNFQwUkZjMDU2UlhOUFJHZHpUVlJGZVV4RVJUSlBRM2Q0VFhwRmMwMVVZekJNUkZrelRFUlpNRXhFUlRGUFUzZDVUVVJaYzAxVVVUTk1SRlV3VEVSVk1FeEVSVEJPZVhjMFRtbDNNVTlEZDNsTmFsVnpUV3ByYzAxNlFYTk5WRWwzVEVSSk1FNXBkM2hPYW1OelRucG5jMDU2UlhOTlZGRjVURVJKZVU5RGR6Uk5VM2Q1VFhwbmMwMVVRWHBNUkZsNVRFUkpNRTE1ZDNsT1JFVnpUV3BKTWt4RVJURk5hWGN5VFhsM2VFNXBkelZQUTNkNFRucE5jMDE2WTNOTlZHc3lURVJWZVV4RVZUUk1SRkUxVEVSRk5FMVRkekJPYVhkNFRrUnJjMDFVUVRSTVJFVXdUMU4zTUU5VGR6Tk1SR2Q2VEVSRmVFOURkM2xOYW10elRXcFZNRXhFU1hoT2VYZDRUbXBqYzAxVVdUTk1SRWw1VEVSSk1FNTVkM2hQVkZWelRWUkZlVXhFUlhoT1UzZDVUbFJCYzAxRGQzaE9WR056VFdwVmVFeEVSVE5QUTNkNVRVUnJjMDU2U1hOTlZGVTFURVJGZVU1NWQzaFBSRVZ6VFZSRmVVeEVUWGRNUkdNeFRFUnJjMDFxVFRKTVJFbDVURVJGZVUxcGR6Sk5RM2N4VDBOM2VFeEVSWGxPVTNkNVRXcEJjMDFxVFRGTVJFbDVUbE4zZVUxcVozTk5hbEY2VEVSSk1FNURkM2xOVkZselRWUkpkMHhFUlhkT2VYZDRUbXBCYzAxcVJYbE1SRVY1VGtOM2VVMXFWWE5PZWtWelRWUnJNMHhFVFRSTVJFVXpUVU4zZUUxcVRYTk5WRmswVEVSTk5VeEVUVEJNUkVVeVQxTjNlRTlFVVhOT1ZHZHpUVlJGZVV4RVozZE1SR014VEVSRk5VMURkM2xOUkdOelRWUmplVXhFU1hoTmVYZDVURVJOYzAxVGQzZE1SRVU5SWl3aWFYTnpJam9pYUhSMGNITTZMeTloWTJOdmRXNTBjeTVuYjI5bmJHVXVZMjl0SWl3aWFXRjBJam94TlRBMU5Ea3hOelF5TENKbGVIQWlPakUxTURVME9UVXpOREo5LktHYWp6N0NjamtPUnIxS055TFgwRHFXaVRRM2s3d2Q0NDRsU0RiSFYtRV9adHY0bzhDdVlTTVJQRU12eGtncG5PaDBGd241OWROd2F5LXdqSkFZZWhCVWpCdllQZHgzejMzZDF0Uk5OcTlBUV9NQXJqZGVqQnkxcFpkR1FaY1diRUpMSUtPYXZuNGs2LS1mb0M4OUdkXzI2aU9tV1A1ZE9BcjRRU0tyVlZyRURlNDNnQXZ0Mms5anVpaGFnX1B5U0ROMjZXbVJDTVY4N2lFY3lzS3JfTTlXVExYS3k2NWU5czloNEpQYmdqMzZvSllrX3Bpbmk0YlJ6MERCd0lOLVI5TlAtZmkyT2VlRFptbXd4YzJXdnd1c05yaFJZamxGMmNkMjZwUFhaeTlMWlZPTU1fRERoTVpsMVVMclJvZnVFT1BMVXEtWFZZV3lmUXRMZnBPRkthdyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJiZGhldnVDN0g2eWZySVYxQ1A5b2h3Iiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFUxTERJd01Dd3hNaXc1TkN3eE9ERXNNakU0TERFMk55d3hNVGdzTkRRc05UUXNNemNzTWpNd0xESXlOU3cxT0N3eE9URXNNVFk0TERNMkxETTFMREUxTlN3NU55dzJPU3d5TWpVc01USXlMRGd5TERFek15dzJMREkwTlN3ek15d3pNeXd5TlRRc01UVXlMREU1TWl3eE1EY3NNVGMzTERFek5pdzBOaXd6TERjc09UZ3NOakFzTXpBc05ESXNNakE1TERFMk5Td3lNVFVzTVRVMExERTBNeXd4TmpZc05EQXNOaklzTVRFM0xEUXpMREkyTERJeU55dzFOQ3d4TXpZc05qVXNPVGNzTWl3NE55d3hNemNzTnpRc01Ua3lMRFk0TERJd05Dd3hPRGdzTWpRekxERXdOQ3d4TWpJc09UY3NNVGMzTERFek1Td3hPREVzTVRjNUxEZ3hMRFV5TERFMU5Dd3lOaXcyTERVekxEY3hMRGsxTERFeU1Dd3lNallzTVRBd0xESXlNQ3d5TURrc01UazFMREUzTVN3MU55d3hPRE1zTXpZc01UWTVMREUwTlN3NU9Dd3hNRFlzTVRnc01qQTJMREU0TUN3eE1EQXNNVFkzTERZeExERXdOeXcwTVN3ek5Dd3lMREkwTnl3eU5EUXNNVFV3TERFMk55d3lNRFFzTWpFMkxEVTVMREl5Tnl3NExESTJMRFUzTERFNE9Td3hOREVzTVRnNExEZzJMREl5TlN3eE1UZ3NNVEV4TERFM055d3hPRElzTVRjeExERTVMRFl3TERFNE55d3hNek1zTWpRc01UWTBMREUwT0N3eE9Ea3NPRFVzTVRjekxERTVNU3d5TVRJc01qUTNMREl3TVN3eE9ERXNOekVzT0Rnc01URXlMREUyT0N3eE16RXNNVGMwTERZM0xEWTBMREUxT1N3eU1EWXNNVFEzTERVMExEVTBMREUwTnl3NE5pdzFPQ3d5TWpVc01qa3NNekFzTVRJd0xESTBOaXd4Tmpjc056Z3NOekVzTVRReUxESXlPQ3c0TVN3eU16Z3NNVEF6TERZeUxESTBNeXd5TkRFc01qSTJMREUxTWl3Mk15d3hOaXc1T0N3eE56TXNNemNzTVRrMkxEVXlMRFU0TERRNUxERTRNU3cwTml3eE5Ea3NNVEE0TERFME9TdzBPU3czTERnekxERXhPQ3d5TWprc01qVTBMREl4Tnl3eE5qY3NNVFkzTERJeUxESTBOeXd4T1RVc01URXlMREV4TlN3eU5UQXNNQ3d4TlRjc01qVXhMREUzT0N3eU1Ea3NOeklzTVRVNUxERXlOeXd4T0RFc01URXlMRE13TERjMUxEa3NNak0yTERJeUxERXlNaXcyTUN3MU9Dd3hMREV5TlN3eU1qQXNNak0xTERJeU5Td3lNamdzTWpRekxESTBOQ3d5TVRZc01USXdMREV3Tnl3eE5qQXNNakV5TERFeU5Dd3lNalVzTnpFc01UazNMRE00TERFM01Dd3hNak1zTVRZNExETTVMRE0wTERFMk9Td3hPRFFzTlRnc01URXlMRGd3TERjMUxERTVNQ3d5TURjc01UY3lMREl4TXl3eUxETXNNU3d3TERFPSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE1MDU0OTE3NDIiLCJleHAiOiIxNTA1NDk1MzQyIiwiYWxnIjoiUlMyNTYiLCJraWQiOiI3ZWNiNTRjZTcxZDYxOGIyODMwY2NlYzk5MTg4MThlNzM4MTAwZjJhIn19';

    handlers = handlersPopulate;
    msgNodeResponseFunc = msgNodeResponseFuncPopulate;
    coreDiscovery = coreDiscoveryPopulate;
    storageManager = runtimeFactory.storageManager();
    runtimeCapabilities = runtimeFactory.runtimeCapabilities(storageManager);
  });

  beforeEach('Init structures before each test', function() {
    bus = new MessageBus();
    bus.pipeline.handlers = handlersPopulate;
    bus._onPostMessage = msg => {
      msgNodeResponseFunc(bus, msg);
    };

    let dataObjectsStorage = new DataObjectsStorage(storageManager, {});
    identityModule = new IdentityModule(
      runtimeURL,
      runtimeCapabilities,
      storageManager,
      dataObjectsStorage,
      runtimeFactory
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
    identityModule.deployGUI(runtimeFactory);
    assert(identityModule.guiDeployed, 'IDM is not deployed');
  });

  it('Check Identities to Choose', function() {
    let idsToChoose = identityModule.getIdentitiesToChoose();
    expect(idsToChoose).to.have.property('identities');
    expect(idsToChoose).to.have.property('idps');
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

  it('setCurrentIdentity/getCurrentIdentity', function() {
    identityModule.setCurrentIdentity(exampleIdentityBundle);
    assert.equal(
      exampleIdentityBundle,
      identityModule.getCurrentIdentity(),
      '(SET/GET)CurrentIdentity content is different'
    );
  });

  it('test sendGenerateMessage', function(done) {
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
          assertion_val,
          'Received message is not OK'
        );
      })
      .then(done, done);
  });

  it('test requestIdentityToGUI', function(done) {
    let identities = identityModule.getIdentitiesToChoose().identities;
    let idps = identityModule.getIdentitiesToChoose().idps;

    let that = this;
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
      .then(done, done);
  });

  it('test getIdentities', function(done) {
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
        .then(done, done);
    });
  });

  it('test storeIdentity', function(done) {
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
        .then(done, done);
    });
  });

  it('test getIdentity', function(done) {
    let returnedAssertionValue = returnedAssertionValuePopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .storeIdentity(returnedAssertionValue, keyPair)
        .then(result => {
          let retrivedID = identityModule.getIdentity(userURL);
          assert.equal(
            result.assertion,
            retrivedID.assertion,
            'Retrived ID is not the same'
          );
        })
        .then(done, done);
    });
  });

  it('test unregisterIdentity', function(done) {
    let returnedAssertionValue = returnedAssertionValuePopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .storeIdentity(returnedAssertionValue, keyPair)
        .then(result => {
          assert.equal(identityModule.emailsList, userEmail);
          identityModule.unregisterIdentity(userEmail);
          assert.isEmpty(identityModule.emailsList, 'Identity was not removed');
        })
        .then(done, done);
    });
  });

  it('test deleteIdentity', function(done) {
    let returnedAssertionValue = returnedAssertionValuePopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .storeIdentity(returnedAssertionValue, keyPair)
        .then(result => {
          assert.equal(identityModule.emailsList, userEmail);
          identityModule.deleteIdentity(userURL);
          assert.isEmpty(identityModule.identities, 'Identity was not removed');
        })
        .then(done, done);
    });
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
      .then(done, done);
  });

  it('test generateAssertion', function(done) {
    crypto.generateRSAKeyPair().then(keyPair => {
      let contents = btoa(keyPair.public);
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
        .generateAssertion(contents, origin, loginUrl, keyPair, idpDomain)
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
        .then(done, done);
    });
  });

  it('test callGenerateMethods', function(done) {
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
      .then(done, done);
  });

  it('test validateAssertion', function(done) {
    identityModule
      .validateAssertion(assertion_val, undefined, idpDomain)
      .then(result => {
        assert.equal(
          result.contents,
          validateAssertionValuePopulate.contents,
          'Received data is not the expected'
        );
      })
      .then(done, done);
  });

  it('test loginSelectedIdentity', function(done) {
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .loginSelectedIdentity(
          assertion_val,
          hyperURL1,
          idpDomain,
          keyPair,
          loginUrl
        )
        .then(result => {
          assert.equal(result, 'Login was successfull', 'Login failed');
        })
        .then(done, done);
    });
  });

  it('test generateSelectedIdentity', function(done) {
    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .generateSelectedIdentity(
          assertion_val,
          hyperURL1,
          idpDomain,
          keyPair,
          loginUrl
        )
        .then(result => {
          assert(
            result.hasOwnProperty('assertion'),
            'Result does not have the required fields'
          );
        })
        .then(done, done);
    });
  });

  it('test selectIdentityFromGUI', function(done) {
    identityModule
      .selectIdentityFromGUI(undefined)
      .then(result => {
        assert(
          result.hasOwnProperty('userProfile'),
          'result does not have the required fields'
        );
      })
      .then(done, done);
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

  it('test encryptDataObject/decryptDataObject', function(done) {
    let sender = 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a';
    let sessionKey = crypto.generateRandom();
    let dataObjectSessionKeys = {};
    dataObjectSessionKeys[sender] = {
      sessionKey: sessionKey,
      isToEncrypt: true
    };
    storageManager.set('dataObjectSessionKeys', 0, dataObjectSessionKeys);

    identityModule
      .encryptDataObject(dataObjectPopulate, sender)
      .then(encryDataObject => {
        log('GUA GUA');
        identityModule
          .decryptDataObject(encryDataObject, sender)
          .then(decryDataObject => {
            let value =
              decryDataObject.value.data.content ===
                dataObjectPopulate.data.content &&
              encryDataObject.hasOwnProperty('value') &&
              encryDataObject.hasOwnProperty('iv');
            assert(value, 'Decrypted data is not the same');
          })
          .then(done);
      });
  });

  it('test getIdentityAssertion', function(done) {
    identityModule.runtimeCapabilities.isAvailable = runtimeCapabilitiesPopulate;
    identityModule
      .getIdentityAssertion(undefined)
      .then(result => {
        assert(
          result.hasOwnProperty('userProfile'),
          'Result does not contain the expected fields'
        );
      })
      .then(done, done);
  });

  it('test getIdToken', function(done) {
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
            .then(done, done);
        });
    });
  });

  it('test _getValidToken', function(done) {
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
            .then(done, done);
        });
    });
  });

  it('test getToken', function(done) {
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
            .then(done, done);
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

  it('test _filterMessageToHash', function() {
    let message = messageToBeHashedPopulate;
    let decryptedValue = 'decryptedValue';
    let identity = hyperURL1;
    let receivedHash = identityModule._filterMessageToHash(
      message,
      decryptedValue,
      identity
    );

    let valueVerificationResult =
      receivedHash.type === messageToBeHashedPopulate.type &&
      receivedHash.from === messageToBeHashedPopulate.from &&
      receivedHash.to === messageToBeHashedPopulate.to &&
      receivedHash.body.identity ===
        (identity || messageToBeHashedPopulate.body.identity) &&
      receivedHash.body.value ===
        (decryptedValue || messageToBeHashedPopulate.body.value) &&
      receivedHash.body.handshakePhase ===
        messageToBeHashedPopulate.body.handshakePhase;
    assert(valueVerificationResult, 'Received message is not the expected');
  });

  it('test _newChatCrypto', function(done) {
    let message = messageForNewChatCrypto;
    let receiver = false;

    crypto.generateRSAKeyPair().then(keyPair => {
      identityModule
        .storeIdentity(returnedAssertionValuePopulate, keyPair)
        .then(result => {
          let newChatCrypto = identityModule._newChatCrypto(
            message,
            userURL,
            receiver
          );
          let valueVerificationResult =
            newChatCrypto.hypertyFrom.userID === userEmail &&
            newChatCrypto.hypertyFrom.messageInfo.assertion ===
              returnedAssertionValuePopulate.assertion &&
            newChatCrypto.callback === messageForNewChatCrypto.callback &&
            newChatCrypto.dataObjectURL === message.dataObjectURL;

          assert(
            valueVerificationResult,
            'Generated chat crypto messege is not the expected one'
          );
        })
        .then(done, done);
    });
  });

  it('test _sendReporterSessionKey', function(done) {
    let message = { from: hyperURL1, to: hyperURL2 };
    let chatKeys = {
      dataObjectURL: 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a',
      hypertyFrom: { messageInfo: 'messageInfo' },
      keys: {
        hypertyFromSessionKey: crypto.generateRandom(),
        hypertyFromHashKey: crypto.generateRandom()
      }
    };

    identityModule
      ._sendReporterSessionKey(message, chatKeys)
      .then(result => {
        let assertFields =
          result.hasOwnProperty('message') &&
          result.message.type === 'handshake' &&
          result.message.to === hyperURL1 &&
          result.message.from === hyperURL2 &&
          result.message.body.hasOwnProperty('handshakePhase') &&
          result.message.body.hasOwnProperty('value') &&
          result.hasOwnProperty('chatKeys') &&
          result.chatKeys.hasOwnProperty('hypertyFrom') &&
          result.chatKeys.hasOwnProperty('keys') &&
          result.chatKeys.keys.hasOwnProperty('hypertyFromHashKey');

        assert(assertFields, 'Result has not the required fields or values');
      })
      .then(done, done);
  });

  //test isFromHyperty to isToHyperty communication -> handshake + update //TODO incomplete cases
  it.skip('test encryptMessage - startHandShake and update', function(done) {
    let returnedAssertionValue = returnedAssertionValuePopulate;
    let chatKeys = chatKeysPopulate;
    let helloMessage = messageForNewChatCrypto;
    let keyPair = {
      public: chatKeysPopulate.hypertyFrom.publicKey,
      private: chatKeysPopulate.hypertyFrom.privateKey
    };
    let encryptMessage = encryptMessagePopulate;

    chatKeys.keys.hypertyFromSessionKey = crypto.generateRandom();
    chatKeys.keys.hypertyFromHashKey = crypto.generateRandom();
    chatKeys.keys.hypertyToSessionKey = chatKeys.keys.hypertyFromSessionKey;
    chatKeys.keys.hypertyToHashKey = chatKeys.keys.hypertyFromHashKey;
    identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
    identityModule.chatKeys[
      encryptMessagePopulate.from + '<->' + encryptMessagePopulate.to
    ] = chatKeys;
    identityModule.chatKeys[
      encryptMessagePopulate.to + '<->' + encryptMessagePopulate.from
    ] = chatKeys;

    log('WTF');
    log(encryptMessagePopulate.type);

    identityModule
      .storeIdentity(returnedAssertionValuePopulate, keyPair)
      .then(result1 => {
        helloMessage.body.handshakePhase = 'startHandShake';

        identityModule
          ._doHandShakePhase(helloMessage, chatKeys)
          .then(result2 => {
            identityModule
              .encryptMessage(encryptMessagePopulate)
              .then(resolvedMessage => {
                assert.equal(
                  encryptMessagePopulate,
                  resolvedMessage,
                  'Messages should be the same'
                );
                encryptMessagePopulate.type = 'update';

                identityModule
                  .encryptMessage(encryptMessagePopulate)
                  .then(updateMessage => {
                    assert.equal(
                      encryptMessagePopulate,
                      updateMessage,
                      'Messages should be the same'
                    );
                    encryptMessagePopulate.type = 'encrypt'; //Don't know the correct keyword but this works for now

                    identityModule
                      .encryptMessage(encryptMessagePopulate)
                      .then(encryptedMessage => {
                        identityModule
                          .decryptMessage(encryptedMessage)
                          .then(decryptedMessage => {
                            assert.equal(
                              decryptedMessage.body.value,
                              encryptMessagePopulate.body.value,
                              'Encryption failed'
                            );
                          })
                          .then(done, done);
                      });
                  });
              });
          });
      });
    encryptMessagePopulate.type = 'handshake';
  });

  it('test _doHandShakePhase - startHandShake', function(done) {
    let message = messageForNewChatCrypto;
    message.body.handshakePhase = 'startHandShake';
    let chatKeys = chatKeysPopulate;
    identityModule
      ._doHandShakePhase(message, chatKeys)
      .then(result => {
        let assertFields =
          result.message.type === 'handshake' &&
          result.message.body.handshakePhase === 'senderHello' &&
          result.hasOwnProperty('chatKeys') &&
          result.message.type === 'handshake';
        assert(assertFields, 'Result has not the expected values');
      })
      .then(done, done);
  });

  it('test _doHandShakePhase - senderHello', function(done) {
    let message = senderHelloMessagePopulate;
    let chatKeys = chatKeysPopulate;
    identityModule
      ._doHandShakePhase(message, chatKeys)
      .then(resultMessage => {
        let assertFields =
          resultMessage.message.type === 'handshake' &&
          resultMessage.message.body.handshakePhase === 'receiverHello' &&
          resultMessage.hasOwnProperty('chatKeys') &&
          resultMessage.hasOwnProperty('message');
        assert(assertFields, 'Result has not the expected values');
      })
      .then(done, done);
  });

  it('test _doHandShakePhase - receiverHello', function(done) {
    let message = receiverHelloMessagePopulate;
    //let cloneOfA = JSON.parse(JSON.stringify(object));
    let chatKeys = chatKeysPopulate;
    crypto.generateRSAKeyPair().then(keyPair => {
      chatKeys.hypertyFrom.privateKey = keyPair.private;
      chatKeys.hypertyFrom.publicKey = keyPair.public;
      identityModule
        ._doHandShakePhase(message, chatKeys)
        .then(resultMessage => {
          let assertFields =
            resultMessage.message.type === 'handshake' &&
            resultMessage.message.body.handshakePhase === 'senderCertificate' &&
            resultMessage.hasOwnProperty('chatKeys') &&
            resultMessage.hasOwnProperty('message');
          assert(assertFields, 'Result has not the expected values');
        })
        .then(done, done);
    });
  });

  it('test _doHandShakePhase - senderCertificate', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = senderCertificateMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    crypto.generateRSAKeyPair().then(keyPair => {
      chatKeys.hypertyFrom.privateKey = keyPair.private;
      chatKeys.hypertyFrom.publicKey = keyPair.public;
      let pms = crypto.generatePMS();
      chatKeys.keys.premasterKey = new Uint8Array(pms);

      crypto
        .encryptRSA(chatKeys.hypertyFrom.publicKey, pms)
        .then(encryptedVal => {
          receivedValue.assymetricEncryption = crypto.encode(encryptedVal);
          let messageHash = identityModule._filterMessageToHash(
            message,
            chatKeys.keys.premasterKey
          );
          let messageToBeSigned =
            JSON.stringify(chatKeys.handshakeHistory) +
            JSON.stringify(messageHash);
          let concatKey = crypto.concatPMSwithRandoms(
            chatKeys.keys.premasterKey,
            chatKeys.keys.toRandom,
            chatKeys.keys.fromRandom
          );

          crypto
            .generateMasterSecret(
              concatKey,
              'messageHistoric' +
                chatKeys.keys.toRandom +
                chatKeys.keys.fromRandom
            )
            .then(masterKey => {
              crypto
                .generateKeys(
                  masterKey,
                  'key expansion' +
                    chatKeys.keys.toRandom +
                    chatKeys.keys.fromRandom
                )
                .then(keys => {
                  crypto
                    .encryptAES(keys[1], 'ok', receivedValue.iv)
                    .then(aesEncryption => {
                      receivedValue.symetricEncryption = crypto.encode(
                        aesEncryption
                      );

                      crypto
                        .signRSA(
                          chatKeys.hypertyFrom.privateKey,
                          messageToBeSigned
                        )
                        .then(signature => {
                          receivedValue.signature = crypto.encode(signature);

                          let filteredMessage = identityModule._filterMessageToHash(
                            message,
                            'ok' + receivedValue.iv
                          );
                          crypto
                            .hashHMAC(keys[3], filteredMessage)
                            .then(HMAC => {
                              receivedValue.hash = crypto.encode(HMAC);

                              receivedValue.iv = crypto.encode(
                                receivedValue.iv
                              );
                              message.body.value = btoa(
                                JSON.stringify(receivedValue)
                              );
                              identityModule
                                ._doHandShakePhase(message, chatKeys)
                                .then(resultMessage => {
                                  let assertFields =
                                    resultMessage.chatKeys.hypertyFrom
                                      .userID === userEmail &&
                                    resultMessage.message.body
                                      .handshakePhase ===
                                      'receiverFinishedMessage' &&
                                    resultMessage.hasOwnProperty('chatKeys') &&
                                    resultMessage.hasOwnProperty('message');
                                  assert(
                                    assertFields,
                                    'Result has not the expected values'
                                  );
                                })
                                .then(done, done);
                            });
                        });
                    });
                });
            });
        });
    });
  });

  it('test _doHandShakePhase - receiverFinishedMessage', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = receiverFinishedMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    let pms = crypto.generatePMS();
    chatKeys.keys.premasterKey = new Uint8Array(pms);
    let concatKey = crypto.concatPMSwithRandoms(
      chatKeys.keys.premasterKey,
      chatKeys.keys.toRandom,
      chatKeys.keys.fromRandom
    );

    crypto
      .generateMasterSecret(
        concatKey,
        'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom
      )
      .then(masterKey => {
        crypto
          .generateKeys(
            masterKey,
            'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom
          )
          .then(keys => {
            chatKeys.keys.hypertyToSessionKey = keys[1];
            crypto
              .encryptAES(keys[1], 'ok', receivedValue.iv)
              .then(aesEncryption => {
                receivedValue.value = crypto.encode(aesEncryption);

                let filteredMessage = identityModule._filterMessageToHash(
                  message,
                  'ok' + receivedValue.iv
                );
                crypto.hashHMAC(keys[3], filteredMessage).then(HMAC => {
                  chatKeys.keys.hypertyToHashKey = keys[3];
                  receivedValue.hash = crypto.encode(HMAC);
                  receivedValue.iv = crypto.encode(receivedValue.iv);
                  message.body.value = btoa(JSON.stringify(receivedValue));

                  identityModule
                    ._doHandShakePhase(message, chatKeys)
                    .then(resultMessage => {
                      let assertFields =
                        resultMessage.chatKeys.hypertyFrom.userID ===
                          userEmail &&
                        resultMessage.message.type === 'create' &&
                        resultMessage.message.body.value ===
                          chatKeysPopulate.initialMessage.body.value &&
                        resultMessage.hasOwnProperty('chatKeys') &&
                        resultMessage.hasOwnProperty('message');
                      assert(
                        assertFields,
                        'Result has not the expected values'
                      );
                    })
                    .then(done, done);
                });
              });
          });
      });
  });

  it.skip('test _doHandShakePhase - reporterSessionKey', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = reporterSessionKeyMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    let pms = crypto.generatePMS();
    chatKeys.keys.premasterKey = new Uint8Array(pms);
    let concatKey = crypto.concatPMSwithRandoms(
      chatKeys.keys.premasterKey,
      chatKeys.keys.toRandom,
      chatKeys.keys.fromRandom
    );

    crypto
      .generateMasterSecret(
        concatKey,
        'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom
      )
      .then(masterKey => {
        crypto
          .generateKeys(
            masterKey,
            'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom
          )
          .then(keys => {
            chatKeys.keys.hypertyToSessionKey = keys[1];
            chatKeys.keys.hypertyFromSessionKey = keys[1];
            chatKeys.keys.hypertyFromHashKey = keys[1];

            let sessionKey = crypto.encode(keys[1]);
            //      let dataObjectURL = crypto.encode(dataObjectURL);
            let dataToEncrypt = JSON.stringify({
              value: sessionKey,
              dataObjectURL: chatKeys.dataObjectURL
            });
            crypto
              .encryptAES(keys[1], dataToEncrypt, receivedValue.iv)
              .then(aesEncryption => {
                receivedValue.value = crypto.encode(aesEncryption);

                let filteredMessage = identityModule._filterMessageToHash(
                  message,
                  'ok' + receivedValue.iv
                );
                crypto.hashHMAC(keys[3], filteredMessage).then(HMAC => {
                  chatKeys.keys.hypertyToHashKey = keys[3];
                  receivedValue.hash = crypto.encode(HMAC);
                  receivedValue.iv = crypto.encode(receivedValue.iv);
                  message.body.value = btoa(JSON.stringify(receivedValue));

                  identityModule
                    ._doHandShakePhase(message, chatKeys)
                    .then(resultMessage => {
                      let assertFields =
                        resultMessage.chatKeys.hypertyFrom.userID ===
                          userEmail &&
                        resultMessage.message.type === 'handshake' &&
                        resultMessage.message.body.handshakePhase ===
                          'receiverAcknowledge' &&
                        resultMessage.hasOwnProperty('chatKeys') &&
                        resultMessage.hasOwnProperty('message');
                      assert(
                        assertFields,
                        'Result has not the expected values'
                      );
                    })
                    .then(done, done);
                });
              });
          });
      });
  });

  it.skip('test _doHandShakePhase - reporterSessionKey', function(done) {
    let chatKeys = chatKeysPopulate;
    let message = receiverAcknowledgeMessagePopulate;
    let receivedValue = JSON.parse(atob(message.body.value));

    receivedValue.iv = crypto.generateIV();
    chatKeys.keys.toRandom = crypto.generateRandom();
    chatKeys.keys.fromRandom = crypto.generateRandom();

    let pms = crypto.generatePMS();
    chatKeys.keys.premasterKey = new Uint8Array(pms);
    let concatKey = crypto.concatPMSwithRandoms(
      chatKeys.keys.premasterKey,
      chatKeys.keys.toRandom,
      chatKeys.keys.fromRandom
    );

    crypto
      .generateMasterSecret(
        concatKey,
        'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom
      )
      .then(masterKey => {
        crypto
          .generateKeys(
            masterKey,
            'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom
          )
          .then(keys => {
            chatKeys.keys.hypertyToSessionKey = keys[1];
            chatKeys.keys.hypertyFromSessionKey = keys[1];
            chatKeys.keys.hypertyFromHashKey = keys[1];

            let sessionKey = crypto.encode(keys[1]);
            //      let dataObjectURL = crypto.encode(dataObjectURL);
            let dataToEncrypt = JSON.stringify({
              value: sessionKey,
              dataObjectURL: chatKeys.dataObjectURL
            });
            crypto
              .encryptAES(keys[1], dataToEncrypt, receivedValue.iv)
              .then(aesEncryption => {
                receivedValue.value = crypto.encode(aesEncryption);

                let filteredMessage = identityModule._filterMessageToHash(
                  message,
                  'ok' + receivedValue.iv
                );
                crypto.hashHMAC(keys[3], filteredMessage).then(HMAC => {
                  chatKeys.keys.hypertyToHashKey = keys[3];
                  receivedValue.hash = crypto.encode(HMAC);
                  receivedValue.iv = crypto.encode(receivedValue.iv);
                  message.body.value = btoa(JSON.stringify(receivedValue));

                  identityModule
                    ._doHandShakePhase(message, chatKeys)
                    .then(resultMessage => {
                      assert.equal(
                        resultMessage,
                        'handShakeEnd',
                        'Result has not the expected values'
                      );
                    })
                    .then(done, done);
                });
              });
          });
      });
  });

  it('test doMutualAuthentication', function(done) {
    let sender = hyperURL1;
    let receiver = hyperURL2;

    identityModule.registry.getReporterURLSynchonous = sender => {
      return undefined;
    };
    identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
    let chatKeys = chatKeysPopulate;
    chatKeys.keys.hypertyFromSessionKey = crypto.generateRandom();
    chatKeys.keys.hypertyFromHashKey = crypto.generateRandom();
    dataObjectURL: 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a',
      (identityModule.chatKeys[sender + '<->' + receiver] = chatKeys);

    identityModule
      .doMutualAuthentication(sender, receiver)
      .then(resultMessage => {
        assert.equal(
          resultMessage,
          'exchange of chat sessionKey initiated',
          'Message is not the expected one'
        );
      })
      .then(done, done);
  });
});

let msgNodeResponseFuncPopulate = (bus, msg) => {
  if (msg.type === 'subscribe') {
    log('msgNodeResponse subscribe: ' + msg);
    if (msg.id === 2) {
      //reporter subscribe
      expect(msg).to.contain.all.keys({
        id: 2,
        type: 'subscribe',
        from: 'hyperty-runtime://fake-runtime/sm',
        to: 'domain://msg-node.h1.domain/sm',
        body: {
          resources: [
            objURL + '/children/children1',
            objURL + '/children/children2'
          ],
          source: hyperURL1
        }
      });
    } else {
      //observer subscribe
      expect(msg).to.contain.all.keys({
        id: 5,
        type: 'subscribe',
        from: 'hyperty-runtime://fake-runtime/sm',
        to: 'domain://msg-node.obj1/sm',
        body: {
          resources: [
            objURL + '/changes',
            objURL + '/children/children1',
            objURL + '/children/children2'
          ],
          source: hyperURL2
        }
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
      //			if(msg.body.params.usernameHint == ''){
      //				log('msgNodeResponseFunc loginUrl');
      //				resMsg.body.value = {loginUrl: loginUrl};
      //			}else{
      log('msgNodeResponseFunc assertion_val');
      resMsg.body.value = returnedAssertionValuePopulate;
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
    let splitURL = dataObjectURL.split.skip('://');
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

let catalogPopulate = {
  getDataSchemaDescriptor: schema => {
    log('REQUEST-SCHEMA: ', schema);
    return new Promise((resolve, reject) => {
      if (schema) {
        resolve({
          sourcePackage: {
            sourceCode: {
              properties: {
                scheme: { constant: 'resource' },
                children: { constant: ['children1', 'children2'] }
              }
            }
          }
        });
      } else {
        reject('No schema provided');
      }
    });
  }
};

let handlersPopulate = [
  function(ctx) {
    policyEngine
      .authorise(ctx.msg)
      .then(function(changedMgs) {
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

let exampleIdentityBundle = {
  assertion: 'assertion',
  idp: 'nodejs',
  identity: 'user://nodejs.com/nodejsUser@nodejs.com',
  messageInfo: {
    assertion: 'assertion',
    idp: 'nodejs',
    userProfile: 'userProfile'
  },
  userProfile: 'userProfile'
};

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

let sendGenerateMessageResponse = {
  assertion:
    'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqZGxZMkkxTkdObE56RmtOakU0WWpJNE16QmpZMlZqT1RreE9EZ3hPR1UzTXpneE1EQm1NbUVpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SW1Ka2FHVjJkVU0zU0RaNVpuSkpWakZEVURsdmFIY2lMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVZURk1SRWwzVFVOM2VFMXBkelZPUTNkNFQwUkZjMDFxUlRSTVJFVXlUbmwzZUUxVVozTk9SRkZ6VGxSUmMwMTZZM05OYWsxM1RFUkplVTVUZHpGUFEzZDRUMVJGYzAxVVdUUk1SRTB5VEVSTk1VeEVSVEZPVTNjMVRubDNNazlUZDNsTmFsVnpUVlJKZVV4RVozbE1SRVY2VFhsM01reEVTVEJPVTNkNlRYbDNlazE1ZDNsT1ZGRnpUVlJWZVV4RVJUVk5hWGQ0VFVSamMwMVVZek5NUkVWNlRtbDNNRTVwZDNwTVJHTnpUMVJuYzA1cVFYTk5la0Z6VGtSSmMwMXFRVFZNUkVVeVRsTjNlVTFVVlhOTlZGVXdURVJGTUUxNWQzaE9hbGx6VGtSQmMwNXFTWE5OVkVVelRFUlJla3hFU1RKTVJFbDVUbmwzTVU1RGQzaE5lbGx6VG1wVmMwOVVZM05OYVhjMFRubDNlRTE2WTNOT2VsRnpUVlJyZVV4RVdUUk1SRWwzVGtOM2VFOUVaM05OYWxGNlRFUkZkMDVEZDNoTmFrbHpUMVJqYzAxVVl6Tk1SRVY2VFZOM2VFOUVSWE5OVkdNMVRFUm5lRXhFVlhsTVJFVXhUa04zZVU1cGR6Sk1SRlY2VEVSamVFeEVhekZNUkVWNVRVTjNlVTFxV1hOTlZFRjNURVJKZVUxRGQzbE5SR3R6VFZSck1VeEVSVE5OVTNjeFRubDNlRTlFVFhOTmVsbHpUVlJaTlV4RVJUQk9VM2MxVDBOM2VFMUVXWE5OVkdkelRXcEJNa3hFUlRSTlEzZDRUVVJCYzAxVVdUTk1SRmw0VEVSRmQwNTVkekJOVTNkNlRrTjNlVXhFU1RCT2VYZDVUa1JSYzAxVVZYZE1SRVV5VG5sM2VVMUVVWE5OYWtVeVRFUlZOVXhFU1hsT2VYYzBURVJKTWt4RVZUTk1SRVUwVDFOM2VFNUVSWE5OVkdjMFRFUm5Na3hFU1hsT1UzZDRUVlJuYzAxVVJYaE1SRVV6VG5sM2VFOUVTWE5OVkdONFRFUkZOVXhFV1hkTVJFVTBUbmwzZUUxNlRYTk5hbEZ6VFZSWk1FeEVSVEJQUTNkNFQwUnJjMDlFVlhOTlZHTjZURVJGTlUxVGQzbE5WRWx6VFdwUk0weEVTWGROVTNkNFQwUkZjMDU2UlhOUFJHZHpUVlJGZVV4RVJUSlBRM2Q0VFhwRmMwMVVZekJNUkZrelRFUlpNRXhFUlRGUFUzZDVUVVJaYzAxVVVUTk1SRlV3VEVSVk1FeEVSVEJPZVhjMFRtbDNNVTlEZDNsTmFsVnpUV3ByYzAxNlFYTk5WRWwzVEVSSk1FNXBkM2hPYW1OelRucG5jMDU2UlhOTlZGRjVURVJKZVU5RGR6Uk5VM2Q1VFhwbmMwMVVRWHBNUkZsNVRFUkpNRTE1ZDNsT1JFVnpUV3BKTWt4RVJURk5hWGN5VFhsM2VFNXBkelZQUTNkNFRucE5jMDE2WTNOTlZHc3lURVJWZVV4RVZUUk1SRkUxVEVSRk5FMVRkekJPYVhkNFRrUnJjMDFVUVRSTVJFVXdUMU4zTUU5VGR6Tk1SR2Q2VEVSRmVFOURkM2xOYW10elRXcFZNRXhFU1hoT2VYZDRUbXBqYzAxVVdUTk1SRWw1VEVSSk1FNTVkM2hQVkZWelRWUkZlVXhFUlhoT1UzZDVUbFJCYzAxRGQzaE9WR056VFdwVmVFeEVSVE5QUTNkNVRVUnJjMDU2U1hOTlZGVTFURVJGZVU1NWQzaFBSRVZ6VFZSRmVVeEVUWGRNUkdNeFRFUnJjMDFxVFRKTVJFbDVURVJGZVUxcGR6Sk5RM2N4VDBOM2VFeEVSWGxPVTNkNVRXcEJjMDFxVFRGTVJFbDVUbE4zZVUxcVozTk5hbEY2VEVSSk1FNURkM2xOVkZselRWUkpkMHhFUlhkT2VYZDRUbXBCYzAxcVJYbE1SRVY1VGtOM2VVMXFWWE5PZWtWelRWUnJNMHhFVFRSTVJFVXpUVU4zZUUxcVRYTk5WRmswVEVSTk5VeEVUVEJNUkVVeVQxTjNlRTlFVVhOT1ZHZHpUVlJGZVV4RVozZE1SR014VEVSRk5VMURkM2xOUkdOelRWUmplVXhFU1hoTmVYZDVURVJOYzAxVGQzZE1SRVU5SWl3aWFYTnpJam9pYUhSMGNITTZMeTloWTJOdmRXNTBjeTVuYjI5bmJHVXVZMjl0SWl3aWFXRjBJam94TlRBMU5Ea3hOelF5TENKbGVIQWlPakUxTURVME9UVXpOREo5LktHYWp6N0NjamtPUnIxS055TFgwRHFXaVRRM2s3d2Q0NDRsU0RiSFYtRV9adHY0bzhDdVlTTVJQRU12eGtncG5PaDBGd241OWROd2F5LXdqSkFZZWhCVWpCdllQZHgzejMzZDF0Uk5OcTlBUV9NQXJqZGVqQnkxcFpkR1FaY1diRUpMSUtPYXZuNGs2LS1mb0M4OUdkXzI2aU9tV1A1ZE9BcjRRU0tyVlZyRURlNDNnQXZ0Mms5anVpaGFnX1B5U0ROMjZXbVJDTVY4N2lFY3lzS3JfTTlXVExYS3k2NWU5czloNEpQYmdqMzZvSllrX3Bpbmk0YlJ6MERCd0lOLVI5TlAtZmkyT2VlRFptbXd4YzJXdnd1c05yaFJZamxGMmNkMjZwUFhaeTlMWlZPTU1fRERoTVpsMVVMclJvZnVFT1BMVXEtWFZZV3lmUXRMZnBPRkthdyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJiZGhldnVDN0g2eWZySVYxQ1A5b2h3Iiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFUxTERJd01Dd3hNaXc1TkN3eE9ERXNNakU0TERFMk55d3hNVGdzTkRRc05UUXNNemNzTWpNd0xESXlOU3cxT0N3eE9URXNNVFk0TERNMkxETTFMREUxTlN3NU55dzJPU3d5TWpVc01USXlMRGd5TERFek15dzJMREkwTlN3ek15d3pNeXd5TlRRc01UVXlMREU1TWl3eE1EY3NNVGMzTERFek5pdzBOaXd6TERjc09UZ3NOakFzTXpBc05ESXNNakE1TERFMk5Td3lNVFVzTVRVMExERTBNeXd4TmpZc05EQXNOaklzTVRFM0xEUXpMREkyTERJeU55dzFOQ3d4TXpZc05qVXNPVGNzTWl3NE55d3hNemNzTnpRc01Ua3lMRFk0TERJd05Dd3hPRGdzTWpRekxERXdOQ3d4TWpJc09UY3NNVGMzTERFek1Td3hPREVzTVRjNUxEZ3hMRFV5TERFMU5Dd3lOaXcyTERVekxEY3hMRGsxTERFeU1Dd3lNallzTVRBd0xESXlNQ3d5TURrc01UazFMREUzTVN3MU55d3hPRE1zTXpZc01UWTVMREUwTlN3NU9Dd3hNRFlzTVRnc01qQTJMREU0TUN3eE1EQXNNVFkzTERZeExERXdOeXcwTVN3ek5Dd3lMREkwTnl3eU5EUXNNVFV3TERFMk55d3lNRFFzTWpFMkxEVTVMREl5Tnl3NExESTJMRFUzTERFNE9Td3hOREVzTVRnNExEZzJMREl5TlN3eE1UZ3NNVEV4TERFM055d3hPRElzTVRjeExERTVMRFl3TERFNE55d3hNek1zTWpRc01UWTBMREUwT0N3eE9Ea3NPRFVzTVRjekxERTVNU3d5TVRJc01qUTNMREl3TVN3eE9ERXNOekVzT0Rnc01URXlMREUyT0N3eE16RXNNVGMwTERZM0xEWTBMREUxT1N3eU1EWXNNVFEzTERVMExEVTBMREUwTnl3NE5pdzFPQ3d5TWpVc01qa3NNekFzTVRJd0xESTBOaXd4Tmpjc056Z3NOekVzTVRReUxESXlPQ3c0TVN3eU16Z3NNVEF6TERZeUxESTBNeXd5TkRFc01qSTJMREUxTWl3Mk15d3hOaXc1T0N3eE56TXNNemNzTVRrMkxEVXlMRFU0TERRNUxERTRNU3cwTml3eE5Ea3NNVEE0TERFME9TdzBPU3czTERnekxERXhPQ3d5TWprc01qVTBMREl4Tnl3eE5qY3NNVFkzTERJeUxESTBOeXd4T1RVc01URXlMREV4TlN3eU5UQXNNQ3d4TlRjc01qVXhMREUzT0N3eU1Ea3NOeklzTVRVNUxERXlOeXd4T0RFc01URXlMRE13TERjMUxEa3NNak0yTERJeUxERXlNaXcyTUN3MU9Dd3hMREV5TlN3eU1qQXNNak0xTERJeU5Td3lNamdzTWpRekxESTBOQ3d5TVRZc01USXdMREV3Tnl3eE5qQXNNakV5TERFeU5Dd3lNalVzTnpFc01UazNMRE00TERFM01Dd3hNak1zTVRZNExETTVMRE0wTERFMk9Td3hPRFFzTlRnc01URXlMRGd3TERjMUxERTVNQ3d5TURjc01UY3lMREl4TXl3eUxETXNNU3d3TERFPSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE1MDU0OTE3NDIiLCJleHAiOiIxNTA1NDk1MzQyIiwiYWxnIjoiUlMyNTYiLCJraWQiOiI3ZWNiNTRjZTcxZDYxOGIyODMwY2NlYzk5MTg4MThlNzM4MTAwZjJhIn19',
  idp: { domain: 'google.com', protocol: 'OIDC' },
  info: {
    accessToken:
      'ya29.GlvSBDbUICOGwVGCW4IJz1wS3e5HBDW9sXnuGFgWPKHPHsU6zFIbNL8Z31CoCd93gav7cKQ8axhIASk1DdsA1MCxABFnJDTz1aXLmdyGFtLa9bO9JTNLv2DLawdr',
    idToken:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNiMGZjMTE5NjJhZDE2ZTQ5ZDU1YTI2ODE2YzVhZDBkM2Y2YjhhODMifQ.eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NTkxMDUyOTU3NjE2ODc4ODkiLCJlbWFpbCI6InRlc3RhbmR0aGluazEyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImtnNkpEdTJyMDRpNVZHSlBkSWlnUFEiLCJub25jZSI6Ik5EZ3NNVE13TERFc016UXNORGdzTVRNc05pdzVMRFF5TERFek5DdzNNaXd4TXpRc01qUTNMREV6TERFc01Td3hMRFVzTUN3ekxERXpNQ3d4TERFMUxEQXNORGdzTVRNd0xERXNNVEFzTWl3eE16QXNNU3d4TERBc01UY3lMREU1TkN3eU16Y3NNakV5TERFek5DdzROU3d5TWpFc01qRXlMREV4Tnl3eE16TXNNVGN3TERnMExESXdOaXcyT1N3eE5ERXNNemNzTWpVMExESXhOaXd4Tmprc016RXNOak1zT1RFc01URTFMREV6T1N3MU1pd3lNVFlzTWpJNUxESXlOaXd4TXl3NU9Td3hOamNzTVRnMUxERXlNQ3d5TVRNc01USXlMREl5Tml3eU1UQXNNVEUwTERJME1Td3hOak1zTVRBMkxERXhNQ3d5TXpjc05ETXNNak16TERreExESTFNQ3d5TWpNc01qSTFMREV3Tml3NE1pd3hOVFVzTlN3eU16WXNNVGsyTERFMU1Dd3lNakVzTVRjc01USTRMREl6TERFNE5Dd3hNekVzT1RRc01Ua3dMRFU0TERJME9Td3hOemdzTVRBM0xERTVNaXd6TlN3NE5Td3hPRE1zTWpFeUxESTBPU3d5TkRFc01qUTJMRFV3TERBc016Y3NNVEkyTERFeE1pd3hOaXd5TXpBc01qRXlMREl6TERFek9Td3hPVGdzTnpRc01qRTRMREUxTXl3eE56Z3NNVFF3TERReExERTROaXd5TXpJc05qUXNNakk1TERRc01qSXhMRFkxTERFMExERTRNQ3d6TlN3eE16VXNOamtzTVRNc01qTXhMREk0TERJeE1DdzFNeXd4TVRnc01UWTRMREUyTVN3ek9DdzBNaXd4TkRjc01UUTFMRGcyTERJd055d3lOQ3c1TUN3eU1qWXNNVFVzTWpBNUxEZzVMREU0TXl3eE1EY3NNVFkwTERFMUxESXdNaXd5TkRJc056SXNNVGd4TERJeU5Td3lOVEFzTVRJeUxERTFPQ3c1TUN3eE5qa3NNak0xTERFek5DdzBOQ3d4TWl3MU1Td3lORFVzTVRRd0xEa3lMRGMxTERFeU9TdzNPU3d5TXpBc01qTTNMREUyTVN3eE9UTXNNVFF5TERFMU1pdzVMREl5TVN3ME1pd3hOelFzT1Rjc01qQTVMREV4Tnl3eE9UTXNNVElzT1RNc01UWXhMREl4Tnl3eU5ERXNNVGs0TERFd09Dd3hPRFlzTWprc01Ua3pMREV5TVN3NE15d3hNRGtzTWpJMkxERTVNeXd4TlRBc01UZ3pMRE0wTERFNUxEazFMREV4TWl3M05Dd3lNekFzT1RRc01UQTJMREUxTVN3ME1Dd3lNak1zTWpFNExESXlPQ3d6TERJMU15d3lNVGtzTmpZc09Dd3hPVEVzTkRjc01UTXdMREl3TUN3eU1qWXNNVE0zTERreUxESXdNaXd4TURJc05EY3NNakF3TERFeE15dzJOeXd4TlRZc09ETXNNVGsxTERJd01Td3lNeklzTWpJMUxEazJMREl3TXl3NE1Td3lNVE1zTVRJd0xEZzVMREV4TWl3eE9UTXNNalFzTnpjc01UWXpMREUzTkN3eUxESXdNU3d4TXpBc01UY3dMREl4T0N3Mk5pd3hNak1zTVRFNUxEZ3pMREl4T1N3d0xETXlMRFl4TERVd0xESXpNQ3d4TWpjc01qa3NNakE0TERJeE1Dd3lNamNzTWpFM0xEZzVMREUxTkN3eU16QXNOVGdzTnprc01pd3pMREVzTUN3eCIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwNjQ0NzA0NywiZXhwIjoxNTA2NDUwNjQ3fQ.pY0BZZHSMWyL4UE8sclEb-FglzmOuh8kHykFkGTUfxgdb7bAY7bVtTQWlN05dhMs5QncAjsKExEuoLoH0vqYKOWEsXM_oTnu59NY2JPiEYZOo-v5wsc7on3G_CF0E5BGYhG-fDpbmi3qbin-i-drDyOjWMC3jK1CngMT7G1ElW_x2W8-UfrcfGkIzdW11Iul-79prZ1OzNMoPI06aaAtxyd5-6_O2-jaKlKGGfqIGlV_cFnMuIW6tWONzmSY-XnKtUKMPOctLVGLYJI9l8e2D4e7NmXVZz7lum7KmCzJvrRq0T4dOy5j_CaSmyA26SJcmRbRn940THU7S5BuavBCjQ',
    refreshToken: undefined,
    tokenType: 'Bearer',
    infoToken: {
      sub: '117959105295761687889',
      name: 'test think',
      given_name: 'test',
      family_name: 'think',
      picture:
        'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
      email: 'testandthink123@gmail.com',
      email_verified: true,
      locale: 'en'
    },
    tokenIDJSON: {
      azp:
        '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',
      aud:
        '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',
      sub: '117959105295761687889',
      email: 'testandthink123@gmail.com',
      email_verified: 'true',
      at_hash: 'kg6JDu2r04i5VGJPdIigPQ',
      nonce:
        'NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTcyLDE5NCwyMzcsMjEyLDEzNCw4NSwyMjEsMjEyLDExNywxMzMsMTcwLDg0LDIwNiw2OSwxNDEsMzcsMjU0LDIxNiwxNjksMzEsNjMsOTEsMTE1LDEzOSw1MiwyMTYsMjI5LDIyNiwxMyw5OSwxNjcsMTg1LDEyMCwyMTMsMTIyLDIyNiwyMTAsMTE0LDI0MSwxNjMsMTA2LDExMCwyMzcsNDMsMjMzLDkxLDI1MCwyMjMsMjI1LDEwNiw4MiwxNTUsNSwyMzYsMTk2LDE1MCwyMjEsMTcsMTI4LDIzLDE4NCwxMzEsOTQsMTkwLDU4LDI0OSwxNzgsMTA3LDE5MiwzNSw4NSwxODMsMjEyLDI0OSwyNDEsMjQ2LDUwLDAsMzcsMTI2LDExMiwxNiwyMzAsMjEyLDIzLDEzOSwxOTgsNzQsMjE4LDE1MywxNzgsMTQwLDQxLDE4NiwyMzIsNjQsMjI5LDQsMjIxLDY1LDE0LDE4MCwzNSwxMzUsNjksMTMsMjMxLDI4LDIxMCw1MywxMTgsMTY4LDE2MSwzOCw0MiwxNDcsMTQ1LDg2LDIwNywyNCw5MCwyMjYsMTUsMjA5LDg5LDE4MywxMDcsMTY0LDE1LDIwMiwyNDIsNzIsMTgxLDIyNSwyNTAsMTIyLDE1OCw5MCwxNjksMjM1LDEzNCw0NCwxMiw1MSwyNDUsMTQwLDkyLDc1LDEyOSw3OSwyMzAsMjM3LDE2MSwxOTMsMTQyLDE1Miw5LDIyMSw0MiwxNzQsOTcsMjA5LDExNywxOTMsMTIsOTMsMTYxLDIxNywyNDEsMTk4LDEwOCwxODYsMjksMTkzLDEyMSw4MywxMDksMjI2LDE5MywxNTAsMTgzLDM0LDE5LDk1LDExMiw3NCwyMzAsOTQsMTA2LDE1MSw0MCwyMjMsMjE4LDIyOCwzLDI1MywyMTksNjYsOCwxOTEsNDcsMTMwLDIwMCwyMjYsMTM3LDkyLDIwMiwxMDIsNDcsMjAwLDExMyw2NywxNTYsODMsMTk1LDIwMSwyMzIsMjI1LDk2LDIwMyw4MSwyMTMsMTIwLDg5LDExMiwxOTMsMjQsNzcsMTYzLDE3NCwyLDIwMSwxMzAsMTcwLDIxOCw2NiwxMjMsMTE5LDgzLDIxOSwwLDMyLDYxLDUwLDIzMCwxMjcsMjksMjA4LDIxMCwyMjcsMjE3LDg5LDE1NCwyMzAsNTgsNzksMiwzLDEsMCwx',
      iss: 'https://accounts.google.com',
      iat: '1506447047',
      exp: '1506450647',
      alg: 'RS256',
      kid: '3b0fc11962ad16e49d55a26816c5ad0d3f6b8a83'
    },
    expires: '1506450647',
    email: 'testandthink123@gmail.com'
  },
  infoToken: {
    sub: '117959105295761687889',
    name: 'test think',
    given_name: 'test',
    family_name: 'think',
    picture:
      'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
    email: 'testandthink123@gmail.com',
    email_verified: true,
    locale: 'en'
  }
};

let dataObjectPopulate = {
  url: 'hyperty://h1.domain/h1',
  data: { type: 'chat', content: 'hello world' },
  reporter: 'hyperty://h1.domain/h1',
  created: '2017-09-26T15:05:14.966Z',
  runtime: runtimeURL,
  schema:
    'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Communication',
  parent: 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a'
};

let messageToBeHashedPopulate = {
  type: 'execute',
  from: hyperURL1,
  to: hyperURL2,
  body: {
    identity: hyperURL1,
    value: 'value',
    handshakePhase: 'handshake'
  }
};

let messageForNewChatCrypto = {
  from: 'hyperty://h1.domain/h1',
  to: 'hyperty://h2.domain/h2',
  body: { ignore: true },
  callback: undefined,
  dataObjectURL: 'comm://localhost/6c3b1310-28e2-43bf-bc1e-a4405a6733a2'
};

let chatKeysPopulate = {
  hypertyFrom: {
    hyperty: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
    userID: 'testandthink123@gmail.com',
    privateKey: undefined,
    publicKey: undefined,
    assertion:
      'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
    messageInfo: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909486'
    }
  },
  hypertyTo: {
    hyperty: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
    userID: undefined,
    publicKey: undefined,
    assertion: undefined
  },
  keys: {
    hypertyToSessionKey: undefined,
    hypertyFromSessionKey: undefined,
    hypertyToHashKey: undefined,
    hypertyFromHashKey: undefined,
    toRandom: undefined,
    fromRandom: undefined,
    premasterKey: undefined,
    masterKey: undefined
  },
  handshakeHistory: {
    senderHello: undefined,
    receiverHello: undefined,
    senderCertificate: undefined,
    receiverFinishedMessage: undefined
  },
  initialMessage: { body: { value: 'Initial Message Value' } },
  callback: undefined,
  authenticated: true,
  dataObjectURL: 'comm://localhost/6c3b1310-28e2-43bf-bc1e-a4405a6733a2'
};

let encryptMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  from: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  body: {
    handshakePhase: 'senderHello',
    value:
      'NDgsNDksNTIsNTAsMzksMTEsMjM5LDIxMSwxODQsMTg1LDE4NSwxNjEsMTQzLDE0NSwyMDEsMTA4LDg2LDIxNSwyNTUsMTUwLDIyMiw1MSwxNDUsMTQzLDEzMCwxNiwxNTYsMTY5LDMyLDIyNywzNSwyNw==',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909486'
    },
    auth: false
  },
  id: 12
};

let senderHelloMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  from: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  body: {
    handshakePhase: 'senderHello',
    value:
      'NDgsNDksNTIsNTAsMzksMTEsMjM5LDIxMSwxODQsMTg1LDE4NSwxNjEsMTQzLDE0NSwyMDEsMTA4LDg2LDIxNSwyNTUsMTUwLDIyMiw1MSwxNDUsMTQzLDEzMCwxNiwxNTYsMTY5LDMyLDIyNywzNSwyNw==',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909486'
    },
    auth: false
  },
  id: 12
};

let receiverHelloMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  from: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  body: {
    handshakePhase: 'receiverHello',
    value:
      'NDgsNTAsNTIsNTEsMTUwLDI1MSwzNywxMjMsMzksMjgsNDgsMjksMTE1LDI0NSw5MSwxNDAsNTEsMTM3LDE3MSwyMDUsMTI0LDg3LDE1Myw0MSwyMDIsNzcsOTAsMTg2LDIwNSwxODUsMzMsODA=',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TURNeE5UUTBPVEUzTVRFeU56VXhNall6TkRJaUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhek15TVVCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWtWTGFrcG9URzUyUW5sS2IyZHdiVnB5TVZGQ01FRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVozbE1SRlY2VEVSSk1VNURkekpPZVhkNFRYcFJjMDFVYTNoTVJFVjVUbE4zTUU1cGQzbE9hWGQ0VFhwbmMwMVVUWHBNUkVWNVRFUkZNRTU1ZDNoUFJGbHpUVlJCZWt4RVdYcE1SR3N4VEVSVmMwMVVaM3BNUkVVd1RFUkZlVTVEZHpKUFEzZDRUbnBOYzAxNlFYTk9hbXR6VFZSQmQweEVSVEpOUTNkNFRtcE5jMDFVVlROTVJHc3hURVJGTkUxNWR6Uk9lWGQ0VDBSSmMwMVVXWGxNUkVVMFRXbDNlVTE2VFhOTlZFMHdURVJGZWs1NWQzcE9RM2Q0VFdwWmMwMVVXVEpNUkVVeFRXbDNlRTFxWTNOT1ZFbHpUVlJuTlV4RVNYcFBVM2Q1VFZSVmMwMXFRWGxNUkVsM1QxTjNlRTVFV1hOUFJGRnpUVlJGTUV4RVJYcE9RM2Q1VFVSWmMwNTZZM05OVkZGNFRFUkZkMDFEZHpOTmFYZDRUbnBKYzAxVVkzZE1SRVV6VDBOM2VFMUVRWE5OYWtFeFRFUlZlRXhFU1hoTlUzY3pUa04zZVUxNmEzTlBWR3R6VFZSbmVFeEVRWE5OZW1kelQxUlZjMDFVWXpWTVJFbHpUME4zZUU5RVkzTk5WRUYzVEVSRk0wMXBkM2xPUkdkelRWUm5lRXhFUlRCT1EzY3dUVk4zTTA1RGR6Sk9VM2Q2VDBOM2VVNVVVWE5OZWsxelRWUk5NRXhFUlRGUFUzY3pUa04zTWs5VGQzbE9SRlZ6VGtOM2VFMXFhM05QVkd0elRWUlpNa3hFU1RCUFEzY3dUMU4zZUU5RVRYTk5WRUV6VEVSRmVrMVRkM3BOVTNkNFRXcEJjMDFVWXpSTVJFVjNUV2wzZVUxcVJYTk5ha0V6VEVSSmVrNURkM2hQUkZselRWUlpORXhFUlRGT2FYYzBUVU4zTVU1NWQzcE5RM2Q0VDBSQmMwMXFTWGhNUkVrd1RXbDNlVTE2V1hOTlZFVjZURVJGTTAxcGQzbE9WRWx6VFZSUk1VeEVSWGxNUkZFeVRFUlpNa3hFUlhoT2FYZDVUVlJOYzAxcVJUQk1SRlV5VEVSSmQwMTVkM2xOYWtGelRWUkplVXhFVlRWTVJFazBURVJKTUV4RVozcE1SRkUwVEVSTk0weEVXWE5OVkd0elRWUlJkMHhFUlRST2VYZDRUbXBWYzAxVVNYTk5WR016VEVSSmVrNURkM2hPUkZselRWUmpORXhFUlROTmVYZDVUVlJWYzA5VWEzTk5WRWt4VEVSSk1VMXBkM2hOVkZWelRXcE5OVXhFU1hkT1EzZDVUa1JyYzAxNmEzTk9SRlZ6VFZSWmMwOVVVWE5OVkUxNVRFUm5NMHhFUlRWT1UzYzFUVk4zTUU1RGQzaFBWRlZ6VFZSSk1FeEVaekZNUkVsNFRsTjNlRTE2WjNOTmFsVjNURVJGZUU1VGQzaE5la0Z6VFZSRmMwMXFVVFJNUkVWNlRWTjNlRTVEZDNoTmFsRnpUbXBWYzAxVVl6Rk1SRWt4VFdsM2VVMXFVWE5OVkdzelRFUm5jMDFVVFhoTVJGVTBURVJGZDAxNWR6Qk5lWGQ1VGxSVmMwMVVhM2xNUkVsM1QxTjNlRTlVWjNOTmFrbDVURVJGTlUxcGQzbE5WR056VFdwVmVFeEVSVFJOYVhjeFQwTjNlRTFxVVhOTmVtZHpUVlJWZDB4RWF6Rk1SRUZ6VFZSUmMwNVVRWE5OZWtWelRWUnJkMHhFUlRKTVJFVXpUbE4zZUU1RGQzaE5lbXR6VFZSbmVFeEVSWE5OYWxFeVRFUm5ORXhFUlhkUFEzY3hUbmwzZVU1RVozTlBSRUZ6VFZSak1reEVSVFZPZVhkNFRsUk5jMDFxUlhkTVJFazFURVJGTlU1NWQzcE9VM2Q1VG1sM2VFMUVXWE5PVkVGelRWUnJjMDlFWTNOT2VtZHpUV3BKTWt4RVJYZE9VM2Q0VFdwRmMwOVVTWE5OYWtFeVRFUkZkMDVwZDNsTmFYZDRUMFJOYzA1cVdYTk5WRUV6VEVSWk1reEVaM05OVkdOM1RFUkZlVTU1ZDNsTmFtZHpUbnBaYzAxcVNUUk1SRWswVEVSSmVrMURkM3BOYVhkNVRXcGpjMDFVVVhwTVJFVTFUMU4zZVV4RVRYTk5VM2QzVEVSRlBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRjNE9Td2laWGh3SWpveE5UQTNPVEE1TXpnNWZRLm40cVdaOUxEMmo2RFJNempyMGZhaGt3YzUzN2tGbEl5bjFOaC1oc0htRGtQdUhFbzAyUnVabm5QX0R6Qzl4aW5abE5GaUo3OE5QNHd4S20zXzFMUzE1Q2VmVnJtY2VsVjd3bGotd21jU1JxR2hiRldZOWJ2eHVJQ0Rfc0VfV1B3djNRRFRZRDdsLVJiOW1MYVhzcF93eXc0Z0k0cFFMczNWd0xpeFJHM0xFY003QzJpQTMwUXFYTkJuQ3pISDBINGhKQ3dUWHQtYThxdlZxemlkU1d0bG1nNWFweDk4cnZOVGVvS1ZPZmNVdUtSVUpqWFVpeHpjbkhXMlcweUJPWXJ6WF93UEt6UzVIYmJJQVBFQmZfZlZqSnI4eEVGcEMzTnphZk1rU1ZETXlIbmt5d3g3U1ItNDRXRVNCekdqM3lCZWRfeW9Idnh3Y29sVU5ZTW1kamxFQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMzE1NDQ5MTcxMTI3NTEyNjM0MiIsImVtYWlsIjoidGVzdGFuZHRoaW5rMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJFS2pKaExudkJ5Sm9ncG1acjFRQjBBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVGd5TERVekxESTFOQ3cyTnl3eE16UXNNVGt4TERFeU5TdzBOaXd5Tml3eE16Z3NNVE16TERFeUxERTBOeXd4T0RZc01UQXpMRFl6TERrMUxEVXNNVGd6TERFMExERXlOQ3cyT0N3eE56TXNNekFzTmprc01UQXdMREUyTUN3eE5qTXNNVFUzTERrMUxERTRNeXc0Tnl3eE9ESXNNVFl5TERFNE1pd3lNek1zTVRNMExERXpOeXd6TkN3eE1qWXNNVFkyTERFMU1pd3hNamNzTlRJc01UZzVMREl6T1N3eU1UVXNNakF5TERJd09Td3hORFlzT0RRc01URTBMREV6TkN3eU1EWXNOemNzTVRReExERXdNQ3czTWl3eE56SXNNVGN3TERFM09Dd3hNREFzTWpBMUxEVXhMREl4TVN3M05Dd3lNemtzT1Rrc01UZ3hMREFzTXpnc09UVXNNVGM1TERJc09Dd3hPRGNzTVRBd0xERTNNaXd5TkRnc01UZ3hMREUwTkN3ME1TdzNOQ3cyTlN3ek9Dd3lOVFFzTXpNc01UTTBMREUxT1N3M05DdzJPU3d5TkRVc05Dd3hNamtzT1Rrc01UWTJMREkwT0N3ME9Td3hPRE1zTVRBM0xERXpNU3d6TVN3eE1qQXNNVGM0TERFd01pd3lNakVzTWpBM0xESXpOQ3d4T0RZc01UWTRMREUxTml3NE1DdzFOeXd6TUN3eE9EQXNNakl4TERJME1pd3lNellzTVRFekxERTNNaXd5TlRJc01UUTFMREV5TERRMkxEWTJMREV4Tml3eU1UTXNNakUwTERVMkxESXdNeXd5TWpBc01USXlMRFU1TERJNExESTBMRGd6TERRNExETTNMRFlzTVRrc01UUXdMREU0Tnl3eE5qVXNNVElzTVRjM0xESXpOQ3d4TkRZc01UYzRMREUzTXl3eU1UVXNPVGtzTVRJMUxESTFNaXd4TVRVc01qTTVMREl3TkN3eU5Ea3NNemtzTkRVc01UWXNPVFFzTVRNeUxEZzNMREU1TlN3NU1TdzBOQ3d4T1RVc01USTBMRGcxTERJeE5Td3hNemdzTWpVd0xERXhOU3d4TXpBc01URXNNalE0TERFek1Td3hOQ3d4TWpRc05qVXNNVGMxTERJMU1pd3lNalFzTVRrM0xEZ3NNVE14TERVNExERXdNeXcwTXl3eU5UVXNNVGt5TERJd09Td3hPVGdzTWpJeUxERTVNaXd5TVRjc01qVXhMREU0TWl3MU9Dd3hNalFzTXpnc01UVXdMRGsxTERBc01UUXNOVEFzTXpFc01Ua3dMREUyTERFM05Td3hOQ3d4TXprc01UZ3hMREVzTWpRMkxEZzRMREV3T0N3MU55d3lORGdzT0RBc01UYzJMREU1Tnl3eE5UTXNNakV3TERJNUxERTVOeXd6TlN3eU5pd3hNRFlzTlRBc01Ua3NPRGNzTnpnc01qSTJMREV3TlN3eE1qRXNPVElzTWpBMkxERXdOaXd5TWl3eE9ETXNOallzTVRBM0xEWTJMRGdzTVRjd0xERXlOeXd5TWpnc056WXNNakk0TERJNExESXpNQ3d6TWl3eU1qY3NNVFF6TERFNU9Td3lMRE1zTVN3d0xERT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1Nzg5IiwiZXhwIjoiMTUwNzkwOTM4OSIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909389'
    },
    auth: false,
    via: 'runtime://localhost/protostub/6697977f-9776-c8b8-ec3d-8269f0e65536'
  },
  id: 5
};

let senderCertificateMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  from: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  body: {
    handshakePhase: 'senderCertificate',
    value:
      'eyJpdiI6Ik1UZzBMREl6Tml3eU1EY3NNakVzTVRjM0xESXpOeXcwTXl3eE9EQXNNVE14TERZeUxESXdMREUxTERJMU5TdzNOeXd5TlRVc05UYz0iLCJoYXNoIjoiTVRVMExERTBNaXd5TkRNc05EUXNNVElzTVRrNUxETTVMREUwTml3eE1qY3NNVGsxTERJeE1pdzVNaXd6TUN3eE9UY3NNVGM1TERFM01Td3hORFVzTWpFNUxERXlNU3d5TlRNc01qVXlMREUyT0N3MU1pdzRNQ3c0TlN3eE1UQXNORGdzTnpNc05EQXNOekVzTXpBc09ETT0iLCJzeW1ldHJpY0VuY3J5cHRpb24iOiJOalFzTVRVM0xERXpNeXcyTERFMU1Td3hNak1zTVRZNUxERTFPU3czTlN3ek9Dd3hOallzTmpRc01qSXhMREU1TVN3ek9Td3hOems9IiwiYXNzeW1ldHJpY0VuY3J5cHRpb24iOiJPRElzTnpRc01UY3dMREk0TERJME55dzFOQ3d5TXpVc01UVTJMREV3T0N3eE5qQXNNVEF4TERFMk1pd3hNemNzTVRReUxERTJNaXd5TkN3eE5USXNNelFzTXpnc01qVXpMREUxTXl3eE1UWXNOVGNzTWpNMkxERTVPU3cxTkN3eE9Dd3pOaXczTml3eU1EUXNNelFzTWpJd0xERXlNQ3d4TWpJc01UZ3NNalV6TERFNU5pd3lNRFFzTVRVNUxEVTVMREUyTUN3eE1qZ3NNak0zTERneExEa3hMREU0TlN3eE9EZ3NNVGd4TERJeE1Dd3hOVFlzTkRJc01USXdMREkxTERFMk15dzNNeXcyT0N3MU15d3hOeklzTWpFMkxESTBNU3d4TURJc09ERXNPREFzTVRFc01URTFMREUzTXl3Mk1pd3lNamdzTWpJeUxEVXhMREl3TVN3NU5Dd3lOVE1zT0RFc01qa3NPU3d5TWpjc016TXNOelFzTWpNNUxESTFNU3d5TWpJc05qY3NOVFFzTWpBMUxERTBNQ3c0TVN3eE5EWXNORE1zTmpnc01qVXpMREV6TERFeE1Td3hNakFzTWpVc01UazJMRGd4TERNMUxEZzBMREl5Tnl3eU5EZ3NOREFzTVRRc01USTFMREl5TUN3eU1EVXNNVGMzTERFeExEa3dMREUwTnl3MUxESXlNaXd5TWpjc01UQTJMREUzTXl3eE5Ea3NNVEkzTERjeExERXpOU3d4T1Rrc01UUTVMREUzT1N3eE9USXNNakU0TERJeE9Td3hPRGdzTVRVc01qa3NNVGM0TERJd055dzFOQ3d5Tml3eU1qWXNNalE1TERFek5pd3hOVGdzTXpnc01qRTVMRGcyTERFd01TdzROaXd5TkRJc09UZ3NNVGc1TERZeExERTBNeXd5TXpZc01UWXNOaXczTkN3eU16RXNNVFF4TERFME1Dd3hORGNzTWpFM0xESXhNeXd5T1N3eE1pd3lNellzTVRJMUxERXlMRFFzTnpVc05TdzVPU3d4Tnl3eE1pd3hOak1zTVRRMkxERTFNU3d5TVRZc01qQTBMRFkyTERNc01qQXdMREU1Tml3eE16WXNNVEU1TERFeE5Td3lOVFFzTWpFeUxEUTJMREUyTERFNE9TdzBPU3d4TURNc01UYzVMREl5TlN3eU5EWXNNVGcxTERJME55d3hPRFFzTWpFekxESXhOU3czTkN3eE5EUXNNekFzTVRNeExESXlOU3d5TXpFc05qVXNNVFl4TERFNE1Td3lNVElzTVRVMUxEYzBMREU1TERFMU9Td3lNRE1zTVRjM0xERTJPQ3d3TERFeE5DdzVNaXd4T1Rnc01UUTFMREU0TkN3eU1UZ3NOalVzTnpVc09UVXNNVEV4TERFeE9Dd3hORGNzTWpVMUxEY3NNVGt3TERZM0xERTJNU3d4TlRjc01UVTRMREUzTkN3eU1USXNNalV6TERRNExEUTVMREUwTnl3eE9USXNPVFFzTWpFMkxESXdNeXc0T0N3eE1qZ3NOalFzTVRnd0xEZzJMREl6T0N3eE5qSXNPVFVzTVRNeUxEZzFMREUzTVN3ME9TdzJNaXcwT1N3eiIsInNpZ25hdHVyZSI6Ik9ETXNNak16TERjd0xEYzVMRGM0TERFMk1Td3hNRGdzTmpFc01UUXdMREl6T0N3NU5pd3pNQ3d4T1RFc01UQXhMREV3TkN3eE5qZ3NNVEkyTERFNU5Td3lNRGtzTVRVMkxERTVPQ3d4TVRZc01URXNNak13TERZekxERTJNU3d4TnpNc01qSXlMREU1TERFM05Td3lNak1zT0Rjc01qVXlMRFl3TERFNE9Dd3hORGNzTVRVeUxESXlOeXcxTWl3eU5pd3lPQ3d4TlRJc05Td3hOemdzTVRBNUxERXhOQ3d4TWpZc01UZ3pMREU0T0N3NU5Td3lNelVzTXpNc01UVXNPVElzTVRReUxERTRNeXd4TnpVc01qRTJMREVzTVRVMkxERTBPQ3c0T1N3ek5pd3lNemNzTWpFeExERXpNQ3d4Tnl3eU5ESXNNVGMyTERFM0xERTRNaXd5TWpjc01UTXNNVE0wTERJek1Td3hNekFzTVRNNExEVTRMRGtzTWpVd0xEVTNMREkxTkN3eE1qQXNNVFV6TERReUxESTBMREV6TVN3eU9Dd3lMREl4TUN3eU1qSXNOakFzTWpJM0xERTNNaXd5TXpFc056VXNNVEkwTERZNExESXlOaXd4TnpBc01qUTBMREV5TlN3eU5EUXNOek1zT1RVc01qUXhMREV5TVN3eE56Z3NNelVzTWpFMExEVTRMRE0xTERFM0xEYzJMRGM1TERFNE5TdzFNU3d6T1N3eU5ETXNNalV6TERFM09Td3hORGtzTWpNMkxESXhOeXd5TVRnc01USTNMRE13TERZekxERTJNU3d4TURJc01UYzJMREV4T0N3eE5Dd3lNelFzTXpBc01UZ3hMRGdzTXprc056RXNPRGdzTVRFeUxEUXlMRElzTVRNeExEa3lMRGsyTERFNU9Dd3hPRGdzTXpJc05EVXNNak00TERZMExERTJNQ3d4T0Rrc01USTJMREl6TkN3M015d3pPQ3d4TVRRc056a3NNVFU1TERJMExESXdOeXd5TURJc01qSXhMRGsyTERJd09Td3hPREVzT0RZc05UY3NNVE13TERFd05pd3lOVElzTVRBd0xEQXNNVE15TERReExEWXdMREV6TlN3eE5qSXNOemtzTWpRekxESXhOU3cyT1N3NE1Td3hOREVzTWpnc01qQTRMREUzTUN3eU5UUXNNVEkzTERJd01Td3hORE1zTVRVMExERXlOaXd4TkRRc05USXNNVEE1TERFek5Td3hNREVzTmprc01qSXpMRGMzTERFM055dzNPU3d4TlN3eE5EUXNOVFVzTWpNMkxERXpOaXd4TXpBc016RXNNVGt6TERJMU5TdzFOeXd4TkN3eU5EWXNNVEk1TERZMExETTNMREUxTkN3eE1qY3NNeXd4TlRRc01qQXhMREl4Tml3eU1qQXNNVGd3TERjM0xESTBPU3d4T0RVc01Td3pPQ3d4TURVc01qUTJMRGd6TERFMk15d3pNQ3d4TmpVc01UTTBMREV4Tml3eE1Dd3lOQ3d4T0RNc01UY3dMREV6TERVd0xERTBPQ3d5TlRBc056TXNNVGN6TERjNUxESXlNU3d4TVRBc01URXdMRFV6In0=',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909486'
    },
    auth: false
  },
  id: 14
};

let receiverFinishedMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  from: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  body: {
    handshakePhase: 'receiverFinishedMessage',
    value:
      'eyJpdiI6Ik1qVXNNVFU0TERFMU1pd3hORE1zTkRBc01qRTBMREUxTml3ek55d3hNek1zTVRneExESTBOeXcwTkN3NE1Td3hOekFzTWl3eU16Yz0iLCJoYXNoIjoiTVRreExERTFOQ3cwTERjd0xESTFNU3d4TkRZc01UVXpMREkwTXl3eE5qWXNNVEl3TERJeU15dzFOaXd5TXpFc01UUXNNak0yTERJeE5Td3hOemNzTVRJc016TXNNVE00TERRekxESXhOU3d5TlRJc01qRTFMREU0TkN3eE1pdzVNQ3d5TURjc01UazFMRFlzTnpNc01Uaz0iLCJ2YWx1ZSI6Ik1UWTVMREV6Tnl3eE16RXNNVGcxTERJeE15d3lNQ3d4Tnl3eU1qVXNNVEEyTERJMU5Td3hORGNzTnpRc01qUTRMREl6TlN3M01Td3hOamM9In0=',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TURNeE5UUTBPVEUzTVRFeU56VXhNall6TkRJaUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhek15TVVCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWtWTGFrcG9URzUyUW5sS2IyZHdiVnB5TVZGQ01FRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVozbE1SRlY2VEVSSk1VNURkekpPZVhkNFRYcFJjMDFVYTNoTVJFVjVUbE4zTUU1cGQzbE9hWGQ0VFhwbmMwMVVUWHBNUkVWNVRFUkZNRTU1ZDNoUFJGbHpUVlJCZWt4RVdYcE1SR3N4VEVSVmMwMVVaM3BNUkVVd1RFUkZlVTVEZHpKUFEzZDRUbnBOYzAxNlFYTk9hbXR6VFZSQmQweEVSVEpOUTNkNFRtcE5jMDFVVlROTVJHc3hURVJGTkUxNWR6Uk9lWGQ0VDBSSmMwMVVXWGxNUkVVMFRXbDNlVTE2VFhOTlZFMHdURVJGZWs1NWQzcE9RM2Q0VFdwWmMwMVVXVEpNUkVVeFRXbDNlRTFxWTNOT1ZFbHpUVlJuTlV4RVNYcFBVM2Q1VFZSVmMwMXFRWGxNUkVsM1QxTjNlRTVFV1hOUFJGRnpUVlJGTUV4RVJYcE9RM2Q1VFVSWmMwNTZZM05OVkZGNFRFUkZkMDFEZHpOTmFYZDRUbnBKYzAxVVkzZE1SRVV6VDBOM2VFMUVRWE5OYWtFeFRFUlZlRXhFU1hoTlUzY3pUa04zZVUxNmEzTlBWR3R6VFZSbmVFeEVRWE5OZW1kelQxUlZjMDFVWXpWTVJFbHpUME4zZUU5RVkzTk5WRUYzVEVSRk0wMXBkM2xPUkdkelRWUm5lRXhFUlRCT1EzY3dUVk4zTTA1RGR6Sk9VM2Q2VDBOM2VVNVVVWE5OZWsxelRWUk5NRXhFUlRGUFUzY3pUa04zTWs5VGQzbE9SRlZ6VGtOM2VFMXFhM05QVkd0elRWUlpNa3hFU1RCUFEzY3dUMU4zZUU5RVRYTk5WRUV6VEVSRmVrMVRkM3BOVTNkNFRXcEJjMDFVWXpSTVJFVjNUV2wzZVUxcVJYTk5ha0V6VEVSSmVrNURkM2hQUkZselRWUlpORXhFUlRGT2FYYzBUVU4zTVU1NWQzcE5RM2Q0VDBSQmMwMXFTWGhNUkVrd1RXbDNlVTE2V1hOTlZFVjZURVJGTTAxcGQzbE9WRWx6VFZSUk1VeEVSWGxNUkZFeVRFUlpNa3hFUlhoT2FYZDVUVlJOYzAxcVJUQk1SRlV5VEVSSmQwMTVkM2xOYWtGelRWUkplVXhFVlRWTVJFazBURVJKTUV4RVozcE1SRkUwVEVSTk0weEVXWE5OVkd0elRWUlJkMHhFUlRST2VYZDRUbXBWYzAxVVNYTk5WR016VEVSSmVrNURkM2hPUkZselRWUmpORXhFUlROTmVYZDVUVlJWYzA5VWEzTk5WRWt4VEVSSk1VMXBkM2hOVkZWelRXcE5OVXhFU1hkT1EzZDVUa1JyYzAxNmEzTk9SRlZ6VFZSWmMwOVVVWE5OVkUxNVRFUm5NMHhFUlRWT1UzYzFUVk4zTUU1RGQzaFBWRlZ6VFZSSk1FeEVaekZNUkVsNFRsTjNlRTE2WjNOTmFsVjNURVJGZUU1VGQzaE5la0Z6VFZSRmMwMXFVVFJNUkVWNlRWTjNlRTVEZDNoTmFsRnpUbXBWYzAxVVl6Rk1SRWt4VFdsM2VVMXFVWE5OVkdzelRFUm5jMDFVVFhoTVJGVTBURVJGZDAxNWR6Qk5lWGQ1VGxSVmMwMVVhM2xNUkVsM1QxTjNlRTlVWjNOTmFrbDVURVJGTlUxcGQzbE5WR056VFdwVmVFeEVSVFJOYVhjeFQwTjNlRTFxVVhOTmVtZHpUVlJWZDB4RWF6Rk1SRUZ6VFZSUmMwNVVRWE5OZWtWelRWUnJkMHhFUlRKTVJFVXpUbE4zZUU1RGQzaE5lbXR6VFZSbmVFeEVSWE5OYWxFeVRFUm5ORXhFUlhkUFEzY3hUbmwzZVU1RVozTlBSRUZ6VFZSak1reEVSVFZPZVhkNFRsUk5jMDFxUlhkTVJFazFURVJGTlU1NWQzcE9VM2Q1VG1sM2VFMUVXWE5PVkVGelRWUnJjMDlFWTNOT2VtZHpUV3BKTWt4RVJYZE9VM2Q0VFdwRmMwOVVTWE5OYWtFeVRFUkZkMDVwZDNsTmFYZDRUMFJOYzA1cVdYTk5WRUV6VEVSWk1reEVaM05OVkdOM1RFUkZlVTU1ZDNsTmFtZHpUbnBaYzAxcVNUUk1SRWswVEVSSmVrMURkM3BOYVhkNVRXcGpjMDFVVVhwTVJFVTFUMU4zZVV4RVRYTk5VM2QzVEVSRlBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRjNE9Td2laWGh3SWpveE5UQTNPVEE1TXpnNWZRLm40cVdaOUxEMmo2RFJNempyMGZhaGt3YzUzN2tGbEl5bjFOaC1oc0htRGtQdUhFbzAyUnVabm5QX0R6Qzl4aW5abE5GaUo3OE5QNHd4S20zXzFMUzE1Q2VmVnJtY2VsVjd3bGotd21jU1JxR2hiRldZOWJ2eHVJQ0Rfc0VfV1B3djNRRFRZRDdsLVJiOW1MYVhzcF93eXc0Z0k0cFFMczNWd0xpeFJHM0xFY003QzJpQTMwUXFYTkJuQ3pISDBINGhKQ3dUWHQtYThxdlZxemlkU1d0bG1nNWFweDk4cnZOVGVvS1ZPZmNVdUtSVUpqWFVpeHpjbkhXMlcweUJPWXJ6WF93UEt6UzVIYmJJQVBFQmZfZlZqSnI4eEVGcEMzTnphZk1rU1ZETXlIbmt5d3g3U1ItNDRXRVNCekdqM3lCZWRfeW9Idnh3Y29sVU5ZTW1kamxFQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMzE1NDQ5MTcxMTI3NTEyNjM0MiIsImVtYWlsIjoidGVzdGFuZHRoaW5rMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJFS2pKaExudkJ5Sm9ncG1acjFRQjBBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVGd5TERVekxESTFOQ3cyTnl3eE16UXNNVGt4TERFeU5TdzBOaXd5Tml3eE16Z3NNVE16TERFeUxERTBOeXd4T0RZc01UQXpMRFl6TERrMUxEVXNNVGd6TERFMExERXlOQ3cyT0N3eE56TXNNekFzTmprc01UQXdMREUyTUN3eE5qTXNNVFUzTERrMUxERTRNeXc0Tnl3eE9ESXNNVFl5TERFNE1pd3lNek1zTVRNMExERXpOeXd6TkN3eE1qWXNNVFkyTERFMU1pd3hNamNzTlRJc01UZzVMREl6T1N3eU1UVXNNakF5TERJd09Td3hORFlzT0RRc01URTBMREV6TkN3eU1EWXNOemNzTVRReExERXdNQ3czTWl3eE56SXNNVGN3TERFM09Dd3hNREFzTWpBMUxEVXhMREl4TVN3M05Dd3lNemtzT1Rrc01UZ3hMREFzTXpnc09UVXNNVGM1TERJc09Dd3hPRGNzTVRBd0xERTNNaXd5TkRnc01UZ3hMREUwTkN3ME1TdzNOQ3cyTlN3ek9Dd3lOVFFzTXpNc01UTTBMREUxT1N3M05DdzJPU3d5TkRVc05Dd3hNamtzT1Rrc01UWTJMREkwT0N3ME9Td3hPRE1zTVRBM0xERXpNU3d6TVN3eE1qQXNNVGM0TERFd01pd3lNakVzTWpBM0xESXpOQ3d4T0RZc01UWTRMREUxTml3NE1DdzFOeXd6TUN3eE9EQXNNakl4TERJME1pd3lNellzTVRFekxERTNNaXd5TlRJc01UUTFMREV5TERRMkxEWTJMREV4Tml3eU1UTXNNakUwTERVMkxESXdNeXd5TWpBc01USXlMRFU1TERJNExESTBMRGd6TERRNExETTNMRFlzTVRrc01UUXdMREU0Tnl3eE5qVXNNVElzTVRjM0xESXpOQ3d4TkRZc01UYzRMREUzTXl3eU1UVXNPVGtzTVRJMUxESTFNaXd4TVRVc01qTTVMREl3TkN3eU5Ea3NNemtzTkRVc01UWXNPVFFzTVRNeUxEZzNMREU1TlN3NU1TdzBOQ3d4T1RVc01USTBMRGcxTERJeE5Td3hNemdzTWpVd0xERXhOU3d4TXpBc01URXNNalE0TERFek1Td3hOQ3d4TWpRc05qVXNNVGMxTERJMU1pd3lNalFzTVRrM0xEZ3NNVE14TERVNExERXdNeXcwTXl3eU5UVXNNVGt5TERJd09Td3hPVGdzTWpJeUxERTVNaXd5TVRjc01qVXhMREU0TWl3MU9Dd3hNalFzTXpnc01UVXdMRGsxTERBc01UUXNOVEFzTXpFc01Ua3dMREUyTERFM05Td3hOQ3d4TXprc01UZ3hMREVzTWpRMkxEZzRMREV3T0N3MU55d3lORGdzT0RBc01UYzJMREU1Tnl3eE5UTXNNakV3TERJNUxERTVOeXd6TlN3eU5pd3hNRFlzTlRBc01Ua3NPRGNzTnpnc01qSTJMREV3TlN3eE1qRXNPVElzTWpBMkxERXdOaXd5TWl3eE9ETXNOallzTVRBM0xEWTJMRGdzTVRjd0xERXlOeXd5TWpnc056WXNNakk0TERJNExESXpNQ3d6TWl3eU1qY3NNVFF6TERFNU9Td3lMRE1zTVN3d0xERT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1Nzg5IiwiZXhwIjoiMTUwNzkwOTM4OSIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ==',
      expires: '1507909389'
    },
    auth: false,
    via: 'runtime://localhost/protostub/6697977f-9776-c8b8-ec3d-8269f0e65536'
  },
  id: 7
};

let reporterSessionKeyMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  from: 'hyperty://localhost/7339190f-056a-41e1-88ec-18f02146b5bb',
  body: {
    handshakePhase: 'reporterSessionKey',
    value:
      'eyJ2YWx1ZSI6Ik1qVTBMREl4TkN3eU5ERXNNakExTERFeE1Td3hOelFzT1RFc05pd3lNakVzTWpRMExESTFMRGd5TERFNE5pd3hOallzTVRjeUxEYzVMREkxTlN3eE1UZ3NOVFlzTVRFekxEVTRMREkwT0N3eE56TXNOellzTVRrMExERTFOeXd4TXpnc09EVXNNakkxTERJeU5pd3pOQ3d4TVRJc01qQTVMREkzTERFeU1Td3lNVGtzTWpRc01qTXpMREl6TERZMExETTNMRGt6TERJek1pd3lNekFzTVRZd0xEWXdMRGcyTERFM01Td3hOakVzTVRJNExERTVNQ3czTWl3eU9Td3hOVFFzTVRFNUxERTBPU3d4TVRNc01qSXlMREl6Tnl3NU5pd3lORGtzTnpnc01UY3lMREU0TUN3NUxETTFMRE00TERVeExESTBOaXd4T0RZc09EUXNNakV3TERFek15d3hNRFVzT0N3eUxEVTJMREl6TERJd09Dd3lNVEFzT1RBc01qSXpMRGs0TERZMExERXdNQ3d4Tmprc01qTTRMREUzT0N3eE5qSXNORFFzTVRZNExERXdOeXd4TmpNc09UZ3NNakk1TERFeExERXpMREUzTml3eE16VXNNVGs1TERFd055d3hNVE1zTVRJeExESXNNalV3TERjd0xERTNOQ3d5TVRVc05qWXNNVFkxTERjMUxEWXpMREV3T1N3eU1qQXNNVEV6TERFNU5Td3hPVEFzTXpnc01UazVMREUxTkN3ek55d3hPRFVzTXpNc01URXlMRGt5TERFek9TdzFOU3c0Tml3eE5EY3NNVEEwTERFMU1pd3hOVGdzTWpFMUxEYzRMREl5TkN3d0xERXlNQ3cwTlN3eE1qQXNPU3d4TlRBc01qZ3NPVFFzTWpZc01UUTFMREV4TkN3eE1EY3NNVGdzTWpjc01qQTNMRFF3TERFek1TdzJNU3cwTkN3eE16VXNNVEk1TERJek5Td3hPVE1zTWpBd0xERTROaXd4TmpZc01UZ3pMREV6Tnl3eE5UTXNNakEyTERRNUxESXpOeXd4Tnprc056SXNOallzTWpNd0xESXpOU3d4TmpRc05ESXNNVE15TERFeE9Td3lOVFFzTVRneExETTBMRFl5TERFeE5Td3lNRElzTVRVd0xERXpNU3d5TXpjc01UazRMREUwTXl3NU1Dd3hNVEFzTWpNMUxERXlOU3cwTERJME1Dd3lNemdzTVRZMExERXpNU3d4TXpBc05ESXNNVEEzTERFM015d3lORGdzTVRNeExEUTFMRFl3TERFMU5TdzBNU3d5TURjc01qTXlMREU1TWl3eE1qa3NNVEkwTERFd05pd3lORFFzTVRjNUxESXlNeXd5TXpVc056a3NNak0zTERFNU1Td3hPRGtzTXpVc01qQXdMREUzTml3eE56WXNPVEVzTVRNMExERTJOaXcyTVN3eE56Z3NNVE14TERFNE9Dd3hOVGtzTVRNc01qQXpMREV6TlN3eE1pd3lNVFVzTmpFc01qUTFMREUzTkE9PSIsImhhc2giOiJNVFUwTERFME1pd3lORE1zTkRRc01USXNNVGs1TERNNUxERTBOaXd4TWpjc01UazFMREl4TWl3NU1pd3pNQ3d4T1Rjc01UYzVMREUzTVN3eE5EVXNNakU1TERFeU1Td3lOVE1zTWpVeUxERTJPQ3cxTWl3NE1DdzROU3d4TVRBc05EZ3NOek1zTkRBc056RXNNekFzT0RNPSIsIml2IjoiTVRZc01URTJMREV6TERVMUxESXhNaXd6T0N3eE1qTXNNVFk0TERFeE55d3hNU3d6TlN3eE56QXNOQ3d4TURFc01qVXlMREU1TVE9PSJ9',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        '==eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqTm1PVGsxTWpWall6TmhNek5sTTJNeVlqVmtZMlk1WVRJeFpqUmtPREprTXpjeFltVTNOamNpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWxKcFdEZEVlbFI1YWxWUVIxOU5MVlZQVEhveGJFRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVVURk1SRVV4VFhsM2VVMUVaM05OYWxGNVRFUkpNVTVEZDNsTmVsbHpUV3BOTVV4RVVUSk1SRWw1VGxOM2VFMTZaM05OZW10elRXcEpNa3hFUlhoTmFYZDRUWHBSYzAxVVp6Vk1SRVY0VFVOM01FNURkM2xOUkVselRWUm5kMHhFYTNwTVJFVXdUME4zZVUxRVozTk9ha1Z6VFZSQk0weEVSWGROVTNkNVRVUlZjMDlFVVhOT1ZGVnpUVlJqTVV4RVozZE1SRWt4VEVSSmQwNXBkM2xOUkUxelRXcEJlRXhFU1RGTVJFbDZUME4zTWt4RVdYbE1SRVV4VG1sM2VFMXFVWE5PYWtselRXcE5ORXhFUlhoTVJFa3dUMU4zTkU1RGR6Uk1SRVV6VG1sM01rNTVkM2xPVkZGelRWUnJNVXhFU1RCT1UzZDRUWHBSYzA1cGQzbE9SRTF6VFdwSk1VeEVSVEZQUTNkNFRrUlJjMDFVVFRKTVJFVjVUbmwzZUUxVVozTk5hbEY1VEVSbk5FeEVZekpNUkVVd1RtbDNlRTU1ZDNsTmFrRnpUVlJGTkV4RVNUQk9RM2MxVG5sM2VVNUVaM05OVkdONlRFUkZORTFUZHpWUFEzY3lUbWwzTkV4RVdYaE1SR2N4VEVSSk5FeEVSWHBPVTNjeFRFUkZORTlUZHpOUFUzZDRUVlJOYzAxVVl6Uk1SRVV3VDBOM2VFMTZRWE5OYWxWNlRFUkZlVTVEZDNwT1EzY3dUMU4zZVU1RVNYTk5hbFY1VEVSRk1VNXBkM2hPUkdkelRWUlZjMDVxUlhOTmFsRXhURVJKZVUxVGQzbE5SR3R6VFZSSmVreEVSWGRQUTNkNFRtcFZjMDFxU1hOTmFrRXhURVJaTTB4RVJYbE5lWGQ0VDBSVmMwMXFRWGhNUkdjeVRFUkZNMDFEZDNoTlEzZDRUWHBSYzAxVVFURk1SRVUxVG1sM2VFMXFUWE5OYWxWNVRFUkZNazU1ZDNoT2VsVnpUV3BOTWt4RVJUQlBVM2N6VFVOM01rNURkM3BOVTNkNVRWTjNlVTFFUVhOTlZFMTVURVJKZVUxNWQzaE5lbEZ6VFdwQk1VeEVSVFZPUTNkNlRXbDNNVTVEZHpOT2VYZDVUV2wzTWs1NWQzcE9VM2MwVG5sM2VVMVVWWE5QUkZselRWUnJlRXhFU1hkT2VYZDRUbnBSYzAxcVFUVk1SRWt4VEVSbmVFeEVTWGxNUkVGelRYcEpjMDVFVVhOTmFsRXpURVJuTlV4RVp6Qk1SRWw2VGxOM2VFOVVZM05PZW1OelRWUnJNMHhFUlRSTVJFVjZUbWwzZUUxVVZYTk5WR2MwVEVSRmQweEVTWGhQUTNkNFQwUkJjMDFxVVhwTVJFbDRUVU4zZWs1VGQzaE5lbWR6VFdwQk1VeEVSVEpQVTNkNFQwTjNlazU1ZHpKTVJFRnpUMVJKYzAxVVkzZE1SRTAxVEVSRk1VNURkM2xPVkZWelRWUkJNMHhFU1RKTVJFVjVUME4zZVUxcVdYTk5hazEzVEVSRk1rMXBkM2hQVkVselRXcEJlRXhFUlRCTmFYZDRUbnBaYzA1VVFYTk5WRUUxVEVSSk1FOVRkekJOYVhkNFRrUm5jMDFxUVhwTVJFbDRUV2wzZVUxRVdYTk5WR2MwVEVSVk5VeEVSWGxOZVhkNFRrUkJjMDFVYTNoTVJHc3dURVJOTWt4RVJUQk9RM2Q1VGtSUmMwNVVhM05OYWswMVRFUlJjMDFVUlhwTVJFMTZURVJSTlV4RVdUSk1SRTEzVEVSSmQwMTVkelJNUkdNelRFUkZlVTVUZDNsTlJHdHpUVlJGZWt4RVNUQk5VM2Q0VFZSbmMwNTZVWE5OVkZFd1RFUm5lVXhFUlhkT2VYYzFUWGwzZUU1cGQzbE5ha1Z6VGxSQmMwMXFUWHBNUkVVeFRsTjNNMDU1ZDNoUFJFbHpUV3BCTWt4RVNYcE9lWGMwVDBOM2VVeEVSVEJPUTNkNVRYcFpjMDFVWnpKTVJFVXdUa04zZVUxNlRYTk5lbGx6VFZSUk1reEVSWGxNUkVVeVRVTjNkMHhFUlRST2FYZDRUMVJqYzA5RVkzTk5WR014VEVSUk5VeEVSVFZPZVhjeVQwTjNlVTFVWjNOTlZHTXhURVJKYzAxNWQzaE1SRUZ6VFZFOVBTSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllXTmpiM1Z1ZEhNdVoyOXZaMnhsTG1OdmJTSXNJbWxoZENJNk1UVXdOemt3TlRnNE5pd2laWGh3SWpveE5UQTNPVEE1TkRnMmZRLktvU2xyeHp1RUthd1ZWcS1TdmNHNTRXZVladWpaS2ltd2JXV21td01UcUZjMVI1My1wMFRlbWVFdS1VT29NU3NydjA1bUxoV20zV3lfb1RKM3JKeWRPX3FQS1ptU3F3aENxeEVNNjRWajNDeHRTa1c0SUg5VmR3emlmYUxtakRIQk9NZ0Y5OUNLcTBCMkhVWVhwNXU3TXJDc1VrTC1LLXhnUVI4c185MzhiUXNSX085eHpILTluZFVVTjBCb09aQ0tCYm50WmZYdjZ5am9VeEZKdG10clVUWnpsUkZYbUtxWWQtVk9TYVZ3MURldlRDbzBjbjNrTXBtZ0E1Sk13aTZ5U2pEdE9TQzkwVjc1dDZJSVhvS2g3T2ZZOG1aelIzeWprejNpckxiNEhNdDlTV21qNVlCZmF4M0FtNDY1bnBLM3RpOWxOZFZaa1lVMmZRUGg0SC1mQSIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJSaVg3RHpUeWpVUEdfTS1VT0x6MWxBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFExTERFMU15d3lNRGdzTWpReUxESTFOQ3d5TXpZc01qTTFMRFEyTERJeU5Td3hNemdzTXprc01qSTJMREV4TWl3eE16UXNNVGc1TERFeE1DdzBOQ3d5TURJc01UZ3dMRGt6TERFME9Dd3lNRGdzTmpFc01UQTNMREV3TVN3eU1EVXNPRFFzTlRVc01UYzFMRGd3TERJMUxESXdOaXd5TURNc01qQXhMREkxTERJek9DdzJMRFl5TERFMU5pd3hNalFzTmpJc01qTTRMREV4TERJME9TdzROQ3c0TERFM05pdzJOeXd5TlRRc01UazFMREkwTlN3eE16UXNOaXd5TkRNc01qSTFMREUxT0N3eE5EUXNNVE0yTERFeU55d3hNVGdzTWpReUxEZzRMRGMyTERFME5pd3hOeXd5TWpBc01URTRMREkwTkN3NU55d3lORGdzTVRjekxERTRNU3c1T0N3Mk5pdzRMRFl4TERnMUxESTRMREV6TlN3MUxERTRPU3czT1N3eE1UTXNNVGM0TERFME9Dd3hNekFzTWpVekxERXlOQ3d6TkN3ME9Td3lORElzTWpVeUxERTFOaXd4TkRnc01UVXNOakVzTWpRMUxESXlNU3d5TURrc01USXpMREV3T0N3eE5qVXNNaklzTWpBMUxEWTNMREV5TXl3eE9EVXNNakF4TERnMkxERTNNQ3d4TUN3eE16UXNNVEExTERFNU5pd3hNak1zTWpVeUxERTJOeXd4TnpVc01qTTJMREUwT1N3M01DdzJOQ3d6TVN3eU1Td3lNREFzTVRNeUxESXlNeXd4TXpRc01qQTFMREU1TkN3ek1pdzFOQ3czTnl3eU1pdzJOeXd6TlN3NE55d3lNVFVzT0RZc01Ua3hMREl3Tnl3eE56UXNNakE1TERJMUxEZ3hMREl5TERBc016SXNORFFzTWpRM0xEZzVMRGcwTERJek5Td3hPVGNzTnpjc01UazNMREU0TERFek5pd3hNVFVzTVRnNExERXdMREl4T0N3eE9EQXNNalF6TERJeE1Dd3pOU3d4TXpnc01qQTFMREUyT1N3eE9Dd3pOeXcyTERBc09USXNNVGN3TERNNUxERTFOQ3d5TlRVc01UQTNMREkyTERFeU9Dd3lNallzTWpNd0xERTJNaXd4T1RJc01qQXhMREUwTWl3eE56WXNOVEFzTVRBNUxESTBPU3cwTWl3eE5EZ3NNakF6TERJeE1pd3lNRFlzTVRnNExEVTVMREV5TXl3eE5EQXNNVGt4TERrMExETTJMREUwTkN3eU5EUXNOVGtzTWpNNUxEUXNNVEV6TERNekxEUTVMRFkyTERNd0xESXdNeXc0TERjM0xERXlOU3d5TURrc01URXpMREkwTVN3eE1UZ3NOelFzTVRRMExEZ3lMREV3Tnl3NU15d3hOaXd5TWpFc05UQXNNak16TERFMU5TdzNOeXd4T0RJc01qQTJMREl6Tnl3NE9Dd3lMREUwTkN3eU16WXNNVGcyTERFME5Dd3lNek1zTXpZc01UUTJMREV5TERFMk1Dd3dMREU0Tml3eE9UY3NPRGNzTVRjMUxEUTVMREU1Tnl3Mk9Dd3lNVGdzTVRjMUxESXNNeXd4TERBc01RPT0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOiIxNTA3OTA1ODg2IiwiZXhwIjoiMTUwNzkwOTQ4NiIsImFsZyI6IlJTMjU2Iiwia2lkIjoiM2Y5OTUyNWNjM2EzM2UzYzJiNWRjZjlhMjFmNGQ4MmQzNzFiZTc2NyJ9fQ',
      expires: '1507909486'
    },
    auth: false
  },
  id: 15
};

let receiverAcknowledgeMessagePopulate = {
  type: 'handshake',
  to: 'hyperty://localhost/13d01515-1663-41f0-a115-88e7ca03bb83',
  from: 'hyperty://localhost/9e1c674c-9374-491f-9812-4c3f31450951',
  body: {
    handshakePhase: 'receiverAcknowledge',
    value:
      'eyJ2YWx1ZSI6Ik1qTTRMREV6TVN3eE9UY3NNeXd5TWpRc05Dd3lNalVzTWpJeUxERTNOU3d5TVRVc05qWXNNVE15TERJME55d3lNek1zTnl3eE9ETT0iLCJoYXNoIjoiTWpjc01USXlMREkyTERFeE1Td3lPQ3cwTWl3M015dzJPQ3d4TXpBc01qRTRMREUwTml3eU1qRXNNVGt5TERFd05Dd3lNVE1zTVRrMUxERTVOU3d6TVN3eU9Td3lORElzTVRRM0xESTFMREU1TkN3eU5Td3lNakFzTVRReUxEWTRMREUzT0N3ek9Td3lOeXd4Tmpnc01USXkiLCJpdiI6Ik1qVTFMRGN5TERJME9Td3lNallzTVRrNUxESXlOU3c1T1N3eU5Ea3NNalV4TERJMkxESTFOQ3cwTnl3eU1EQXNPRGtzTVRZMkxERTNOdz09In0=',
    identity: {
      userProfile: undefined,
      idp: 'google.com',
      assertion:
        'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkltTTJZVEZrWmpsaFltWXlOR1ppWVRjNVlqSTBZamhtTURFelptUmxOV016T0RZNE1EbGpZbVlpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TURNeE5UUTBPVEUzTVRFeU56VXhNall6TkRJaUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhek15TVVCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWpaYWFHb3lkR2xHZUdsck5HeGlZa1JWU0VWb00xRWlMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVZUUk1SRVV3VGtOM2VFNXFSWE5QVkdOelRWUlZNVXhFU1hoT2VYY3dUVU4zTVUxcGQzaE5lbWR6VFZSUk0weEVTVFJNUkVsM1RtbDNlRTVVWjNOTmFrMTVURVJGTUUxcGR6RlBVM2Q0VFZScmMwNXFSWE5OVkVVeFRFUlpkMHhFU1hwTlUzZDVUVVJOYzA1NmEzTk9WR056VGxSUmMwMVVaek5NUkZWNVRFUkZlVTVEZHpKTlUzY3pUVU4zZVU1NWQzaFBWRWx6VG5wbmMwMVVXWGxNUkVWNFRYbDNlRTFVU1hOTmFtdHpUbFJyYzAxVVp6Tk1SRkV5VEVSRk0wNVRkM2hOUkZWelRWUlZjMDFVVVhkTVJFVXhUa04zTWs1RGQzaFBWR2R6VFZSSk5VeEVSVEJOZVhjeFQxTjNlVTFxYTNOTlZFRXpURVJyTWt4RVJYaE9hWGN6VFhsM01rMTVkM2hPYWtGelRWUlZlRXhFUlRCTmFYZDRUVlJKYzA5VVZYTk5WRWx6VFhwVmMwMVVSVE5NUkVreFRVTjNNMDFwZDNsTmFrVnpUVlJqTVV4RVZUTk1SRWw0VGxOM2VFMTZhM05PUkdOelRWUlpOVXhFU1hwTVJFVXpUWGwzZVUxNlNYTk5ha0YzVEVSRk1rNVRkM2hPUTNkNVRYcGpjMDVVV1hOTlZGVjVURVJKZDAxNWR6Tk1SRVY2VDFOM2VFMTZVWE5OYWxFMVRFUkZlRTFEZDNoT1ZFMXpUVlJaZVV4RVdURk1SRWw2VGxOM01FMTVkM2hQUkVselRXcEplVXhFUlRKT1EzZDVUVVJqYzA1NlVYTk5hbEUxVEVScmQweEVWWGhNUkVWNlRtbDNlVTFxVlhOT1ZGbHpUVlJGTlV4RWF6Rk1SRVY2VDBOM2VFNXFWWE5OYWxWelRWUmpNMHhFU1RGT1EzZDVUV3BaYzAxcVJYaE1SR2MwVEVSSk1FMTVkM2hPYVhkNFRVUnJjMDlFV1hOTlZGbDRURVJGTUU1NWQzaE9SRkZ6VFZSTk5VeEVSVEJPUTNjeVRFUmplVXhFVVRCTVJFVXlUWGwzZUUxcVFYTk9ha1Z6VFZSck5VeEVhelJNUkVWM1RtbDNlRTE2VFhOTlZHY3pURVJGZWsxcGQzbE5RM2Q1VGtSUmMwMXFZM05OYWsweVRFUkplVTlUZDNoUFZHTnpUVlJGTlV4RVJUVk9hWGQ2VG5sM2VFNUVZM05OVkUxM1RFUkZlazlUZDNsTmVtTnpUVlJSTUV4RVJUVk5VM2Q1VFhwTmMwMVVXVE5NUkVWNlRYbDNNVTFUZDNoT1JGbHpUVlJGYzAxcVFUTk1SRmw1VEVSRk1VNTVkM2hOZWxselRYcEZjMDU2YTNOTlZGbDZURVJSTkV4RVJUUk9RM2Q0VGxSQmMwMXFTWGxNUkVVeFRrTjNlVTFEZHpOUFEzZDVUWHBOYzAxcVJUSk1SRlV4VEVSRmVrNURkM2hPZWxGelQxUnJjMDFxU1hoTVJHZHpUMVJSYzAxVVVYaE1SRVV5VG1sM01FNTVkM2hOZWtGelQwUnJjMDFxVVROTVJFbDNUV2wzZVUxRVRYTk5WRWwzVEVSck0weEVSWGROZVhkNVRWUnJjMDFVUVRSTVJGRjNURVJWZWt4RVJYbE9hWGQ0VDBSWmMwMTVkM2xOVkd0elQwUlpjMDlFYTNOTmFrMHdURVJGTkUxcGR6Qk5hWGN3VDBOM2VFNVVTWE5OYWtGNVRFUlpjMDFVVFhoTVJFVTBUa04zZUUxRVZYTk9la2x6VDFSTmMwMVVRVE5NUkVsNFRubDNlRTU2UVhOT2VrVnpUVlJOZDB4RVJUUk5lWGQ0VFhwWmMwMXFWVEJNUkVWNVRXbDNOVTlEZDNoT2FsRnpUbnBWYzAxcVRUSk1SRVV3VG1sM2VFMXFZM05OYW1OelRXcFpjMDFVVVhwTVJFVjRUV2wzZUUxVVNYTk5hazE1VEVSSk1FNURkM2hQVTNkNFQxUlZjMDFxVlhwTVJFVjNUWGwzZUU5RWEzTk9lbWR6VFZSSk5VeEVTWHBOYVhkNFRrUmpjMDFVWnpOTVJHc3lURVJSYzAxcVRYTk5WRkZ6VFhsM01VMURkM2hOZWsxelQxUk5jMDFxVFhsTVJFa3dUbmwzZVUxRVozTk5ha0V4VEVSSmMwMTVkM2hNUkVGelRWRTlQU0lzSW1semN5STZJbWgwZEhCek9pOHZZV05qYjNWdWRITXVaMjl2WjJ4bExtTnZiU0lzSW1saGRDSTZNVFV3T0RBd01USTFNeXdpWlhod0lqb3hOVEE0TURBME9EVXpmUS5GNXpicmRpWVI5b2c3V0pPenB1UEZ4M0p0SG5tdl95eTN6VjRxNTR3eEpkTTkwck4tTFZFbG0wcF9HemVHYXJLZ09KTkdHWE5qYjZpMUF6V05aUUZuQnc4ZktEZjR4MkxWM0lqUUM4WjJzZnNlZ0VUbmEzWTZXU2llbUtmN1QwaUJQZXBqbTNWUTZwSHVFRXI0QTA3OURXT25DQ3pZR3VTT0ZSTjJxamRfNEpvNnUweU9jQkNtS3RpQ1dtZHZUWnFPS3dnM3ZGUWZ1MjVaZDBER3hVWlJQdm1Gd2o1bE85UGRpcURXVDhlZlM0Y29pTGtuZmEyak01emFMUGtOV0ExeW5WSnE3REFfQVNvQmdIdThPVDN5SllFME5WNEFZclBYWlFudWtFUHR5SzlyZXR2RmQ0cDFnelBiT2s0T2w0WWI0UGtiUUNmM2RhS2doTDlkSXpxeEEiLCJ0b2tlbklESlNPTiI6eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMxNTQ0OTE3MTEyNzUxMjYzNDIiLCJlbWFpbCI6InRlc3RhbmR0aGluazMyMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6InRydWUiLCJhdF9oYXNoIjoiNlpoajJ0aUZ4aWs0bGJiRFVIRWgzUSIsIm5vbmNlIjoiTkRnc01UTXdMREVzTXpRc05EZ3NNVE1zTml3NUxEUXlMREV6TkN3M01pd3hNelFzTWpRM0xERXpMREVzTVN3eExEVXNNQ3d6TERFek1Dd3hMREUxTERBc05EZ3NNVE13TERFc01UQXNNaXd4TXpBc01Td3hMREFzTVRVNExERTBOQ3d4TmpFc09UY3NNVFUxTERJeE55dzBNQ3cxTWl3eE16Z3NNVFEzTERJNExESXdOaXd4TlRnc01qTXlMREUwTWl3MU9Td3hNVGtzTmpFc01URTFMRFl3TERJek1Td3lNRE1zTnprc05UY3NOVFFzTVRnM0xEVXlMREV5TkN3Mk1TdzNNQ3d5Tnl3eE9USXNOemdzTVRZeUxERXhNeXd4TVRJc01qa3NOVGtzTVRnM0xEUTJMREUzTlN3eE1EVXNNVFVzTVRRd0xERTFOQ3cyTkN3eE9UZ3NNVEk1TERFME15dzFPU3d5TWprc01UQTNMRGsyTERFeE5pdzNNeXcyTXl3eE5qQXNNVFV4TERFME1pd3hNVElzT1RVc01USXNNelVzTVRFM0xESTFNQ3czTWl3eU1qRXNNVGMxTERVM0xESXhOU3d4TXprc05EY3NNVFk1TERJekxERTNNeXd5TXpJc01qQXdMREUyTlN3eE5Dd3lNemNzTlRZc01UVXlMREl3TXl3M0xERXpPU3d4TXpRc01qUTVMREV4TUN3eE5UTXNNVFl5TERZMUxESXpOU3cwTXl3eE9ESXNNakl5TERFMk5Dd3lNRGNzTnpRc01qUTVMRGt3TERVeExERXpOaXd5TWpVc05UWXNNVEU1TERrMUxERXpPQ3d4TmpVc01qVXNNVGMzTERJMU5Dd3lNallzTWpFeExEZzRMREkwTXl3eE5pd3hNRGtzT0RZc01UWXhMREUwTnl3eE5EUXNNVE01TERFME5DdzJMRGN5TERRMExERTJNeXd4TWpBc05qRXNNVGs1TERrNExERXdOaXd4TXpNc01UZzNMREV6TWl3eU1Dd3lORFFzTWpjc01qTTJMREl5T1N3eE9UY3NNVEU1TERFNU5pd3pOeXd4TkRjc01UTXdMREV6T1N3eU16Y3NNVFEwTERFNU1Td3lNek1zTVRZM0xERXpNeXcxTVN3eE5EWXNNVEVzTWpBM0xEWXlMREUxTnl3eE16WXNNekVzTnprc01UWXpMRFE0TERFNE5Dd3hOVEFzTWpJeUxERTFOQ3d5TUN3M09Dd3lNek1zTWpFMkxEVTFMREV6TkN3eE56UXNPVGtzTWpJeExEZ3NPVFFzTVRReExERTJOaXcwTnl3eE16QXNPRGtzTWpRM0xESXdNaXd5TURNc01USXdMRGszTERFd015d3lNVGtzTVRBNExEUXdMRFV6TERFeU5pd3hPRFlzTXl3eU1Ua3NPRFlzT0Rrc01qTTBMREU0TWl3ME1pdzBPQ3d4TlRJc01qQXlMRFlzTVRNeExERTROQ3d4TURVc056SXNPVE1zTVRBM0xESXhOeXd4TnpBc056RXNNVE13TERFNE15d3hNellzTWpVMExERXlNaXc1T0N3eE5qUXNOelVzTWpNMkxERTBOaXd4TWpjc01qY3NNallzTVRRekxERXhNaXd4TVRJc01qTXlMREkwTkN3eE9Td3hPVFVzTWpVekxERXdNeXd4T0Rrc056Z3NNVEk1TERJek1pd3hORGNzTVRnM0xEazJMRFFzTWpNc01UUXNNeXcxTUN3eE16TXNPVE1zTWpNeUxESTBOeXd5TURnc01qQTFMRElzTXl3eExEQXNNUT09IiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoiMTUwODAwMTI1MyIsImV4cCI6IjE1MDgwMDQ4NTMiLCJhbGciOiJSUzI1NiIsImtpZCI6ImM2YTFkZjlhYmYyNGZiYTc5YjI0YjhmMDEzZmRlNWMzODY4MDljYmYifX0=',
      expires: '1508004853'
    },
    auth: false,
    via: 'runtime://localhost/protostub/ec69047b-c073-cbbc-e100-57fb897d4f8b'
  },
  id: 15
};

let validateAssertionValuePopulate = {
  identity: 'testandthink321@gmail.com',
  contents:
    'NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTU4LDE0NCwxNjEsOTcsMTU1LDIxNyw0MCw1MiwxMzgsMTQ3LDI4LDIwNiwxNTgsMjMyLDE0Miw1OSwxMTksNjEsMTE1LDYwLDIzMSwyMDMsNzksNTcsNTQsMTg3LDUyLDEyNCw2MSw3MCwyNywxOTIsNzgsMTYyLDExMywxMTIsMjksNTksMTg3LDQ2LDE3NSwxMDUsMTUsMTQwLDE1NCw2NCwxOTgsMTI5LDE0Myw1OSwyMjksMTA3LDk2LDExNiw3Myw2MywxNjAsMTUxLDE0MiwxMTIsOTUsMTIsMzUsMTE3LDI1MCw3MiwyMjEsMTc1LDU3LDIxNSwxMzksNDcsMTY5LDIzLDE3MywyMzIsMjAwLDE2NSwxNCwyMzcsNTYsMTUyLDIwMyw3LDEzOSwxMzQsMjQ5LDExMCwxNTMsMTYyLDY1LDIzNSw0MywxODIsMjIyLDE2NCwyMDcsNzQsMjQ5LDkwLDUxLDEzNiwyMjUsNTYsMTE5LDk1LDEzOCwxNjUsMjUsMTc3LDI1NCwyMjYsMjExLDg4LDI0MywxNiwxMDksODYsMTYxLDE0NywxNDQsMTM5LDE0NCw2LDcyLDQ0LDE2MywxMjAsNjEsMTk5LDk4LDEwNiwxMzMsMTg3LDEzMiwyMCwyNDQsMjcsMjM2LDIyOSwxOTcsMTE5LDE5NiwzNywxNDcsMTMwLDEzOSwyMzcsMTQ0LDE5MSwyMzMsMTY3LDEzMyw1MSwxNDYsMTEsMjA3LDYyLDE1NywxMzYsMzEsNzksMTYzLDQ4LDE4NCwxNTAsMjIyLDE1NCwyMCw3OCwyMzMsMjE2LDU1LDEzNCwxNzQsOTksMjIxLDgsOTQsMTQxLDE2Niw0NywxMzAsODksMjQ3LDIwMiwyMDMsMTIwLDk3LDEwMywyMTksMTA4LDQwLDUzLDEyNiwxODYsMywyMTksODYsODksMjM0LDE4Miw0Miw0OCwxNTIsMjAyLDYsMTMxLDE4NCwxMDUsNzIsOTMsMTA3LDIxNywxNzAsNzEsMTMwLDE4MywxMzYsMjU0LDEyMiw5OCwxNjQsNzUsMjM2LDE0NiwxMjcsMjcsMjYsMTQzLDExMiwxMTIsMjMyLDI0NCwxOSwxOTUsMjUzLDEwMywxODksNzgsMTI5LDIzMiwxNDcsMTg3LDk2LDQsMjMsMTQsMyw1MCwxMzMsOTMsMjMyLDI0NywyMDgsMjA1LDIsMywxLDAsMQ=='
};

let runtimeCapabilitiesPopulate = arg => {
  if (arg === 'node') return Promise.resolve(true);
  else return Promise.resolve(false);
};

let getHypertyOwnerPopulate = arg => {
  return 'user://google.com/testandthink123@gmail.com';
};

let coreDiscoveryPopulate = function(arg1, arg2) {
  return Promise.resolve({ dataObject: 'hyperty://h1.domain/h1' });
};

function log(f) {
  console.log(JSON.stringify(f));
}
