import chai from 'chai';
import Dexie from 'dexie';
import storageManager from '../src/storage-manager/StorageManager';

let expect = chai.expect;
let storage;
describe('StorageManager', function() {
  beforeEach(() => {
    const db = new Dexie('cache');
    const storeName = 'objects';

    let schemas = {};
    schemas[storeName] = 'key,version,value';

    storage = new storageManager(db, storeName);
  });

  describe('set', function() {

    it('should set the value for a given key-version tuple', function(done) {
      storage.set('key', 'v1.0.0', {})
        .then(key => {
          expect(key).to.be.eql('key');
          done();
        });
    });

    it('should replace the value for a given key-version tuple if it exists', function(done) {
      storage.set('key', 'v1.0.0', {})
        .then(() => storage.set('key', 'v1.0.0', {name: 'test'}))
        .then(() => storage.get('key'))
        .then(object => {
          expect(object).to.be.eql({name: 'test'});
          done();
        });
    });
  });

  describe('get', function() {
    it('should get the value for a given key', function(done) {
      storage.set('key', 'v1.0.0', {name: 'test'})
        .then(() => {
          storage.get('key')
            .then(object => {
              expect(object).to.be.eql({name: 'test'});
              done();
            });

        });
    });

    it('should return undefined if no object with the given key exists', function(done) {
      storage.get('key123')
        .then(object => {
          expect(object).to.be.undefined;
          done();
        });
    });
  });

  describe('getVersion', function() {
    it('should get the value version for a given key', function(done) {
      storage.set('key', 'v1.0.0', {})
        .then(() => {
          storage.getVersion('key')
            .then(version => {
              expect(version).to.be.eql('v1.0.0');
              done();
            });
        });
    });

    it('should get undefined if no object with the given key exists', function(done) {
      storage.getVersion('key123')
        .then(version => {
          expect(version).to.be.undefined;
          done();
        });
    });
  });

  describe('delete', function() {
    it('should remove a value from StorageManager for a given key', function(done) {
      storage.set('key', 'v1.0.0', {})
        .then(() => {
          storage.delete('key')
            .then(affected_records => {
              expect(affected_records).to.be.eql(1);
              done();
            });
        });
    });

    it('shouldnt remove a value from StorageManager if the given key doesnt exist', function(done) {
      storage.delete('key321')
        .then(affected_records => {
          expect(affected_records).to.be.eql(0);
          done();
        });
    });
  });
});
