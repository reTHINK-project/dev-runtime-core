import chai from 'chai';
import PouchDB from 'pouchdb';
import SyncStorageManager from '../src/storage-manager/SyncStorageManager';

let expect = chai.expect;
let remote = 'http://localhost:5984'
let storage;
let db;
describe('SyncStorageManager', function() {
  beforeEach(() => {
    const storeName = 'objects';
    db = new PouchDB(storeName);

    storage = new SyncStorageManager(db, storeName, remote);
  });

  afterEach((done) => {
    db.destroy().then(()=>{
      done();
    });
  });


  describe('set', function() {

    it('should set the value for a given key-value tuple', function(done) {
      storage.set('key', {value: 'value'})
        .then(doc => {
          console.log('[SyncStorageManager.spec] set doc ', doc);
          delete doc._rev;
          expect(doc).to.be.eql({_id: 'key', value: 'value'});
          done();
        });
    });

    it('should replace the value for a given key-version tuple if it exists', function(done) {
      storage.set('key', {value: 'new value'})
        .then(() => storage.get('key'))
        .then(object => {
          delete object._rev;
          expect(object).to.be.eql({_id: 'key', value: 'new value'});
          done();
        });
    });
  });

  describe('get', function() {
    it('should get the value for a given key', function(done) {
      storage.set('key', {name: 'test'})
        .then(() => {
          storage.get('key')
            .then(object => {
              delete object._rev;

              expect(object).to.be.eql({_id: 'key', name: 'test'});
              done();
            });

        });
    });

    it('should get the value for a given attribute', function(done) {
        storage.set('key', {name: 'test'})
          .then(() => {
            storage.get('key', 'name')
              .then(object => {
                expect(object).to.be.eql('test');
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

  describe('delete', function() {
    it('should remove a value from StorageManager for a given key', function(done) {
      storage.set('key', {value: 'value'})
        .then(() => {
          storage.delete('key').then(()=>{
            done();
          });
         });
      });

    it('should remove an attribute for a given key ', function(done) {
      storage.set('key', {value: 'value', name: 'test'})
        .then(() => {
          storage.delete('key','value')
            .then( () => {
              storage.get('key')
              .then(object => {
                console.log('[SyncStorageManager.spec] after delete ', object);
                delete object._rev;
  
                expect(object).to.be.eql({_id: 'key', name: 'test'});
                done();
            });
          });
        });
      });

    it('shouldnt remove a value from StorageManager if the given key doesnt exist', function(done) {
      storage.delete('key321')
        .then(result => {
          expect(result).to.be.undefined;
          done();
        });
    });
  });
});
