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
	before('Init structures before test', function(){
		crypto = new Crypto()
	});
	
	//note: new TextEncoder('utf-8').encode(s);
	//      new TextDecoder('utf-8').decode(s);
	
	it('Code and encode test', function(){ 
		let value = new Uint8Array([10, 15, 25, 55, 18, 4, 6]);
		let encodedValue = crypto.encode(value);
		let decodedValue = crypto.decode(encodedValue);
		expect(value).to.be.equalTo(decodedValue);
	});

	it('Test generated IVs', function(){
		let IV_1 = crypto.generateIV();
		let IV_2 = crypto.generateIV();
		expect(IV_1).to.be.ofSize(IV_SIZE);
		expect(IV_2).to.be.ofSize(IV_SIZE);
		expect(IV_1).not.to.be.equalTo(IV_2);
	});
	
	it('Test generated random values', function(){
		let rand_1 = crypto.generateRandom();
		let rand_2 = crypto.generateRandom();
		expect(rand_1).to.be.ofSize(RANDOM_VALUE_SIZE);
		expect(rand_2).to.be.ofSize(RANDOM_VALUE_SIZE);
		expect(rand_1).not.to.be.equalTo(rand_2);
	});
	
	it('Test generatePMS key', function(){
		let PMS_1 = crypto.generatePMS();
		let PMS_2 = crypto.generatePMS();
		expect(PMS_1).to.be.ofSize(PMS_SIZE);
		expect(PMS_2).to.be.ofSize(PMS_SIZE);
		expect(PMS_1).not.to.be.equalTo(PMS_2);
	});
	
	it('Test generateMasterSecret key', function(done){
		let oldKey = crypto.generateRandom();
		let seed = crypto.generateRandom();

		crypto.generateMasterSecret(oldKey, seed).then(key1 => {
			crypto.generateMasterSecret(oldKey, seed).then(key2 => {
				expect(key1).to.be.ofSize(PMS_SIZE);
				expect(key2).to.be.ofSize(PMS_SIZE);
				expect(key1).to.be.equalTo(key2);
			}).then(done, done);
		});
	});

	it('Test concatPMSwithRandoms key', function(){
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

	it('Test generateKeys', function(done){
		let secret = crypto.generateRandom();
		let seed = crypto.generateRandom();
		crypto.generateKeys(secret, seed).then(key1 => {
			crypto.generateKeys(secret, seed).then(key2 => {
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
			}).then(done, done);
		});
	});
	
	
	it('Test genereated keys pair with encrypt and decrypt data', function(done){
		crypto.generateRSAKeyPair().then(keyPair => {
			let data = new Uint8Array([0,1,2,3,4,5,6,7,8,9]);
			crypto.encryptRSA(keyPair.public, data).then(encryptedData => {
				crypto.decryptRSA(keyPair.private, encryptedData).then(decryptedData => {
					expect(data).to.be.equalTo(decryptedData);
				}).then(done, done);
			});
		});
	});
	
	it('Test AES algorithm', function(done){
		let AESKey = crypto.generateRandom();
		let IV = crypto.generateIV();
		expect(AESKey).to.be.ofSize(RANDOM_VALUE_SIZE);
		expect(IV).to.be.ofSize(IV_SIZE);
		let data = '0,1,2,3,4,5,6,7,8,9'
		crypto.encryptAES(AESKey, data, IV).then(encryptedData => {
			crypto.decryptAES(AESKey, encryptedData, IV).then(decryptedData => {
				expect(data).to.equal(decryptedData);
			}).then(done, done);
		});
	});
	
	//NOTE: encryptRSA and signRSA use different encode types (_utf8Encode vs. Uint8Array)
	it('Test genereated keys pair, signRSA and verifyRSA', function(done){
		crypto.generateRSAKeyPair().then(keyPair => {		
			let data = new Uint8Array([0,1,2,3,4,5,6,7,8,9]);
			crypto.signRSA(keyPair.private, data).then(signedData => {
				crypto.verifyRSA(keyPair.public, data, signedData).then(verificationResult => {
					assert.isTrue(verificationResult , 'The signitured is different');
				}).then(done, done);
			});
		});
	});
	
	it('Test hashHMAC and verifyHMAC', function(done){
		let key = crypto.generateRandom();
		let data = new Uint8Array([0,1,2,3,4,5,6,7,8,9]);
		crypto.hashHMAC(key, data).then(HMAC => {
			crypto.verifyHMAC(key, data, HMAC).then(verificationResult => {
				assert.isTrue(verificationResult , 'HMAC is different');
			}).then(done, done);
		});
	});
});


