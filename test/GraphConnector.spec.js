import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

// dependencies
import BloomFilter from '../src/graphconnector/BloomFilter';
import GraphConnector from '../src/graphconnector/GraphConnectorBase';
import GraphConnectorContactData from '../src/graphconnector/GraphConnectorContactData';
import bip39 from 'bip39';
import jsrsasign from 'jsrsasign';
import Registry from '../src/registry/Registry';
import MessageBus from '../src/bus/MessageBus';
import { runtimeFactory } from './resources/runtimeFactory';
import AddressAllocation from '../src/allocation/AddressAllocation';
import RuntimeCatalogue from '../src/runtime-catalogue/RuntimeCatalogue';

let registry;
let msgbus;
let runtimeURL = 'hyperty-runtime://ua.pt/123';
let appSandbox = runtimeFactory.createAppSandbox();
let storageManager = runtimeFactory.storageManager('graphConnector');
let runtimeCatalogue = new RuntimeCatalogue(runtimeFactory);
let runtimeCapabilities = runtimeFactory.runtimeCapabilities(storageManager);
let graphConnector;

describe('Graph Connector', function() {

    // this will be executed before all the tests, and you can garantee this will be setted
    before(function () {

        let identityModule = {
            getIdentities: () => {
                let identities = [];
                let identityBundle = {identity: 'user://gmail.com/openidtest10', token: 'idToken'};
                identities.push(identityBundle);
                return identities;
            }
        };

        // instanciate the registry;
        registry = new Registry(runtimeURL, appSandbox, identityModule, runtimeCatalogue, runtimeCapabilities, storageManager);
        msgbus = new MessageBus(registry);
        new AddressAllocation(runtimeURL, msgbus, registry);

        registry.messageBus = msgbus;

        graphConnector = new GraphConnector(runtimeURL, msgbus, storageManager);

    });

        describe('construction', function() {
            it('create new GraphConnector instance with zero contacts', function() {

                expect(graphConnector.contacts.length).to.equal(0);
            });
        });


        describe('create mock address book', function() {

            let guid;
            let remGUIDArr = [];

            it('create new GraphConnector with random contacts', function() {


                // mock reply from Global Registry
                graphConnector.messageBus.addListener('global://registry/', (msg) => {
                    let message = {
                        id: msg.id, type: 'response', from: 'global://registry/', to: msg.from,
                        body: {
                            Message: 'request was performed successfully',
                            Code: 400,
                            Value: "test",
                            errorCode: 0
                        }
                    };

                    graphConnector.messageBus.postMessage(message, (reply) => {

                        console.info('Reply GUID add-contacts: ', reply);
                    });
                });

                graphConnector.addContact('123', 'Alice', 'Wonderland');
                graphConnector.addContact('1234', 'Bob', 'Wonderland');
                graphConnector.addContact('12345', 'Felix', 'Beierle');
                graphConnector.addContact('123456', 'Senan', 'Sharhan');
                expect(graphConnector.contacts.length).to.equal(4);
            });

            it('remove some contacts from GraphConnector', function() {

                graphConnector.removeContact('1234');
                let status = graphConnector.removeContact('4321');
                expect(status).to.equal(false);
                expect(graphConnector.contacts.length).to.equal(3);
            });


              it('setting first and last name of the owner', function() {
                graphConnector.generateGUID();
                let result = graphConnector.setOwnerName('Tom', 'Sawyer');
                expect(result).to.equal(true);
                result = graphConnector.setOwnerName('Tom');
                expect(result).to.equal(true);

            });


            it('test direct contacts bloom filter', function() {

                graphConnector.calculateBloomFilter1Hop();

                for (let i = 0; i < remGUIDArr.length; i++) {
                    let result = graphConnector.contactsBloomFilter1Hop.test(remGUIDArr[i]);
                    if (result) console.log(contacts);
                    expect(result).to.equal(false);
                }

                let resultAlice = graphConnector.contactsBloomFilter1Hop.test('123');
                expect(resultAlice).to.equal(true);
                expect(graphConnector.contactsBloomFilter1Hop.test('absdgdghdftgh')).to.equal(false);
                graphConnector.removeContact('123');
                expect(graphConnector.contactsBloomFilter1Hop.test('123')).to.equal(false);
            });

            it('test privacy setting for contacts', function() {

                graphConnector.addContact('123', 'Alice', 'Wonderland');
                graphConnector.calculateBloomFilter1Hop();
                expect(graphConnector.contactsBloomFilter1Hop.test('123')).to.equal(true);

                // set private
                graphConnector.getContact('Alice')[0].privateContact = true;
                graphConnector.calculateBloomFilter1Hop();
                expect(graphConnector.contactsBloomFilter1Hop.test('123')).to.equal(false);

            });

            it('check GUID when in friend-of-friend connection', function() {

                let bf = new BloomFilter(
                    4314,     // number of bits to allocate. With 300 entries, we have a false positive rate of 0.001 %.
                    10        // number of hash functions.
                );

                bf.add('george');
                bf.add('jerry');
                bf.add('elaine');
                graphConnector.getContact('Alice')[0].contactsBloomFilter1Hop = bf;

                let result = graphConnector.checkGUID('george');
                let directContacts = result[0];
                let fofs = result [1];
                expect(result.length).to.equal(2);
                expect(directContacts.length).to.equal(0);
                expect(fofs.length).to.equal(1);

                // connection through Alice
                expect(fofs[0].firstName).to.eql('Alice');
                expect(fofs[0].lastName).to.eql('Wonderland');
                expect(fofs[0].guid).to.eql('123');

            });

            it('setting bloom filter of a given contact', function() {
                let bf = new BloomFilter(
                    4314,   // number of bits to allocate. With 300 entries, we have a false positive rate of 0.001 %.
                    10        // number of hash functions.
                );
                bf.add('george');
                bf.add('jerry');
                bf.add('elaine');
                let tmpGUID = '0987xyz7y7fyft87gf6f76';
                graphConnector.addContact(tmpGUID, 'bloom123', 'test');
                graphConnector.setBloomFilter1HopContact(tmpGUID, bf);
                expect((graphConnector.getContact('bloom123')[0].contactsBloomFilter1Hop)).to.eql(bf);
                let lastSyncDate = graphConnector.getContact('bloom123')[0].lastSyncBloomFilter1Hop;
                expect(typeof lastSyncDate).not.to.equal('undefined');
            });

            it('editing contact (GUID, lname, fname, privacyStatus)', function() {

                var expectedEdit = new GraphConnectorContactData('1234', 'Joey', 'Wunderlander');
                expectedEdit.privateContact = true;
                graphConnector.addContact('4321', 'eoJ', 'Landwunder');
                let res = graphConnector.editContact('4321', 'Joe', 'Wunderland', '4321', true);
                let result = graphConnector.editContact('4321', 'Joe', 'Wunderland', '1234', true);
                expect(result[0].guid).to.equal(expectedEdit.guid);
                result = graphConnector.editContact('1234', 'Joey', 'Wunderland', '1234', true);
                expect(result[0].fname).to.equal(expectedEdit.fname);
                result = graphConnector.editContact('1234', 'Joey', 'Wunderlander', '1234', true);
                expect(result[0].lname).to.equal(expectedEdit.lname);
                result = graphConnector.editContact('1234', 'Joey', 'Wunderlander', '1234', true);
                expect(result[0].privateContact).to.equal(expectedEdit.privateContact);
            });

            it('Adding a groupname to a contact', function() {

                graphConnector.addContact('123456', 'john', 'snow');
                let resultTrue = graphConnector.addGroupName('123456', 'Winterfell');
                let resultFalse = graphConnector.addGroupName('123456789', 'Winterfell');
                expect(resultTrue).to.equal(true);
                expect(resultFalse).to.equal(false);
                resultFalse = graphConnector.addGroupName('123456789', 'Winterfell');
                expect(resultFalse).to.equal(false);
            });

            it('Adding and removing groupname to owner', function() {
                graphConnector.addContact('1234567890qwertz', 'test', 'test');
                let res = graphConnector.addGroupName('1234567890qwertz', 'Winterfell');
                expect(res).to.equal(true);
                res = graphConnector.addGroupName('1234567890qwertz', 'Winterfell');
                expect(res).to.equal(false);
                res = graphConnector.removeGroupName('1234567890qwertz', 'Winterfell');
                expect(res).to.equal(true);
            });

            it('adding a residenceLocation to a contact and to owner', function() {
                let contact = graphConnector.setLocation('123456', 'Berlin');
                expect(contact).to.equal(true);
                contact = graphConnector.setLocation('1234567890qwertz', 'Honolulu');
                expect(contact).to.equal(true);
            });

            it('getting all contacts with same groupName', function() {
                graphConnector.addGroupName('123456', 'Summerfall');
                graphConnector.addGroupName('1234567890qwertz', 'Summerfall');
                let res = graphConnector.getGroup('Summerfall');
                expect(res.length).to.equal(2);
            });

            it('getting all the group names of the user', function() {

                let result = graphConnector.getGroupNames();
                expect(result.length).to.equal(2);
                graphConnector.addGroupName('123456', 'SSummerfall');
                result = graphConnector.getGroupNames();
                expect(result.length).to.equal(3);
                graphConnector.removeGroupName('123456', 'SSummerfall');

            });

            it('removing a groupname of a contact', function() {
                graphConnector.addContact('123456', 'john', 'snow');
                let resultTrue = graphConnector.removeGroupName('123456', 'Winterfell');
                let resultFalse = graphConnector.removeGroupName('123456789', 'Winterfell');
                expect(resultTrue).to.equal(true);
                expect(resultFalse).to.equal(false);
            });

            it('removing a residenceLocation', function() {
                let result = graphConnector.removeLocation('123456');
                expect(result).to.equal(true);
                result = graphConnector.removeLocation('1234567noValidGUID');
                expect(result).to.equal(false);
            });

            it('checking setActive() ', function() {
                let result = graphConnector.setActive(1);
                expect(result).to.equal(true);
                result = graphConnector.setActive(0);
                expect(result).to.equal(true);
            });

            it('checking setRevoked() ', function() {
                let result = graphConnector.setRevoked(1);
                expect(result).to.equal(true);
                result = graphConnector.setRevoked(0);
                expect(result).to.equal(true);
            });

            it('checking setTimeout() ', function() {
                let timeout = new Date('October 13, 2017 11:13:00');
                timeout.setMonth(timeout.getMonth() + 120);
                let result = graphConnector.setTimeout(timeout);
                expect(result).to.equal(true);
                timeout = new Date();
                result = graphConnector.setTimeout(timeout);
                expect(result).to.equal(false);
            });

            it('get contact by first name', function() {
                graphConnector.addContact('kkk', 'Ishantiw', 'abc');
                graphConnector.addContact('lll', 'Ishanti', 'bcd');
                graphConnector.addContact('uuu', 'Ishantiwari', 'cde');
                let result = graphConnector.getContact('Ishan');
                expect(result.length).to.equal(3);

                //expect(result[0]).to.eql(expected);
            });

            it('get contact by last name', function() {
                graphConnector.addContact('kkklast', 'fgh', 'Joky');
                graphConnector.addContact('llllast', 'ghi', 'Jokyus');
                graphConnector.addContact('uuulast', 'hij', 'Jokyi');
                let result = graphConnector.getContact('Joky');
                expect(result.length).to.equal(3);

                ///expect(result[0]).to.eql(expected);
            });

            it('get list of contacts', function() {
                let result = graphConnector.getAllContacts();
                expect(result.length).to.equal(graphConnector.contacts.length);
            });

            it('Adding user ID to owner', function() {

                let resultTrue = graphConnector.addUserID('john://facebook.com/fluffy123', 'google.com');
                let resultFalse = graphConnector.addUserID('john://facebook.com/fluffy123', 'google.com');
                expect(resultTrue).to.equal(true);
                expect(resultFalse).to.equal(false);

            });

            it('Removing user ID of the owner', function() {
                let resultTrue = graphConnector.removeUserID('john://facebook.com/fluffy123', 'google.com');
                let resultFalse = graphConnector.removeUserID('john://facebook.com/fluffy123', 'google.com');
                expect(resultTrue).to.equal(true);
                expect(resultFalse).to.equal(false);
            });

            it('Guid exists or not', function() {
                graphConnector.addContact('guidcheck123', 'guidTest', 'guid');
                let resultTrue = graphConnector.guidExist('guidcheck123');
                let resultFalse = graphConnector.guidExist('guidcheck321');
                expect(resultTrue).to.equal(true);
                expect(resultFalse).to.equal(false);
            });

            it('returning the owner', function() {
                let owner = graphConnector.getOwner();
                owner.firstName = 'TestingOwner';
                expect(owner.firstName).to.equal('TestingOwner');
            });

            it('adding userID to a contact', function() {
                graphConnector.addContact('testingAddUSERID123', 'TestingUserID', 'adduserIDSuccess');
                let success = graphConnector.setContactUserIDs('testingAddUSERID123', 'test://facebook.com/fluffy123', 'google.com');
                let unsuccess = graphConnector.setContactUserIDs('testingAddUSERID123', 'test://facebook.com/fluffy123', 'google.com');
                expect(success).to.equal(true);
                expect(unsuccess).to.equal(false);
            });

            it('getting userIDs of a contact', function() {
                graphConnector.addContact('testingGETUSERID12345', 'TestingUserIDget', 'getuserIDSuccess');
                //Adding user ids to a contact
                graphConnector.setContactUserIDs('testingGETUSERID12345', 'test123://facebook.com/fluffy123', 'google.com');
                graphConnector.setContactUserIDs('testingGETUSERID12345', 'test://twitter.com/fluffy123', 'google.com');
                let success = graphConnector.getContactUserIDs('testingGETUSERID12345');
                let unsuccess = graphConnector.getContactUserIDs('testingGETUSERID123456');
                expect(success.length).to.equal(2);
                expect(unsuccess).to.equal(false);
            });

            it('Setting the user Defaults', function() {
                graphConnector.setDefaults('a', 'b', 'c');

                let success = graphConnector.setDefaults('1', '2', '3');
                expect(success).to.equal(true);
            });

            it('bloom filter tests', function() {

                let jabberwocky = '`Twas brillig, and the slithy toves\n  Did gyre and gimble in the wabe:\nAll mimsy were the borogoves,\n  And the mome raths outgrabe.\n\n\"Beware the Jabberwock, my son!\n  The jaws that bite, the claws that catch!\nBeware the Jubjub bird, and shun\n  The frumious Bandersnatch!\"\n\nHe took his vorpal sword in hand:\n  Long time the manxome foe he sought --\nSo rested he by the Tumtum tree,\n  And stood awhile in thought.\n\nAnd, as in uffish thought he stood,\n  The Jabberwock, with eyes of flame,\nCame whiffling through the tulgey wood,\n  And burbled as it came!\n\nOne, two! One, two! And through and through\n  The vorpal blade went snicker-snack!\nHe left it dead, and with its head\n  He went galumphing back.\n\n\"And, has thou slain the Jabberwock?\n  Come to my arms, my beamish boy!\nO frabjous day! Callooh! Callay!\n  He chortled in his joy.\n\n`Twas brillig, and the slithy toves\n  Did gyre and gimble in the wabe;\nAll mimsy were the borogoves,\n  And the mome raths outgrabe.';

                let f = new BloomFilter(1000, 4);
                let n1 = 'Bess';
                let n2 = 'Jane';
                f.add(n1);
                expect(f.test(n1)).to.equal(true);
                expect(f.test(n2)).to.equal(false);

                f = new BloomFilter(1000, 4);
                n1 = jabberwocky;
                n2 = jabberwocky + '\n';
                f.add(n1);
                expect(f.test(n1)).to.equal(true);
                expect(f.test(n2)).to.equal(false);

                f = new BloomFilter(1000, 4);
                n1 = '\u0100';
                n2 = '\u0101';
                let n3 = '\u0103';
                f.add(n1);
                expect(f.test(n1)).to.equal(true);
                expect(f.test(n2)).to.equal(false);
                expect(f.test(n3)).to.equal(false);

                f = new BloomFilter(20, 10);
                f.add('abc');
                expect(f.test('wtf')).to.equal(false);

                f = new BloomFilter(1000, 4);
                f.add(1);
                expect(f.test(1)).to.equal(true);
                expect(f.test(2)).to.equal(false);

                f = new BloomFilter(1000, 4);
                for (let i = 0; i < 100; ++i) {
                    f.add(i);
                }
                expect(f.size()).to.be.closeTo(99.953102, 1e-6);
                for (let i = 0; i < 1000; ++i) {
                    f.add(i);
                }
                expect(f.size()).to.be.closeTo(950.424571, 1e-6);

            });


        });


        describe('GUID', function() {


            it('GUID generation', function() {

                this.timeout(30000);

                let mnemonic1 = graphConnector.generateGUID();
                let res = mnemonic1.split(' ');

                expect(res.length).to.equal(16);

            });

            it('GUID re-generation', function(done) {

                this.timeout(15000);

                // create mnemonic and sign Global Regsitry record
                let mnemonic1 = graphConnector.generateGUID();
                let jwt1 = graphConnector.signGlobalRegistryRecord();


                // mock reply from Global Registry
                graphConnector.messageBus.removeAllListenersOf('global://registry/');
                graphConnector.messageBus.addListener('global://registry/', (msg) => {
                    let message = {
                        id: msg.id, type: 'response', from: 'global://registry/', to: msg.from,
                        body: {
                            Message: 'request was performed successfully',
                            Code: 200,
                            Value: jwt1,
                            errorCode: 0
                        }
                    };

                    graphConnector.messageBus.postMessage(message, (reply) => {

                        console.info('Reply GUID re-generation: ', reply);
                    });
                });

                expect(graphConnector.useGUID(mnemonic1).then(function(response) {

                    let publicKey2 = graphConnector.globalRegistryRecord.publicKey;
                    let publicKeyObject2 = jsrsasign.KEYUTIL.getKey(publicKey2);

                    let unwrappedJWT = jsrsasign.KJUR.jws.JWS.parse(jwt1);
                    let encodedString = jwt1.split('.').slice(0, 2).join('.');
                    let sigValueHex = unwrappedJWT.sigHex;
                    let sig = new jsrsasign.KJUR.crypto.Signature({alg: 'SHA256withECDSA'});
                    sig.init(publicKeyObject2);
                    sig.updateString(encodedString);
                    let isValid = sig.verify(sigValueHex);

                    return isValid;
                })).to.be.fulfilled.and.eventually.equal(true).and.notify(done);

            });
        });

        describe('Global Registry Connection - send', function() {


            it('send Global Registry Record', function(done) {

                this.timeout(15000);

                // create mnemonic and sign Global Regsitry record

                let jwt1 = graphConnector.signGlobalRegistryRecord();

                // mock reply from Global Registry 1
                graphConnector.messageBus.removeAllListenersOf('global://registry/');
                graphConnector.messageBus.addListener('global://registry/', (msg) => {
                    let message = {
                        id: msg.id, type: 'response', from: 'global://registry/', to: msg.from,
                        body: {
                            Message: 'request was performed successfully',
                            Code: 200,
                            errorCode: 0
                        }
                    };

                    graphConnector.messageBus.postMessage(message, (reply) => {
                        console.info('Reply GRC - send: ', reply);
                    });
                });

                expect(graphConnector.sendGlobalRegistryRecord(jwt1).then(function(response) {
                    return response;
                })).to.be.fulfilled.and.eventually.equal(200).and.notify(done);

            });
        });

        describe('Global Registry Connection - use GUID', function() {


            it('re-use GUID and retrieve data from Global Registry', function(done) {

                this.timeout(15000);

                // create mnemonic and sign Global Regsitry record
                let mnemonic1 = graphConnector.generateGUID();
                let jwt1 = graphConnector.signGlobalRegistryRecord();
                let grr1 = graphConnector.globalRegistryRecord;

                // mock reply from Global Registry 2
                graphConnector.messageBus.removeAllListenersOf('global://registry/');
                graphConnector.messageBus.addListener('global://registry/', (msg) => {
                    let message = {
                        id: msg.id, type: 'response', from: 'global://registry/', to: msg.from,
                        body: {
                            Message: 'request was performed successfully',
                            Code: 200,
                            Value: jwt1,
                            errorCode: 0
                        }
                    };

                    graphConnector.messageBus.postMessage(message, (reply) => {
                        console.log('Reply GRC - use GUID: ', reply);
                    });
                });

                expect(graphConnector.useGUID(mnemonic1).then(function(response) {
                    return response;
                })).to.be.fulfilled.and.eventually.eql(grr1).and.notify(done);
            });

        });

     describe('Querying Global Registry', function() {


            it('query Global Registry', function(done) {

                this.timeout(15000);

                let jwt = graphConnector.signGlobalRegistryRecord();
                let guid1 = graphConnector.globalRegistryRecord.guid;


                // mock reply from Global Registry
                graphConnector.messageBus.removeAllListenersOf('global://registry/');
                graphConnector.messageBus.addListener('global://registry/', (msg) => {
                    let message = {
                        id: msg.id, type: 'response', from: 'global://registry/', to: msg.from,
                        body: {
                            Message: 'request was performed successfully',
                            Code: 200,
                            Value: jwt,
                            errorCode: 0
                        }
                    };

                    graphConnector.messageBus.postMessage(message, (reply) => {
                        console.info('Reply QGR - query: ', reply);
                    });
                });


                expect(graphConnector.queryGlobalRegistry(guid1).then(function(response) {
                    return response._guid;
                })).to.be.fulfilled.and.eventually.equal(guid1).and.notify(done);

            });

        });

});
