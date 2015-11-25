import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;

import BloomFilter from '../src/graphconnector/BloomFilter';
import GraphConnector from '../src/graphconnector/GraphConnector';
import GraphConnectorContactData from '../src/graphconnector/GraphConnectorContactData';

describe('Graph Connector', function() {

  describe('construction', function() {
    it('create new GraphConnector instance with zero contacts', function() {
      let graphConnector = new GraphConnector();
      expect(graphConnector.contacts.length).to.equal(0);
    });
  });

  describe('create mock address book', function() {
    var graphConnector = new GraphConnector();
    let guid;
    let firstName;
    let lastName;
    let remGUIDArr = [];
    for (let j = 0; j < 299; j++) {

      // to mock GUIDs for now
      guid = Math.floor(Math.random() * 9999999999999999999999999999999999) + 1000000000000000000000000000000000;

      firstName = randomName();
      lastName = randomName();
      graphConnector.addContact(guid, firstName, lastName);
      if (j % 10 === 0) {
        remGUIDArr.push(guid);
      }
    }
    graphConnector.addContact('123', 'Alice', 'Wonderland');
    var expected = new GraphConnectorContactData('123', 'Alice', 'Wonderland');

    it('create new GraphConnector with random contacts', function() {
      expect(graphConnector.contacts.length).to.equal(300);
    });

    it('remove some contacts from GraphConnector', function() {
      for (let j = 0; j < remGUIDArr.length; j++) {
        graphConnector.removeContact(remGUIDArr[j]);
      }
      expect(graphConnector.contacts.length).to.equal(270);
    });

    it('get contact by first name', function() {
      let result = graphConnector.getContact('Alice');
      expect(result.length).to.equal(1);
      expect(result[0]).to.eql(expected);
    });

    it('get contact by last name', function() {
      let result = graphConnector.getContact('Wonderland');
      expect(result.length).to.equal(1);
      expect(result[0]).to.eql(expected);
    });

    it('check GUID when in direct contacts', function() {

      // Format is: RelatedContacts<Direct<GraphConnectorContactData>,FoF<GraphConnectorContactData>>
      let result = graphConnector.checkGUID('123');
      let directContacts = result[0];
      let fofs = result [1];
      expect(result.length).to.equal(2);
      expect(directContacts.length).to.equal(1);
      expect(fofs.length).to.equal(0);
      expect(directContacts[0]).to.eql(expected);
    });

    it('test direct contacts bloom filter', function() {

      graphConnector.calculateBloomFilter1Hop();

      for (let i = 0; i < remGUIDArr.length; i++) {
        let result = graphConnector.contactsBloomFilter1Hop.test(remGUIDArr[i]);
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
        431328,   // number of bits to allocate.
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

});

function randomName() {
  let text = '';
  let firstLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let restLetters = 'abcdefghijklmnopqrstuvwxyz';

  text += firstLetter.charAt(Math.floor(Math.random() * firstLetter.length));

  for (let i = 0; i < 4; i++) {
    text += restLetters.charAt(Math.floor(Math.random() * restLetters.length));
  }

  return text;
}