describe('Identity Module tests', function() {
  
	before('Init structures once before all tests', function(){
		crypto = new Crypto();
		hyperURL1 = 'hyperty://h1.domain/h1';
		hyperURL2 = 'hyperty://h2.domain/h2';
		runtimeURL = 'runtime://fake-runtime';
		idmURL = runtimeURL +  '/idm';
		objURL = 'resource://obj1';
		idpDomain = "google.com";
		idpDomainURL = "domain-idp://" + idpDomain;
		usernameHint = 'usernameHint';
		userEmail = "testandthink123@gmail.com";
		guiURL = runtimeURL + '/identity-gui';
		userURL = "user://google.com/testandthink123@gmail.com";
		idps = [{domain: 'google.com', type: 'idToken'}, 
				{domain: 'microsoft.com', type: 'idToken'},
				{domain: 'orange.fr', type: 'idToken'},
				{domain: 'slack.com', type: 'Legacy'}];
		cn = 'testandthink123';
		loginUrl = "https://accounts.google.com/o/oauth2/auth?scope=openid%20email%20profile&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com&redirect_uri=https://localhost&response_type=code token id_token&state=state&access_type=offline&nonce=NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTQ3LDc3LDE2MiwyMjUsNzYsMTE5LDM4LDI1MSw3MiwyMjcsNTIsMjA4LDE4MSwxODQsMTUzLDU4LDExOCwxNTksODUsOTksNzEsMTE4LDQzLDIzMiwxMTUsMTEsMTgwLDE2LDIwNCwyMTIsODgsMjUwLDIyOCw0NywxNDksMTExLDc4LDEzNCwxMjEsMjA1LDIxNiwxOTgsMTYsMTE5LDEwMywxNTQsMjM5LDE1NSwxMjMsMTk4LDUxLDE3Niw4NywxNTcsMjQ0LDE1MiwxMDUsMTIsMjA1LDg5LDI1MiwyNTIsNDgsMTU4LDE1OCwyOSwxNzYsMTAzLDE1MSwyMDQsNzgsMjEsODAsMTQzLDEyMCwxMDcsMjQ1LDI0NSwzLDkxLDIwNiwyNCwxMjAsNzMsMTgwLDEyOCwxNjAsMTA0LDIxNyw4OSwzOCwyMzEsMjksMjI3LDI1Myw0OCwyOSw4MywxMDksMTU0LDI2LDIxNSwxMzEsMjQxLDIzNyw1MCwxMzEsMjM0LDc4LDcwLDEzOCwyNDMsNSwyNTMsMTgyLDkxLDIyNSwxODIsMTgwLDUyLDE3LDE1LDEwOSwxMSwxMjYsOTUsMjE2LDM3LDIyNCwxNCwwLDIxNSwyMDQsNjEsMTU2LDIwNywxMzEsMTIxLDc2LDkzLDE2OCwxNTEsNDAsMTcsMTI0LDExMCw4MiwyMTksMjA1LDIxNSwyNDksMTcsMjA4LDk2LDExNCwxOTQsNjcsMjMsMTUsMjA2LDIyNiwxMzIsMTg0LDE0MSwxMTgsMTAsMTA1LDkyLDg3LDYwLDE3NiwxNTYsMTMxLDk0LDUyLDEwLDI0OCwyNTUsMjM5LDgsMTgxLDE3Myw2NywxODEsMjUsNzYsMjU1LDUzLDE3NSwxOCwxMzgsMTkwLDEyNCwxODIsMTU1LDE4LDE5OSwxMzIsNzUsMjMyLDUsMTU2LDE1MiwxODcsMTIyLDU4LDIzNiwxNTgsMTY3LDQ3LDE5MywxMzYsODIsMjM0LDIxMSwxNzYsODAsMTg1LDE3MSwxMjMsMCw2LDE5OCwyMTQsMjEsMTAzLDc4LDIyNywzNywxMDIsNjksMTYsNjAsOCwyMDMsNTQsMTc0LDE3MiwyMDksMTY0LDIyMSwyNywxNTUsODUsMTI2LDE1NSwyNDEsODMsMSwxMTgsMTE3LDIsMjM3LDEwMSw3MiwxMDcsMiwzLDEsMCwx";
		loginURLResponse = "https://localhost/#state=state&code=4/8HTc7jG3P6q3YwJQ5qAtwVRHXYvZakRLTINxxFJBBFM&access_token=ya29.GlvOBPazlCr7mGEJgoQnXlqSZIvlFDi6vRnGQP4yd-flNwoWZZqCNuMFcXTpgB7rLoNSPiW6Xz8zK1yRXCozWcHABAHzu8YqLD3HpmQNXaNEvnE13_8MuklNfy8K&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImU2YmEyOTY5NTU2NWY3ODQ3OTkwMWNmMzU5ZmQ2ZTliZGJiZDdjY2QifQ.eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NTkxMDUyOTU3NjE2ODc4ODkiLCJlbWFpbCI6InRlc3RhbmR0aGluazEyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjVkUnVaOXh5X3NxRm5ucVhMX3lkQ3ciLCJjX2hhc2giOiJJMldjY3U4SGZhenNSNkZpQXdoam9RIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFEzTERjM0xERTJNaXd5TWpVc056WXNNVEU1TERNNExESTFNU3czTWl3eU1qY3NOVElzTWpBNExERTRNU3d4T0RRc01UVXpMRFU0TERFeE9Dd3hOVGtzT0RVc09Ua3NOekVzTVRFNExEUXpMREl6TWl3eE1UVXNNVEVzTVRnd0xERTJMREl3TkN3eU1USXNPRGdzTWpVd0xESXlPQ3cwTnl3eE5Ea3NNVEV4TERjNExERXpOQ3d4TWpFc01qQTFMREl4Tml3eE9UZ3NNVFlzTVRFNUxERXdNeXd4TlRRc01qTTVMREUxTlN3eE1qTXNNVGs0TERVeExERTNOaXc0Tnl3eE5UY3NNalEwTERFMU1pd3hNRFVzTVRJc01qQTFMRGc1TERJMU1pd3lOVElzTkRnc01UVTRMREUxT0N3eU9Td3hOellzTVRBekxERTFNU3d5TURRc056Z3NNakVzT0RBc01UUXpMREV5TUN3eE1EY3NNalExTERJME5Td3pMRGt4TERJd05pd3lOQ3d4TWpBc056TXNNVGd3TERFeU9Dd3hOakFzTVRBMExESXhOeXc0T1N3ek9Dd3lNekVzTWprc01qSTNMREkxTXl3ME9Dd3lPU3c0TXl3eE1Ea3NNVFUwTERJMkxESXhOU3d4TXpFc01qUXhMREl6Tnl3MU1Dd3hNekVzTWpNMExEYzRMRGN3TERFek9Dd3lORE1zTlN3eU5UTXNNVGd5TERreExESXlOU3d4T0RJc01UZ3dMRFV5TERFM0xERTFMREV3T1N3eE1Td3hNallzT1RVc01qRTJMRE0zTERJeU5Dd3hOQ3d3TERJeE5Td3lNRFFzTmpFc01UVTJMREl3Tnl3eE16RXNNVEl4TERjMkxEa3pMREUyT0N3eE5URXNOREFzTVRjc01USTBMREV4TUN3NE1pd3lNVGtzTWpBMUxESXhOU3d5TkRrc01UY3NNakE0TERrMkxERXhOQ3d4T1RRc05qY3NNak1zTVRVc01qQTJMREl5Tml3eE16SXNNVGcwTERFME1Td3hNVGdzTVRBc01UQTFMRGt5TERnM0xEWXdMREUzTml3eE5UWXNNVE14TERrMExEVXlMREV3TERJME9Dd3lOVFVzTWpNNUxEZ3NNVGd4TERFM015dzJOeXd4T0RFc01qVXNOellzTWpVMUxEVXpMREUzTlN3eE9Dd3hNemdzTVRrd0xERXlOQ3d4T0RJc01UVTFMREU0TERFNU9Td3hNeklzTnpVc01qTXlMRFVzTVRVMkxERTFNaXd4T0Rjc01USXlMRFU0TERJek5pd3hOVGdzTVRZM0xEUTNMREU1TXl3eE16WXNPRElzTWpNMExESXhNU3d4TnpZc09EQXNNVGcxTERFM01Td3hNak1zTUN3MkxERTVPQ3d5TVRRc01qRXNNVEF6TERjNExESXlOeXd6Tnl3eE1ESXNOamtzTVRZc05qQXNPQ3d5TURNc05UUXNNVGMwTERFM01pd3lNRGtzTVRZMExESXlNU3d5Tnl3eE5UVXNPRFVzTVRJMkxERTFOU3d5TkRFc09ETXNNU3d4TVRnc01URTNMRElzTWpNM0xERXdNU3czTWl3eE1EY3NNaXd6TERFc01Dd3giLCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiY2YwYTMzZjY5OGRhN2M5ZmEwM2UxNmQ5Y2U5OWQ4NGUwNzk5ZWVhZiIsImlhdCI6MTUwNjA4NzI5NywiZXhwIjoxNTA2MDkwODk3fQ.pngFfaQ8u9PRYBJ986PyR5S3Qg9EqDU0Rn2ELikR9dh9bVeJBQgn-JLGMpu6lReNSuPDY-O0UTbgaIlGaz5-_HO4_mxZf8A8b0KbTsq9tBmO55PdjGTwc86BPSeWUcS_Y7J6Y09Oz6NN8nycNZAWANi2PJykLQu64RseIy5HJktrU6LODfDPNbQpi_qZLM0DNDRB8geKKu0k2V4BNB29aEOQTc0atjmVQBjDIkZAxbATx_BmXaG2AvomEUPhd9kIATu7u6ZE-NnrTQPYn6YOAK9rCIdb5A0-JHDkqIUXnJBbPpYr_RZmKQZgF1Jql6yH3QpAPG2-3TTVoyw_TRWJ-g&authuser=0&session_state=576b72758ecad0f00705f024a89f7f6d3a7d17dd..939b&prompt=consent";
		assertion_val = "eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqZGxZMkkxTkdObE56RmtOakU0WWpJNE16QmpZMlZqT1RreE9EZ3hPR1UzTXpneE1EQm1NbUVpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SW1Ka2FHVjJkVU0zU0RaNVpuSkpWakZEVURsdmFIY2lMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVZURk1SRWwzVFVOM2VFMXBkelZPUTNkNFQwUkZjMDFxUlRSTVJFVXlUbmwzZUUxVVozTk9SRkZ6VGxSUmMwMTZZM05OYWsxM1RFUkplVTVUZHpGUFEzZDRUMVJGYzAxVVdUUk1SRTB5VEVSTk1VeEVSVEZPVTNjMVRubDNNazlUZDNsTmFsVnpUVlJKZVV4RVozbE1SRVY2VFhsM01reEVTVEJPVTNkNlRYbDNlazE1ZDNsT1ZGRnpUVlJWZVV4RVJUVk5hWGQ0VFVSamMwMVVZek5NUkVWNlRtbDNNRTVwZDNwTVJHTnpUMVJuYzA1cVFYTk5la0Z6VGtSSmMwMXFRVFZNUkVVeVRsTjNlVTFVVlhOTlZGVXdURVJGTUUxNWQzaE9hbGx6VGtSQmMwNXFTWE5OVkVVelRFUlJla3hFU1RKTVJFbDVUbmwzTVU1RGQzaE5lbGx6VG1wVmMwOVVZM05OYVhjMFRubDNlRTE2WTNOT2VsRnpUVlJyZVV4RVdUUk1SRWwzVGtOM2VFOUVaM05OYWxGNlRFUkZkMDVEZDNoTmFrbHpUMVJqYzAxVVl6Tk1SRVY2VFZOM2VFOUVSWE5OVkdNMVRFUm5lRXhFVlhsTVJFVXhUa04zZVU1cGR6Sk1SRlY2VEVSamVFeEVhekZNUkVWNVRVTjNlVTFxV1hOTlZFRjNURVJKZVUxRGQzbE5SR3R6VFZSck1VeEVSVE5OVTNjeFRubDNlRTlFVFhOTmVsbHpUVlJaTlV4RVJUQk9VM2MxVDBOM2VFMUVXWE5OVkdkelRXcEJNa3hFUlRSTlEzZDRUVVJCYzAxVVdUTk1SRmw0VEVSRmQwNTVkekJOVTNkNlRrTjNlVXhFU1RCT2VYZDVUa1JSYzAxVVZYZE1SRVV5VG5sM2VVMUVVWE5OYWtVeVRFUlZOVXhFU1hsT2VYYzBURVJKTWt4RVZUTk1SRVUwVDFOM2VFNUVSWE5OVkdjMFRFUm5Na3hFU1hsT1UzZDRUVlJuYzAxVVJYaE1SRVV6VG5sM2VFOUVTWE5OVkdONFRFUkZOVXhFV1hkTVJFVTBUbmwzZUUxNlRYTk5hbEZ6VFZSWk1FeEVSVEJQUTNkNFQwUnJjMDlFVlhOTlZHTjZURVJGTlUxVGQzbE5WRWx6VFdwUk0weEVTWGROVTNkNFQwUkZjMDU2UlhOUFJHZHpUVlJGZVV4RVJUSlBRM2Q0VFhwRmMwMVVZekJNUkZrelRFUlpNRXhFUlRGUFUzZDVUVVJaYzAxVVVUTk1SRlV3VEVSVk1FeEVSVEJPZVhjMFRtbDNNVTlEZDNsTmFsVnpUV3ByYzAxNlFYTk5WRWwzVEVSSk1FNXBkM2hPYW1OelRucG5jMDU2UlhOTlZGRjVURVJKZVU5RGR6Uk5VM2Q1VFhwbmMwMVVRWHBNUkZsNVRFUkpNRTE1ZDNsT1JFVnpUV3BKTWt4RVJURk5hWGN5VFhsM2VFNXBkelZQUTNkNFRucE5jMDE2WTNOTlZHc3lURVJWZVV4RVZUUk1SRkUxVEVSRk5FMVRkekJPYVhkNFRrUnJjMDFVUVRSTVJFVXdUMU4zTUU5VGR6Tk1SR2Q2VEVSRmVFOURkM2xOYW10elRXcFZNRXhFU1hoT2VYZDRUbXBqYzAxVVdUTk1SRWw1VEVSSk1FNTVkM2hQVkZWelRWUkZlVXhFUlhoT1UzZDVUbFJCYzAxRGQzaE9WR056VFdwVmVFeEVSVE5QUTNkNVRVUnJjMDU2U1hOTlZGVTFURVJGZVU1NWQzaFBSRVZ6VFZSRmVVeEVUWGRNUkdNeFRFUnJjMDFxVFRKTVJFbDVURVJGZVUxcGR6Sk5RM2N4VDBOM2VFeEVSWGxPVTNkNVRXcEJjMDFxVFRGTVJFbDVUbE4zZVUxcVozTk5hbEY2VEVSSk1FNURkM2xOVkZselRWUkpkMHhFUlhkT2VYZDRUbXBCYzAxcVJYbE1SRVY1VGtOM2VVMXFWWE5PZWtWelRWUnJNMHhFVFRSTVJFVXpUVU4zZUUxcVRYTk5WRmswVEVSTk5VeEVUVEJNUkVVeVQxTjNlRTlFVVhOT1ZHZHpUVlJGZVV4RVozZE1SR014VEVSRk5VMURkM2xOUkdOelRWUmplVXhFU1hoTmVYZDVURVJOYzAxVGQzZE1SRVU5SWl3aWFYTnpJam9pYUhSMGNITTZMeTloWTJOdmRXNTBjeTVuYjI5bmJHVXVZMjl0SWl3aWFXRjBJam94TlRBMU5Ea3hOelF5TENKbGVIQWlPakUxTURVME9UVXpOREo5LktHYWp6N0NjamtPUnIxS055TFgwRHFXaVRRM2s3d2Q0NDRsU0RiSFYtRV9adHY0bzhDdVlTTVJQRU12eGtncG5PaDBGd241OWROd2F5LXdqSkFZZWhCVWpCdllQZHgzejMzZDF0Uk5OcTlBUV9NQXJqZGVqQnkxcFpkR1FaY1diRUpMSUtPYXZuNGs2LS1mb0M4OUdkXzI2aU9tV1A1ZE9BcjRRU0tyVlZyRURlNDNnQXZ0Mms5anVpaGFnX1B5U0ROMjZXbVJDTVY4N2lFY3lzS3JfTTlXVExYS3k2NWU5czloNEpQYmdqMzZvSllrX3Bpbmk0YlJ6MERCd0lOLVI5TlAtZmkyT2VlRFptbXd4YzJXdnd1c05yaFJZamxGMmNkMjZwUFhaeTlMWlZPTU1fRERoTVpsMVVMclJvZnVFT1BMVXEtWFZZV3lmUXRMZnBPRkthdyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJiZGhldnVDN0g2eWZySVYxQ1A5b2h3Iiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFUxTERJd01Dd3hNaXc1TkN3eE9ERXNNakU0TERFMk55d3hNVGdzTkRRc05UUXNNemNzTWpNd0xESXlOU3cxT0N3eE9URXNNVFk0TERNMkxETTFMREUxTlN3NU55dzJPU3d5TWpVc01USXlMRGd5TERFek15dzJMREkwTlN3ek15d3pNeXd5TlRRc01UVXlMREU1TWl3eE1EY3NNVGMzTERFek5pdzBOaXd6TERjc09UZ3NOakFzTXpBc05ESXNNakE1TERFMk5Td3lNVFVzTVRVMExERTBNeXd4TmpZc05EQXNOaklzTVRFM0xEUXpMREkyTERJeU55dzFOQ3d4TXpZc05qVXNPVGNzTWl3NE55d3hNemNzTnpRc01Ua3lMRFk0TERJd05Dd3hPRGdzTWpRekxERXdOQ3d4TWpJc09UY3NNVGMzTERFek1Td3hPREVzTVRjNUxEZ3hMRFV5TERFMU5Dd3lOaXcyTERVekxEY3hMRGsxTERFeU1Dd3lNallzTVRBd0xESXlNQ3d5TURrc01UazFMREUzTVN3MU55d3hPRE1zTXpZc01UWTVMREUwTlN3NU9Dd3hNRFlzTVRnc01qQTJMREU0TUN3eE1EQXNNVFkzTERZeExERXdOeXcwTVN3ek5Dd3lMREkwTnl3eU5EUXNNVFV3TERFMk55d3lNRFFzTWpFMkxEVTVMREl5Tnl3NExESTJMRFUzTERFNE9Td3hOREVzTVRnNExEZzJMREl5TlN3eE1UZ3NNVEV4TERFM055d3hPRElzTVRjeExERTVMRFl3TERFNE55d3hNek1zTWpRc01UWTBMREUwT0N3eE9Ea3NPRFVzTVRjekxERTVNU3d5TVRJc01qUTNMREl3TVN3eE9ERXNOekVzT0Rnc01URXlMREUyT0N3eE16RXNNVGMwTERZM0xEWTBMREUxT1N3eU1EWXNNVFEzTERVMExEVTBMREUwTnl3NE5pdzFPQ3d5TWpVc01qa3NNekFzTVRJd0xESTBOaXd4Tmpjc056Z3NOekVzTVRReUxESXlPQ3c0TVN3eU16Z3NNVEF6TERZeUxESTBNeXd5TkRFc01qSTJMREUxTWl3Mk15d3hOaXc1T0N3eE56TXNNemNzTVRrMkxEVXlMRFU0TERRNUxERTRNU3cwTml3eE5Ea3NNVEE0TERFME9TdzBPU3czTERnekxERXhPQ3d5TWprc01qVTBMREl4Tnl3eE5qY3NNVFkzTERJeUxESTBOeXd4T1RVc01URXlMREV4TlN3eU5UQXNNQ3d4TlRjc01qVXhMREUzT0N3eU1Ea3NOeklzTVRVNUxERXlOeXd4T0RFc01URXlMRE13TERjMUxEa3NNak0yTERJeUxERXlNaXcyTUN3MU9Dd3hMREV5TlN3eU1qQXNNak0xTERJeU5Td3lNamdzTWpRekxESTBOQ3d5TVRZc01USXdMREV3Tnl3eE5qQXNNakV5TERFeU5Dd3lNalVzTnpFc01UazNMRE00TERFM01Dd3hNak1zTVRZNExETTVMRE0wTERFMk9Td3hPRFFzTlRnc01URXlMRGd3TERjMUxERTVNQ3d5TURjc01UY3lMREl4TXl3eUxETXNNU3d3TERFPSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE1MDU0OTE3NDIiLCJleHAiOiIxNTA1NDk1MzQyIiwiYWxnIjoiUlMyNTYiLCJraWQiOiI3ZWNiNTRjZTcxZDYxOGIyODMwY2NlYzk5MTg4MThlNzM4MTAwZjJhIn19";

		handlers = handlersPopulate;
		msgNodeResponseFunc = msgNodeResponseFuncPopulate;
		coreDiscovery = coreDiscoveryPopulate;
		storageManager = runtimeFactory.storageManager();
		runtimeCapabilities = runtimeFactory.runtimeCapabilities(storageManager);
	});
	
	beforeEach('Init structures before each test', function(){
		bus = new MessageBus();
    bus.pipeline.handlers = handlersPopulate;
    bus._onPostMessage = (msg => {
      msgNodeResponseFunc(bus, msg);
    });
		
		let dataObjectsStorage = new DataObjectsStorage(storageManager, {});
		identityModule = new IdentityModule(runtimeURL, runtimeCapabilities, storageManager, dataObjectsStorage);
		identityModule.messageBus = bus;
		identityModule.registry = registryPopulate;;
		identityModule.coreDiscovery = coreDiscovery;
		
		let runtimeCoreCtx = new RuntimeCoreCtx(runtimeURL, identityModule, registryPopulate, storageManager, runtimeFactory.runtimeCapabilities());
		policyEngine = new PEP(runtimeCoreCtx);
	});

	it('Check GUI deployment', function(){
		identityModule.deployGUI();
		assert(identityModule.guiDeployed, 'IDM is not deployed');
	});

	it('Check Identities to Choose', function(){
		let idsToChoose = identityModule.getIdentitiesToChoose();
		expect(idsToChoose).to.have.property('identities');
		expect(idsToChoose).to.have.property('idps');
	});
	
	it('Check messageBus', function(){
		identityModule.messageBus = bus;
		assert.equal(bus, identityModule.messageBus, 'MessageBus content is different')
	});
	
	it('Check coreDiscovery', function(){
		identityModule.coreDiscovery = coreDiscovery;
		assert.equal(coreDiscovery, identityModule.coreDiscovery, 'CoreDiscovery  content is different')
	});
	
	it('Check registry', function(){
		assert.equal(registryPopulate, identityModule.registry, 'Registry count is different')
	});
	
	it('setCurrentIdentity/getCurrentIdentity', function(){
		identityModule.setCurrentIdentity(exampleIdentityBundle);
		assert.equal(exampleIdentityBundle, identityModule.getCurrentIdentity(), '(SET/GET)CurrentIdentity content is different')
	});

	it('test sendGenerateMessage', function(done){
		let contents = 'BASE64_CONTENT';
		let origin = hyperURL1;
		
		bus._onPostMessage = (msg => {
			let result = (msg.type === 'execute') &&
					 (msg.to === idpDomainURL) &&
					 (msg.from === idmURL) && 
					 (msg.body.resource === 'identity') && 
					 (msg.body.method === 'generateAssertion') &&
					 (msg.body.params.contents === contents) &&
					 (msg.body.params.origin === origin) &&
					 (msg.body.params.usernameHint === loginUrl);
			assert(result, 'Messege content is not the expected');	
			msgNodeResponseFunc(bus, msg);
		});
	
		identityModule.sendGenerateMessage(contents, origin, loginUrl, idpDomain).then(resMsg => {
			assert.equal(resMsg.assertion, assertion_val, 'Received messege is not OK');
		}).then(done,done);
	});	

	it('test requestIdentityToGUI', function(done){
		let identities = identityModule.getIdentitiesToChoose().identities;
		let idps = identityModule.getIdentitiesToChoose().idps;
		
		let that = this;
		bus._onPostMessage = (msg => {
			let result = (msg.type === 'create') &&
					 (msg.to === guiURL) &&
					 (msg.from === idmURL) && 
					 (msg.body.value.identities === identities) && 
					 (msg.body.value.idps === idps);
			msgNodeResponseFunc(bus, msg);
		});
		
		identityModule.deployGUI();
		identityModule.requestIdentityToGUI(identities, idps).then(resMsg => {
			assert.equal(resMsg.value, userEmail, 'Expected email was not found');
		}).then(done,done);
	});
	
	it('test getIdentities', function(done) {
		let returnedAssertionValue = returnedAssertionValuePopulate;
		crypto.generateRSAKeyPair().then( keyPair => {
			identityModule.storeIdentity(returnedAssertionValue, keyPair).then( result =>{
				let storedIDData = identityModule.getIdentities();
				assert(storedIDData[0].hasOwnProperty('assertion'), 'Identity was not found');
			}).then(done,done);
		});
	});
	
	it('test storeIdentity', function(done) {
		let returnedAssertionValue = returnedAssertionValuePopulate;
		crypto.generateRSAKeyPair().then( keyPair => {;
			identityModule.storeIdentity(returnedAssertionValue, keyPair).then( result =>{
				let hasAllRequiredFields = 
					result.hasOwnProperty("userProfile") &&
					result.hasOwnProperty("idp") &&
					result.hasOwnProperty("assertion") &&
					result.hasOwnProperty("expires");
				assert(hasAllRequiredFields, "Returned data has not all the expected fields");
				
				let storedIDData = identityModule.getIdentities();
				assert(storedIDData[0].hasOwnProperty("assertion"), 'Stored data is not the exprected one');
				assert.equal(identityModule.emailsList, userEmail);
			}).then(done,done);
		});
	});
	
	it('test unregisterIdentity', function(done) {
		let returnedAssertionValue = returnedAssertionValuePopulate;
		crypto.generateRSAKeyPair().then( keyPair => {;
			identityModule.storeIdentity(returnedAssertionValue, keyPair).then( result =>{
				assert.equal(identityModule.emailsList, userEmail);
				identityModule.unregisterIdentity(userEmail);
				assert.isEmpty(identityModule.emailsList, "Identity was not removed");
			}).then(done,done);
		});
	});

	it('test deleteIdentity', function(done) {
		let returnedAssertionValue = returnedAssertionValuePopulate;
		crypto.generateRSAKeyPair().then( keyPair => {;
			identityModule.storeIdentity(returnedAssertionValue, keyPair).then( result =>{
				assert.equal(identityModule.emailsList, userEmail);
				identityModule.deleteIdentity(userURL);
				assert.isEmpty(identityModule.emailsList, "Identity was not removed");
			}).then(done,done);
		});
	});


	it('test callIdentityModuleFunc', function(done){
		let methodName = 'openPopup';
		let parameters = {urlreceived: 'https://accounts.google.com/o/oauth2/auth?scope=openid%20email%20profile&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com&redirect_uri=https://localhost&response_type=code token id_token&state=state&access_type=offline&nonce=NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTQ3LDc3LDE2MiwyMjUsNzYsMTE5LDM4LDI1MSw3MiwyMjcsNTIsMjA4LDE4MSwxODQsMTUzLDU4LDExOCwxNTksODUsOTksNzEsMTE4LDQzLDIzMiwxMTUsMTEsMTgwLDE2LDIwNCwyMTIsODgsMjUwLDIyOCw0NywxNDksMTExLDc4LDEzNCwxMjEsMjA1LDIxNiwxOTgsMTYsMTE5LDEwMywxNTQsMjM5LDE1NSwxMjMsMTk4LDUxLDE3Niw4NywxNTcsMjQ0LDE1MiwxMDUsMTIsMjA1LDg5LDI1MiwyNTIsNDgsMTU4LDE1OCwyOSwxNzYsMTAzLDE1MSwyMDQsNzgsMjEsODAsMTQzLDEyMCwxMDcsMjQ1LDI0NSwzLDkxLDIwNiwyNCwxMjAsNzMsMTgwLDEyOCwxNjAsMTA0LDIxNyw4OSwzOCwyMzEsMjksMjI3LDI1Myw0OCwyOSw4MywxMDksMTU0LDI2LDIxNSwxMzEsMjQxLDIzNyw1MCwxMzEsMjM0LDc4LDcwLDEzOCwyNDMsNSwyNTMsMTgyLDkxLDIyNSwxODIsMTgwLDUyLDE3LDE1LDEwOSwxMSwxMjYsOTUsMjE2LDM3LDIyNCwxNCwwLDIxNSwyMDQsNjEsMTU2LDIwNywxMzEsMTIxLDc2LDkzLDE2OCwxNTEsNDAsMTcsMTI0LDExMCw4MiwyMTksMjA1LDIxNSwyNDksMTcsMjA4LDk2LDExNCwxOTQsNjcsMjMsMTUsMjA2LDIyNiwxMzIsMTg0LDE0MSwxMTgsMTAsMTA1LDkyLDg3LDYwLDE3NiwxNTYsMTMxLDk0LDUyLDEwLDI0OCwyNTUsMjM5LDgsMTgxLDE3Myw2NywxODEsMjUsNzYsMjU1LDUzLDE3NSwxOCwxMzgsMTkwLDEyNCwxODIsMTU1LDE4LDE5OSwxMzIsNzUsMjMyLDUsMTU2LDE1MiwxODcsMTIyLDU4LDIzNiwxNTgsMTY3LDQ3LDE5MywxMzYsODIsMjM0LDIxMSwxNzYsODAsMTg1LDE3MSwxMjMsMCw2LDE5OCwyMTQsMjEsMTAzLDc4LDIyNywzNywxMDIsNjksMTYsNjAsOCwyMDMsNTQsMTc0LDE3MiwyMDksMTY0LDIyMSwyNywxNTUsODUsMTI2LDE1NSwyNDEsODMsMSwxMTgsMTE3LDIsMjM3LDEwMSw3MiwxMDcsMiwzLDEsMCwx'};
		bus._onPostMessage = (msg => {
			let result = (msg.type === 'execute') &&
				 (msg.to === guiURL) &&
				 (msg.from === idmURL) && 
				 (msg.body.resource === 'identity') && 
				 (msg.body.method === methodName) &&
				 (msg.body.params === parameters);
			assert(result, 'Messege content is not the expected');
			msgNodeResponseFunc(bus, msg);		
			
		});
		identityModule.callIdentityModuleFunc(methodName, parameters).then( resCode => {
			assert.equal(resCode, loginUrl, 'Messege content is not the exepected');
		}).then(done, done);
	});

	it('test generateAssertion', function(done){
		crypto.generateRSAKeyPair().then( keyPair => {
			let contents = btoa(keyPair.public);
			let origin = 'undefined';
			bus._onPostMessage = (msg => {
				let result = (msg.type === 'execute') &&
						 (msg.to === idpDomainURL) &&
						 (msg.from === idmURL) && 
						 (msg.body.resource === 'identity') && 
						 (msg.body.method === 'generateAssertion') &&
						 (msg.body.params.contents === contents) &&
						 (msg.body.params.origin === origin) &&
						 (msg.body.params.usernameHint === loginUrl);
				assert(result, 'Messege content is not the expected');	
				msgNodeResponseFunc(bus, msg);
			});

			identityModule.generateAssertion(contents, origin, loginUrl, keyPair, idpDomain).then( result =>{
				let hasRequiredFields = result.hasOwnProperty('userProfile') &&
				result.hasOwnProperty('idp') &&
				result.hasOwnProperty('assertion');
				
				let hasRequiredData = (result.userProfile.username === userEmail) &&
				(result.userProfile.cn === cn) &&
				(result.userProfile.userURL === userURL);
				
				assert(hasRequiredFields && hasRequiredData, 'Received data has not the requiered properties');
			}).then(done,done);
		});
	});
	
	it('test callGenerateMethods', function(done){
		identityModule.callGenerateMethods(idpDomain).then( result => {
			let hasRequiredFields = result.hasOwnProperty('userProfile') &&
				result.hasOwnProperty('idp') &&
				result.hasOwnProperty('assertion');
				
				let hasRequiredData = (result.userProfile.username === userEmail) &&
				(result.userProfile.cn === cn) &&
				(result.userProfile.userURL === userURL);
				
				assert(hasRequiredFields && hasRequiredData, 'Received data has not the requiered properties');
		}).then(done,done);
	});

	it('test validateAssertion', function(done){
		identityModule.validateAssertion(assertion_val, undefined, idpDomain).then( result => {
      assert(result.hasOwnProperty('assertion'), 'Received data has not the requiered properties');
		}).then(done,done);
	});

	it('test loginSelectedIdentity', function(done){
		crypto.generateRSAKeyPair().then( keyPair => {
      
			identityModule.loginSelectedIdentity(assertion_val, hyperURL1, idpDomain, keyPair, loginUrl).then( result => {
				assert.fail('Method not implemented correctly');
			}).then(done, done);
		});
	});

	it('test generateSelectedIdentity', function(done){
		crypto.generateRSAKeyPair().then( keyPair => {

			identityModule.generateSelectedIdentity(assertion_val, hyperURL1, idpDomain, keyPair, loginUrl).then( result => {
				assert(result.hasOwnProperty('assertion'), 'Result does not have the required fields');
			}).then(done, done);
		});
	});

	it('test selectIdentityFromGUI', function(done){
		identityModule.selectIdentityFromGUI(undefined).then( result => {
			assert(result.hasOwnProperty('userProfile'), 'result does not have the required fields');
		}).then(done, done);
	});

	it('test selectIdentityForHyperty', function(done){ 
		identityModule.selectIdentityForHyperty(hyperURL1, idpDomain, '').then( resMsg => {
			assert(resMsg.hasOwnProperty('userProfile'), 'result does not have the required fields');
		}).then(done,done);
	});

	it('test encryptDataObject', function(done){
		let sender = 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a';
		let sessionKey = crypto.generateRandom();
		let dataObjectSessionKeys = {};
		dataObjectSessionKeys[sender] =  {sessionKey: sessionKey, isToEncrypt: true};
		storageManager.set('dataObjectSessionKeys', 0, dataObjectSessionKeys);
		
		identityModule.encryptDataObject(dataObjectValue, sender).then( encryDataObject => {
			let value = encryDataObject.hasOwnProperty('value') && encryDataObject.hasOwnProperty('iv');
			assert(value, 'Result does not have the required fields');
		}).then(done,done);
	});

	it('test encryptDataObject', function(done){
		let sender = 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a';
		let sessionKey = crypto.generateRandom();
		let dataObjectSessionKeys = {};
		dataObjectSessionKeys[sender] =  {sessionKey: sessionKey, isToEncrypt: true};
		storageManager.set('dataObjectSessionKeys', 0, dataObjectSessionKeys);
		
		identityModule.encryptDataObject(dataObjectValue, sender).then( encryDataObject => {
			identityModule.decryptDataObject(encryDataObject, sender).then( decryDataObject => {
				log(decryDataObject);
				let value = decryDataObject.value.data.content === dataObjectValue.data.content;
				assert(value, 'Decrypted data is not the same');
			}).then(done,done);
		});
	});

	it('test getIdentityAssertion', function(done){
    identityModule.runtimeCapabilities.isAvailable = runtimeCapabilitiesPopulate;
		identityModule.getIdentityAssertion(undefined).then(result => {
      log('asdf');
			assert(result.hasOwnProperty('userProfile'), 'Result does not contain the expected fields');
		}).then(done,done);
	});

	it('test getIdToken', function(done){
		let returnedAssertionValue = returnedAssertionValuePopulate;
		crypto.generateRSAKeyPair().then( keyPair => {
			identityModule.storeIdentity(returnedAssertionValue, keyPair).then( result =>{
				
				identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
				identityModule.getIdToken(hyperURL1).then(result => {
					assert(result.hasOwnProperty('userProfile'), 'Result does not contain the expected fields');
				}).then(done,done);
			});
		});
	});

	it('test _getValidToken', function(done){
		let returnedAssertionValue = returnedAssertionValuePopulate;
		crypto.generateRSAKeyPair().then( keyPair => {
			identityModule.storeIdentity(returnedAssertionValue, keyPair).then( result =>{
				
				identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
				identityModule._getValidToken(hyperURL1).then(result => {
					assert(result.hasOwnProperty('userProfile'), 'Result does not contain the expected fields');
				}).then(done,done);
			});
		});
	});

	it('test getToken', function(done){
		let returnedAssertionValue = returnedAssertionValuePopulate;
		crypto.generateRSAKeyPair().then( keyPair => {
			identityModule.storeIdentity(returnedAssertionValue, keyPair).then( result =>{
				
				identityModule.registry.getHypertyOwner = getHypertyOwnerPopulate;
				identityModule.registry.isLegacy = function (arg) {return Promise.resolve(false);};
				identityModule.getToken(hyperURL1, runtimeURL).then(result => {
					assert(result.hasOwnProperty('userProfile'), 'Result does not contain the expected fields');
				}).then(done,done);
			});
		});
	});

});


let runtimeCapabilitiesPopulate = (arg) => {
  return Promise.resolve(true)};

let getHypertyOwnerPopulate = (arg) => {
  return 'user://google.com/testandthink123@gmail.com';}

let msgNodeResponseFuncPopulate = (bus, msg) => {
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
	}
	else if(msg.type === 'execute'){
		log('msgNodeResponseFunc EXE');
		let resMsg = {
			id: msg.id,
			type: 'response',
			to: msg.from,
			from: msg.to,
			body: {					
				auth: false,
				code: 200,
				value : ''
			}   
		};
		log(resMsg);
		if(msg.body.method === 'generateAssertion' && msg.body.params.usernameHint != ''){
			log('msgNodeResponseFunc generateAssertion');
			if(msg.body.params.usernameHint == ''){
				log('msgNodeResponseFunc loginUrl');
				resMsg.body.value = {loginUrl: loginUrl};
			}else{
				log('msgNodeResponseFunc assertion_val');
				resMsg.body.value = returnedAssertionValuePopulate;
			}
		}else if(msg.body.method === 'openPopup'){
			log('msgNodeResponseFunc openPopup');
			resMsg.body.value = loginUrl;
 		}else if(msg.body.resource === 'identity'){
			log('msgNodeResponseFunc identity');
			resMsg.body.value = sendGenerateMessageResponse;
		}
		bus.postMessage(resMsg);
	}
	else if(msg.type === 'create'){
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
		log(resMsg)
	  bus.postMessage(resMsg);
	}
};

let registryPopulate = {
    registerDataObject: (objectRegistration) => {
      console.log('REGISTRY-OBJECT: ', objectRegistration);
      return new Promise((resolve) => {
        resolve('ok');
      });
    },

    isInterworkingProtoStub: (url) => {
      console.log('isInterworkingProtoStub: ', url);
      return false;
    },

    unregisterDataObject: (url) => {
      console.log('Unregister Data Object:', url);
      return true;
    },

    getPreAuthSubscribers: () => {
      return ['hyperty://domain/hyperty-instance'];
    },
    getHypertyName: () => {
      return 'HypertyChat';
    },
    isDataObjectURL: (dataObjectURL) => {
      let splitURL = dataObjectURL.split.skip('://');
      return splitURL[0] === 'comm';
    },
    registerSubscribedDataObject: () => {},
    registerSubscriber: () => {},
    isLocal: (url) => {
      console.log('isLocal: ', url);
      return false;
    },
    runtimeURL: runtimeURL
};

let catalogPopulate = {
    getDataSchemaDescriptor: (schema) => {
      console.log('REQUEST-SCHEMA: ', schema);
      return new Promise((resolve, reject) => {
        if (schema) {
          resolve({ sourcePackage: { sourceCode: {
            properties: {
              scheme: { constant: 'resource' },
              children: { constant: ['children1', 'children2'] }
            }
          }}});
        } else {
          reject('No schema provided');
        }
      });
    }
};

let handlersPopulate = [
  function(ctx) {
    policyEngine.authorise(ctx.msg).then(function(changedMgs) {
      changedMgs.body.identity = {
        userProfile: {
          userURL: 'user://user@domain.pt'
        }
      };
      ctx.msg = changedMgs;
      ctx.next();
    }).catch(function(reason) {
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
	assertion: "eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqZGxZMkkxTkdObE56RmtOakU0WWpJNE16QmpZMlZqT1RreE9EZ3hPR1UzTXpneE1EQm1NbUVpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SW1Ka2FHVjJkVU0zU0RaNVpuSkpWakZEVURsdmFIY2lMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVZURk1SRWwzVFVOM2VFMXBkelZPUTNkNFQwUkZjMDFxUlRSTVJFVXlUbmwzZUUxVVozTk9SRkZ6VGxSUmMwMTZZM05OYWsxM1RFUkplVTVUZHpGUFEzZDRUMVJGYzAxVVdUUk1SRTB5VEVSTk1VeEVSVEZPVTNjMVRubDNNazlUZDNsTmFsVnpUVlJKZVV4RVozbE1SRVY2VFhsM01reEVTVEJPVTNkNlRYbDNlazE1ZDNsT1ZGRnpUVlJWZVV4RVJUVk5hWGQ0VFVSamMwMVVZek5NUkVWNlRtbDNNRTVwZDNwTVJHTnpUMVJuYzA1cVFYTk5la0Z6VGtSSmMwMXFRVFZNUkVVeVRsTjNlVTFVVlhOTlZGVXdURVJGTUUxNWQzaE9hbGx6VGtSQmMwNXFTWE5OVkVVelRFUlJla3hFU1RKTVJFbDVUbmwzTVU1RGQzaE5lbGx6VG1wVmMwOVVZM05OYVhjMFRubDNlRTE2WTNOT2VsRnpUVlJyZVV4RVdUUk1SRWwzVGtOM2VFOUVaM05OYWxGNlRFUkZkMDVEZDNoTmFrbHpUMVJqYzAxVVl6Tk1SRVY2VFZOM2VFOUVSWE5OVkdNMVRFUm5lRXhFVlhsTVJFVXhUa04zZVU1cGR6Sk1SRlY2VEVSamVFeEVhekZNUkVWNVRVTjNlVTFxV1hOTlZFRjNURVJKZVUxRGQzbE5SR3R6VFZSck1VeEVSVE5OVTNjeFRubDNlRTlFVFhOTmVsbHpUVlJaTlV4RVJUQk9VM2MxVDBOM2VFMUVXWE5OVkdkelRXcEJNa3hFUlRSTlEzZDRUVVJCYzAxVVdUTk1SRmw0VEVSRmQwNTVkekJOVTNkNlRrTjNlVXhFU1RCT2VYZDVUa1JSYzAxVVZYZE1SRVV5VG5sM2VVMUVVWE5OYWtVeVRFUlZOVXhFU1hsT2VYYzBURVJKTWt4RVZUTk1SRVUwVDFOM2VFNUVSWE5OVkdjMFRFUm5Na3hFU1hsT1UzZDRUVlJuYzAxVVJYaE1SRVV6VG5sM2VFOUVTWE5OVkdONFRFUkZOVXhFV1hkTVJFVTBUbmwzZUUxNlRYTk5hbEZ6VFZSWk1FeEVSVEJQUTNkNFQwUnJjMDlFVlhOTlZHTjZURVJGTlUxVGQzbE5WRWx6VFdwUk0weEVTWGROVTNkNFQwUkZjMDU2UlhOUFJHZHpUVlJGZVV4RVJUSlBRM2Q0VFhwRmMwMVVZekJNUkZrelRFUlpNRXhFUlRGUFUzZDVUVVJaYzAxVVVUTk1SRlV3VEVSVk1FeEVSVEJPZVhjMFRtbDNNVTlEZDNsTmFsVnpUV3ByYzAxNlFYTk5WRWwzVEVSSk1FNXBkM2hPYW1OelRucG5jMDU2UlhOTlZGRjVURVJKZVU5RGR6Uk5VM2Q1VFhwbmMwMVVRWHBNUkZsNVRFUkpNRTE1ZDNsT1JFVnpUV3BKTWt4RVJURk5hWGN5VFhsM2VFNXBkelZQUTNkNFRucE5jMDE2WTNOTlZHc3lURVJWZVV4RVZUUk1SRkUxVEVSRk5FMVRkekJPYVhkNFRrUnJjMDFVUVRSTVJFVXdUMU4zTUU5VGR6Tk1SR2Q2VEVSRmVFOURkM2xOYW10elRXcFZNRXhFU1hoT2VYZDRUbXBqYzAxVVdUTk1SRWw1VEVSSk1FNTVkM2hQVkZWelRWUkZlVXhFUlhoT1UzZDVUbFJCYzAxRGQzaE9WR056VFdwVmVFeEVSVE5QUTNkNVRVUnJjMDU2U1hOTlZGVTFURVJGZVU1NWQzaFBSRVZ6VFZSRmVVeEVUWGRNUkdNeFRFUnJjMDFxVFRKTVJFbDVURVJGZVUxcGR6Sk5RM2N4VDBOM2VFeEVSWGxPVTNkNVRXcEJjMDFxVFRGTVJFbDVUbE4zZVUxcVozTk5hbEY2VEVSSk1FNURkM2xOVkZselRWUkpkMHhFUlhkT2VYZDRUbXBCYzAxcVJYbE1SRVY1VGtOM2VVMXFWWE5PZWtWelRWUnJNMHhFVFRSTVJFVXpUVU4zZUUxcVRYTk5WRmswVEVSTk5VeEVUVEJNUkVVeVQxTjNlRTlFVVhOT1ZHZHpUVlJGZVV4RVozZE1SR014VEVSRk5VMURkM2xOUkdOelRWUmplVXhFU1hoTmVYZDVURVJOYzAxVGQzZE1SRVU5SWl3aWFYTnpJam9pYUhSMGNITTZMeTloWTJOdmRXNTBjeTVuYjI5bmJHVXVZMjl0SWl3aWFXRjBJam94TlRBMU5Ea3hOelF5TENKbGVIQWlPakUxTURVME9UVXpOREo5LktHYWp6N0NjamtPUnIxS055TFgwRHFXaVRRM2s3d2Q0NDRsU0RiSFYtRV9adHY0bzhDdVlTTVJQRU12eGtncG5PaDBGd241OWROd2F5LXdqSkFZZWhCVWpCdllQZHgzejMzZDF0Uk5OcTlBUV9NQXJqZGVqQnkxcFpkR1FaY1diRUpMSUtPYXZuNGs2LS1mb0M4OUdkXzI2aU9tV1A1ZE9BcjRRU0tyVlZyRURlNDNnQXZ0Mms5anVpaGFnX1B5U0ROMjZXbVJDTVY4N2lFY3lzS3JfTTlXVExYS3k2NWU5czloNEpQYmdqMzZvSllrX3Bpbmk0YlJ6MERCd0lOLVI5TlAtZmkyT2VlRFptbXd4YzJXdnd1c05yaFJZamxGMmNkMjZwUFhaeTlMWlZPTU1fRERoTVpsMVVMclJvZnVFT1BMVXEtWFZZV3lmUXRMZnBPRkthdyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJiZGhldnVDN0g2eWZySVYxQ1A5b2h3Iiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFUxTERJd01Dd3hNaXc1TkN3eE9ERXNNakU0TERFMk55d3hNVGdzTkRRc05UUXNNemNzTWpNd0xESXlOU3cxT0N3eE9URXNNVFk0TERNMkxETTFMREUxTlN3NU55dzJPU3d5TWpVc01USXlMRGd5TERFek15dzJMREkwTlN3ek15d3pNeXd5TlRRc01UVXlMREU1TWl3eE1EY3NNVGMzTERFek5pdzBOaXd6TERjc09UZ3NOakFzTXpBc05ESXNNakE1TERFMk5Td3lNVFVzTVRVMExERTBNeXd4TmpZc05EQXNOaklzTVRFM0xEUXpMREkyTERJeU55dzFOQ3d4TXpZc05qVXNPVGNzTWl3NE55d3hNemNzTnpRc01Ua3lMRFk0TERJd05Dd3hPRGdzTWpRekxERXdOQ3d4TWpJc09UY3NNVGMzTERFek1Td3hPREVzTVRjNUxEZ3hMRFV5TERFMU5Dd3lOaXcyTERVekxEY3hMRGsxTERFeU1Dd3lNallzTVRBd0xESXlNQ3d5TURrc01UazFMREUzTVN3MU55d3hPRE1zTXpZc01UWTVMREUwTlN3NU9Dd3hNRFlzTVRnc01qQTJMREU0TUN3eE1EQXNNVFkzTERZeExERXdOeXcwTVN3ek5Dd3lMREkwTnl3eU5EUXNNVFV3TERFMk55d3lNRFFzTWpFMkxEVTVMREl5Tnl3NExESTJMRFUzTERFNE9Td3hOREVzTVRnNExEZzJMREl5TlN3eE1UZ3NNVEV4TERFM055d3hPRElzTVRjeExERTVMRFl3TERFNE55d3hNek1zTWpRc01UWTBMREUwT0N3eE9Ea3NPRFVzTVRjekxERTVNU3d5TVRJc01qUTNMREl3TVN3eE9ERXNOekVzT0Rnc01URXlMREUyT0N3eE16RXNNVGMwTERZM0xEWTBMREUxT1N3eU1EWXNNVFEzTERVMExEVTBMREUwTnl3NE5pdzFPQ3d5TWpVc01qa3NNekFzTVRJd0xESTBOaXd4Tmpjc056Z3NOekVzTVRReUxESXlPQ3c0TVN3eU16Z3NNVEF6TERZeUxESTBNeXd5TkRFc01qSTJMREUxTWl3Mk15d3hOaXc1T0N3eE56TXNNemNzTVRrMkxEVXlMRFU0TERRNUxERTRNU3cwTml3eE5Ea3NNVEE0TERFME9TdzBPU3czTERnekxERXhPQ3d5TWprc01qVTBMREl4Tnl3eE5qY3NNVFkzTERJeUxESTBOeXd4T1RVc01URXlMREV4TlN3eU5UQXNNQ3d4TlRjc01qVXhMREUzT0N3eU1Ea3NOeklzTVRVNUxERXlOeXd4T0RFc01URXlMRE13TERjMUxEa3NNak0yTERJeUxERXlNaXcyTUN3MU9Dd3hMREV5TlN3eU1qQXNNak0xTERJeU5Td3lNamdzTWpRekxESTBOQ3d5TVRZc01USXdMREV3Tnl3eE5qQXNNakV5TERFeU5Dd3lNalVzTnpFc01UazNMRE00TERFM01Dd3hNak1zTVRZNExETTVMRE0wTERFMk9Td3hPRFFzTlRnc01URXlMRGd3TERjMUxERTVNQ3d5TURjc01UY3lMREl4TXl3eUxETXNNU3d3TERFPSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE1MDU0OTE3NDIiLCJleHAiOiIxNTA1NDk1MzQyIiwiYWxnIjoiUlMyNTYiLCJraWQiOiI3ZWNiNTRjZTcxZDYxOGIyODMwY2NlYzk5MTg4MThlNzM4MTAwZjJhIn19",
	identity: "user://google.com/testandthink123@gmail.com",
	idp: {
		domain: "google.com",
		protocol: "OIDC"},
	info: {
		accessToken: "ya29.GlvHBPvz5L_9BXW-Bur0qZT7PIcQTEHVqtVexuyy9nk6C…RDnHKbHMj209B26C4sHaa3Q89dbE5SOebteYb8o8mUxsjA5sF",
		idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdlY2I1NGNlNzFkNjE4Yj…PXZy9LZVOMM_DDhMZl1ULrRofuEOPLUq-XVYWyfQtLfpOFKaw",
		refreshToken: "1/mbg9sQp1fhrnH8IkglzzkGsl9nTgU__BTyp7lcdmBA4",
		tokenType: "Bearer",
		infoToken: {
		sub: "117959105295761687889", 
		name: "test think", 
		given_name: "test", 
		family_name: "think", 
		picture: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"},
		keyPair: {
			public: new Uint8Array(294),
			private: new Uint8Array(1218)},
		messageInfo: {
			userProfile: 'userProfile',
			idp: "google.com",
			assertion: "assertion_repeated",
			expires: "1505495342"
		}
	}
}
		
let sendGenerateMessageResponse = { 
  assertion: 'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqZGxZMkkxTkdObE56RmtOakU0WWpJNE16QmpZMlZqT1RreE9EZ3hPR1UzTXpneE1EQm1NbUVpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TVRjNU5Ua3hNRFV5T1RVM05qRTJPRGM0T0RraUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhekV5TTBCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SW1Ka2FHVjJkVU0zU0RaNVpuSkpWakZEVURsdmFIY2lMQ0p1YjI1alpTSTZJazVFWjNOTlZFMTNURVJGYzAxNlVYTk9SR2R6VFZSTmMwNXBkelZNUkZGNVRFUkZlazVEZHpOTmFYZDRUWHBSYzAxcVVUTk1SRVY2VEVSRmMwMVRkM2hNUkZWelRVTjNla3hFUlhwTlEzZDRURVJGTVV4RVFYTk9SR2R6VFZSTmQweEVSWE5OVkVGelRXbDNlRTE2UVhOTlUzZDRURVJCYzAxVVZURk1SRWwzVFVOM2VFMXBkelZPUTNkNFQwUkZjMDFxUlRSTVJFVXlUbmwzZUUxVVozTk9SRkZ6VGxSUmMwMTZZM05OYWsxM1RFUkplVTVUZHpGUFEzZDRUMVJGYzAxVVdUUk1SRTB5VEVSTk1VeEVSVEZPVTNjMVRubDNNazlUZDNsTmFsVnpUVlJKZVV4RVozbE1SRVY2VFhsM01reEVTVEJPVTNkNlRYbDNlazE1ZDNsT1ZGRnpUVlJWZVV4RVJUVk5hWGQ0VFVSamMwMVVZek5NUkVWNlRtbDNNRTVwZDNwTVJHTnpUMVJuYzA1cVFYTk5la0Z6VGtSSmMwMXFRVFZNUkVVeVRsTjNlVTFVVlhOTlZGVXdURVJGTUUxNWQzaE9hbGx6VGtSQmMwNXFTWE5OVkVVelRFUlJla3hFU1RKTVJFbDVUbmwzTVU1RGQzaE5lbGx6VG1wVmMwOVVZM05OYVhjMFRubDNlRTE2WTNOT2VsRnpUVlJyZVV4RVdUUk1SRWwzVGtOM2VFOUVaM05OYWxGNlRFUkZkMDVEZDNoTmFrbHpUMVJqYzAxVVl6Tk1SRVY2VFZOM2VFOUVSWE5OVkdNMVRFUm5lRXhFVlhsTVJFVXhUa04zZVU1cGR6Sk1SRlY2VEVSamVFeEVhekZNUkVWNVRVTjNlVTFxV1hOTlZFRjNURVJKZVUxRGQzbE5SR3R6VFZSck1VeEVSVE5OVTNjeFRubDNlRTlFVFhOTmVsbHpUVlJaTlV4RVJUQk9VM2MxVDBOM2VFMUVXWE5OVkdkelRXcEJNa3hFUlRSTlEzZDRUVVJCYzAxVVdUTk1SRmw0VEVSRmQwNTVkekJOVTNkNlRrTjNlVXhFU1RCT2VYZDVUa1JSYzAxVVZYZE1SRVV5VG5sM2VVMUVVWE5OYWtVeVRFUlZOVXhFU1hsT2VYYzBURVJKTWt4RVZUTk1SRVUwVDFOM2VFNUVSWE5OVkdjMFRFUm5Na3hFU1hsT1UzZDRUVlJuYzAxVVJYaE1SRVV6VG5sM2VFOUVTWE5OVkdONFRFUkZOVXhFV1hkTVJFVTBUbmwzZUUxNlRYTk5hbEZ6VFZSWk1FeEVSVEJQUTNkNFQwUnJjMDlFVlhOTlZHTjZURVJGTlUxVGQzbE5WRWx6VFdwUk0weEVTWGROVTNkNFQwUkZjMDU2UlhOUFJHZHpUVlJGZVV4RVJUSlBRM2Q0VFhwRmMwMVVZekJNUkZrelRFUlpNRXhFUlRGUFUzZDVUVVJaYzAxVVVUTk1SRlV3VEVSVk1FeEVSVEJPZVhjMFRtbDNNVTlEZDNsTmFsVnpUV3ByYzAxNlFYTk5WRWwzVEVSSk1FNXBkM2hPYW1OelRucG5jMDU2UlhOTlZGRjVURVJKZVU5RGR6Uk5VM2Q1VFhwbmMwMVVRWHBNUkZsNVRFUkpNRTE1ZDNsT1JFVnpUV3BKTWt4RVJURk5hWGN5VFhsM2VFNXBkelZQUTNkNFRucE5jMDE2WTNOTlZHc3lURVJWZVV4RVZUUk1SRkUxVEVSRk5FMVRkekJPYVhkNFRrUnJjMDFVUVRSTVJFVXdUMU4zTUU5VGR6Tk1SR2Q2VEVSRmVFOURkM2xOYW10elRXcFZNRXhFU1hoT2VYZDRUbXBqYzAxVVdUTk1SRWw1VEVSSk1FNTVkM2hQVkZWelRWUkZlVXhFUlhoT1UzZDVUbFJCYzAxRGQzaE9WR056VFdwVmVFeEVSVE5QUTNkNVRVUnJjMDU2U1hOTlZGVTFURVJGZVU1NWQzaFBSRVZ6VFZSRmVVeEVUWGRNUkdNeFRFUnJjMDFxVFRKTVJFbDVURVJGZVUxcGR6Sk5RM2N4VDBOM2VFeEVSWGxPVTNkNVRXcEJjMDFxVFRGTVJFbDVUbE4zZVUxcVozTk5hbEY2VEVSSk1FNURkM2xOVkZselRWUkpkMHhFUlhkT2VYZDRUbXBCYzAxcVJYbE1SRVY1VGtOM2VVMXFWWE5PZWtWelRWUnJNMHhFVFRSTVJFVXpUVU4zZUUxcVRYTk5WRmswVEVSTk5VeEVUVEJNUkVVeVQxTjNlRTlFVVhOT1ZHZHpUVlJGZVV4RVozZE1SR014VEVSRk5VMURkM2xOUkdOelRWUmplVXhFU1hoTmVYZDVURVJOYzAxVGQzZE1SRVU5SWl3aWFYTnpJam9pYUhSMGNITTZMeTloWTJOdmRXNTBjeTVuYjI5bmJHVXVZMjl0SWl3aWFXRjBJam94TlRBMU5Ea3hOelF5TENKbGVIQWlPakUxTURVME9UVXpOREo5LktHYWp6N0NjamtPUnIxS055TFgwRHFXaVRRM2s3d2Q0NDRsU0RiSFYtRV9adHY0bzhDdVlTTVJQRU12eGtncG5PaDBGd241OWROd2F5LXdqSkFZZWhCVWpCdllQZHgzejMzZDF0Uk5OcTlBUV9NQXJqZGVqQnkxcFpkR1FaY1diRUpMSUtPYXZuNGs2LS1mb0M4OUdkXzI2aU9tV1A1ZE9BcjRRU0tyVlZyRURlNDNnQXZ0Mms5anVpaGFnX1B5U0ROMjZXbVJDTVY4N2lFY3lzS3JfTTlXVExYS3k2NWU5czloNEpQYmdqMzZvSllrX3Bpbmk0YlJ6MERCd0lOLVI5TlAtZmkyT2VlRFptbXd4YzJXdnd1c05yaFJZamxGMmNkMjZwUFhaeTlMWlZPTU1fRERoTVpsMVVMclJvZnVFT1BMVXEtWFZZV3lmUXRMZnBPRkthdyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNzk1OTEwNTI5NTc2MTY4Nzg4OSIsImVtYWlsIjoidGVzdGFuZHRoaW5rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiJiZGhldnVDN0g2eWZySVYxQ1A5b2h3Iiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVFUxTERJd01Dd3hNaXc1TkN3eE9ERXNNakU0TERFMk55d3hNVGdzTkRRc05UUXNNemNzTWpNd0xESXlOU3cxT0N3eE9URXNNVFk0TERNMkxETTFMREUxTlN3NU55dzJPU3d5TWpVc01USXlMRGd5TERFek15dzJMREkwTlN3ek15d3pNeXd5TlRRc01UVXlMREU1TWl3eE1EY3NNVGMzTERFek5pdzBOaXd6TERjc09UZ3NOakFzTXpBc05ESXNNakE1TERFMk5Td3lNVFVzTVRVMExERTBNeXd4TmpZc05EQXNOaklzTVRFM0xEUXpMREkyTERJeU55dzFOQ3d4TXpZc05qVXNPVGNzTWl3NE55d3hNemNzTnpRc01Ua3lMRFk0TERJd05Dd3hPRGdzTWpRekxERXdOQ3d4TWpJc09UY3NNVGMzTERFek1Td3hPREVzTVRjNUxEZ3hMRFV5TERFMU5Dd3lOaXcyTERVekxEY3hMRGsxTERFeU1Dd3lNallzTVRBd0xESXlNQ3d5TURrc01UazFMREUzTVN3MU55d3hPRE1zTXpZc01UWTVMREUwTlN3NU9Dd3hNRFlzTVRnc01qQTJMREU0TUN3eE1EQXNNVFkzTERZeExERXdOeXcwTVN3ek5Dd3lMREkwTnl3eU5EUXNNVFV3TERFMk55d3lNRFFzTWpFMkxEVTVMREl5Tnl3NExESTJMRFUzTERFNE9Td3hOREVzTVRnNExEZzJMREl5TlN3eE1UZ3NNVEV4TERFM055d3hPRElzTVRjeExERTVMRFl3TERFNE55d3hNek1zTWpRc01UWTBMREUwT0N3eE9Ea3NPRFVzTVRjekxERTVNU3d5TVRJc01qUTNMREl3TVN3eE9ERXNOekVzT0Rnc01URXlMREUyT0N3eE16RXNNVGMwTERZM0xEWTBMREUxT1N3eU1EWXNNVFEzTERVMExEVTBMREUwTnl3NE5pdzFPQ3d5TWpVc01qa3NNekFzTVRJd0xESTBOaXd4Tmpjc056Z3NOekVzTVRReUxESXlPQ3c0TVN3eU16Z3NNVEF6TERZeUxESTBNeXd5TkRFc01qSTJMREUxTWl3Mk15d3hOaXc1T0N3eE56TXNNemNzTVRrMkxEVXlMRFU0TERRNUxERTRNU3cwTml3eE5Ea3NNVEE0TERFME9TdzBPU3czTERnekxERXhPQ3d5TWprc01qVTBMREl4Tnl3eE5qY3NNVFkzTERJeUxESTBOeXd4T1RVc01URXlMREV4TlN3eU5UQXNNQ3d4TlRjc01qVXhMREUzT0N3eU1Ea3NOeklzTVRVNUxERXlOeXd4T0RFc01URXlMRE13TERjMUxEa3NNak0yTERJeUxERXlNaXcyTUN3MU9Dd3hMREV5TlN3eU1qQXNNak0xTERJeU5Td3lNamdzTWpRekxESTBOQ3d5TVRZc01USXdMREV3Tnl3eE5qQXNNakV5TERFeU5Dd3lNalVzTnpFc01UazNMRE00TERFM01Dd3hNak1zTVRZNExETTVMRE0wTERFMk9Td3hPRFFzTlRnc01URXlMRGd3TERjMUxERTVNQ3d5TURjc01UY3lMREl4TXl3eUxETXNNU3d3TERFPSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6IjE1MDU0OTE3NDIiLCJleHAiOiIxNTA1NDk1MzQyIiwiYWxnIjoiUlMyNTYiLCJraWQiOiI3ZWNiNTRjZTcxZDYxOGIyODMwY2NlYzk5MTg4MThlNzM4MTAwZjJhIn19',  idp: { domain: 'google.com', protocol: 'OIDC' },  info:    { accessToken: 'ya29.GlvSBDbUICOGwVGCW4IJz1wS3e5HBDW9sXnuGFgWPKHPHsU6zFIbNL8Z31CoCd93gav7cKQ8axhIASk1DdsA1MCxABFnJDTz1aXLmdyGFtLa9bO9JTNLv2DLawdr',     idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNiMGZjMTE5NjJhZDE2ZTQ5ZDU1YTI2ODE2YzVhZDBkM2Y2YjhhODMifQ.eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NTkxMDUyOTU3NjE2ODc4ODkiLCJlbWFpbCI6InRlc3RhbmR0aGluazEyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImtnNkpEdTJyMDRpNVZHSlBkSWlnUFEiLCJub25jZSI6Ik5EZ3NNVE13TERFc016UXNORGdzTVRNc05pdzVMRFF5TERFek5DdzNNaXd4TXpRc01qUTNMREV6TERFc01Td3hMRFVzTUN3ekxERXpNQ3d4TERFMUxEQXNORGdzTVRNd0xERXNNVEFzTWl3eE16QXNNU3d4TERBc01UY3lMREU1TkN3eU16Y3NNakV5TERFek5DdzROU3d5TWpFc01qRXlMREV4Tnl3eE16TXNNVGN3TERnMExESXdOaXcyT1N3eE5ERXNNemNzTWpVMExESXhOaXd4Tmprc016RXNOak1zT1RFc01URTFMREV6T1N3MU1pd3lNVFlzTWpJNUxESXlOaXd4TXl3NU9Td3hOamNzTVRnMUxERXlNQ3d5TVRNc01USXlMREl5Tml3eU1UQXNNVEUwTERJME1Td3hOak1zTVRBMkxERXhNQ3d5TXpjc05ETXNNak16TERreExESTFNQ3d5TWpNc01qSTFMREV3Tml3NE1pd3hOVFVzTlN3eU16WXNNVGsyTERFMU1Dd3lNakVzTVRjc01USTRMREl6TERFNE5Dd3hNekVzT1RRc01Ua3dMRFU0TERJME9Td3hOemdzTVRBM0xERTVNaXd6TlN3NE5Td3hPRE1zTWpFeUxESTBPU3d5TkRFc01qUTJMRFV3TERBc016Y3NNVEkyTERFeE1pd3hOaXd5TXpBc01qRXlMREl6TERFek9Td3hPVGdzTnpRc01qRTRMREUxTXl3eE56Z3NNVFF3TERReExERTROaXd5TXpJc05qUXNNakk1TERRc01qSXhMRFkxTERFMExERTRNQ3d6TlN3eE16VXNOamtzTVRNc01qTXhMREk0TERJeE1DdzFNeXd4TVRnc01UWTRMREUyTVN3ek9DdzBNaXd4TkRjc01UUTFMRGcyTERJd055d3lOQ3c1TUN3eU1qWXNNVFVzTWpBNUxEZzVMREU0TXl3eE1EY3NNVFkwTERFMUxESXdNaXd5TkRJc056SXNNVGd4TERJeU5Td3lOVEFzTVRJeUxERTFPQ3c1TUN3eE5qa3NNak0xTERFek5DdzBOQ3d4TWl3MU1Td3lORFVzTVRRd0xEa3lMRGMxTERFeU9TdzNPU3d5TXpBc01qTTNMREUyTVN3eE9UTXNNVFF5TERFMU1pdzVMREl5TVN3ME1pd3hOelFzT1Rjc01qQTVMREV4Tnl3eE9UTXNNVElzT1RNc01UWXhMREl4Tnl3eU5ERXNNVGs0TERFd09Dd3hPRFlzTWprc01Ua3pMREV5TVN3NE15d3hNRGtzTWpJMkxERTVNeXd4TlRBc01UZ3pMRE0wTERFNUxEazFMREV4TWl3M05Dd3lNekFzT1RRc01UQTJMREUxTVN3ME1Dd3lNak1zTWpFNExESXlPQ3d6TERJMU15d3lNVGtzTmpZc09Dd3hPVEVzTkRjc01UTXdMREl3TUN3eU1qWXNNVE0zTERreUxESXdNaXd4TURJc05EY3NNakF3TERFeE15dzJOeXd4TlRZc09ETXNNVGsxTERJd01Td3lNeklzTWpJMUxEazJMREl3TXl3NE1Td3lNVE1zTVRJd0xEZzVMREV4TWl3eE9UTXNNalFzTnpjc01UWXpMREUzTkN3eUxESXdNU3d4TXpBc01UY3dMREl4T0N3Mk5pd3hNak1zTVRFNUxEZ3pMREl4T1N3d0xETXlMRFl4TERVd0xESXpNQ3d4TWpjc01qa3NNakE0TERJeE1Dd3lNamNzTWpFM0xEZzVMREUxTkN3eU16QXNOVGdzTnprc01pd3pMREVzTUN3eCIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwNjQ0NzA0NywiZXhwIjoxNTA2NDUwNjQ3fQ.pY0BZZHSMWyL4UE8sclEb-FglzmOuh8kHykFkGTUfxgdb7bAY7bVtTQWlN05dhMs5QncAjsKExEuoLoH0vqYKOWEsXM_oTnu59NY2JPiEYZOo-v5wsc7on3G_CF0E5BGYhG-fDpbmi3qbin-i-drDyOjWMC3jK1CngMT7G1ElW_x2W8-UfrcfGkIzdW11Iul-79prZ1OzNMoPI06aaAtxyd5-6_O2-jaKlKGGfqIGlV_cFnMuIW6tWONzmSY-XnKtUKMPOctLVGLYJI9l8e2D4e7NmXVZz7lum7KmCzJvrRq0T4dOy5j_CaSmyA26SJcmRbRn940THU7S5BuavBCjQ',     
  refreshToken: undefined,
  tokenType: 'Bearer',     
  infoToken:       { 
    sub: '117959105295761687889',        
    name: 'test think',        
    given_name: 'test',        
    family_name: 'think',        
    picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
    email: 'testandthink123@gmail.com',        
    email_verified: true,        
    locale: 'en' },     
  tokenIDJSON:       
    {azp: '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',        
    aud: '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',        
    sub: '117959105295761687889',        
    email: 'testandthink123@gmail.com',        
    email_verified: 'true',        
    at_hash: 'kg6JDu2r04i5VGJPdIigPQ',        
    nonce: 'NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTcyLDE5NCwyMzcsMjEyLDEzNCw4NSwyMjEsMjEyLDExNywxMzMsMTcwLDg0LDIwNiw2OSwxNDEsMzcsMjU0LDIxNiwxNjksMzEsNjMsOTEsMTE1LDEzOSw1MiwyMTYsMjI5LDIyNiwxMyw5OSwxNjcsMTg1LDEyMCwyMTMsMTIyLDIyNiwyMTAsMTE0LDI0MSwxNjMsMTA2LDExMCwyMzcsNDMsMjMzLDkxLDI1MCwyMjMsMjI1LDEwNiw4MiwxNTUsNSwyMzYsMTk2LDE1MCwyMjEsMTcsMTI4LDIzLDE4NCwxMzEsOTQsMTkwLDU4LDI0OSwxNzgsMTA3LDE5MiwzNSw4NSwxODMsMjEyLDI0OSwyNDEsMjQ2LDUwLDAsMzcsMTI2LDExMiwxNiwyMzAsMjEyLDIzLDEzOSwxOTgsNzQsMjE4LDE1MywxNzgsMTQwLDQxLDE4NiwyMzIsNjQsMjI5LDQsMjIxLDY1LDE0LDE4MCwzNSwxMzUsNjksMTMsMjMxLDI4LDIxMCw1MywxMTgsMTY4LDE2MSwzOCw0MiwxNDcsMTQ1LDg2LDIwNywyNCw5MCwyMjYsMTUsMjA5LDg5LDE4MywxMDcsMTY0LDE1LDIwMiwyNDIsNzIsMTgxLDIyNSwyNTAsMTIyLDE1OCw5MCwxNjksMjM1LDEzNCw0NCwxMiw1MSwyNDUsMTQwLDkyLDc1LDEyOSw3OSwyMzAsMjM3LDE2MSwxOTMsMTQyLDE1Miw5LDIyMSw0MiwxNzQsOTcsMjA5LDExNywxOTMsMTIsOTMsMTYxLDIxNywyNDEsMTk4LDEwOCwxODYsMjksMTkzLDEyMSw4MywxMDksMjI2LDE5MywxNTAsMTgzLDM0LDE5LDk1LDExMiw3NCwyMzAsOTQsMTA2LDE1MSw0MCwyMjMsMjE4LDIyOCwzLDI1MywyMTksNjYsOCwxOTEsNDcsMTMwLDIwMCwyMjYsMTM3LDkyLDIwMiwxMDIsNDcsMjAwLDExMyw2NywxNTYsODMsMTk1LDIwMSwyMzIsMjI1LDk2LDIwMyw4MSwyMTMsMTIwLDg5LDExMiwxOTMsMjQsNzcsMTYzLDE3NCwyLDIwMSwxMzAsMTcwLDIxOCw2NiwxMjMsMTE5LDgzLDIxOSwwLDMyLDYxLDUwLDIzMCwxMjcsMjksMjA4LDIxMCwyMjcsMjE3LDg5LDE1NCwyMzAsNTgsNzksMiwzLDEsMCwx',
    iss: 'https://accounts.google.com',        
    iat: '1506447047',        
    exp: '1506450647',        
    alg: 'RS256',        
    kid: '3b0fc11962ad16e49d55a26816c5ad0d3f6b8a83'},     
  expires: '1506450647',     
  email: 'testandthink123@gmail.com' },  
  infoToken:    
    { sub: '117959105295761687889',     
    name: 'test think',     
    given_name: 'test',    
    family_name: 'think',    
    picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',     
    email: 'testandthink123@gmail.com',     
    email_verified: true,     
    locale: 'en' }
}

let dataObjectValue = {
  url: hyperURL1,
  data: { type: 'chat', content: 'hello world' },  
  reporter: hyperURL1,  
  created: '2017-09-26T15:05:14.966Z',  
  runtime: runtimeURL,  
  schema: 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Communication',  
  parent: 'comm://localhost/5f8d87fd-c56b-47fc-ad47-28d55f01e23a'
}

let coreDiscoveryPopulate = function(arg1, arg2){
  return Promise.resolve({dataObject : hyperURL1});
}

function log(f){
	console.log(JSON.stringify(f));
}
