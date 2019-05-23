import chai from 'chai';
import PouchDB from 'pouchdb';
import SyncStorageManager from '../src/storage-manager/SyncStorageManager';

let expect = chai.expect;
let remote = 'http://admin:admin@localhost:5984'
let storage;
let db;

// These tests require a local couchDB listening at 5984 with user admin and passwd admin

describe('SyncStorageManager', function () {
  beforeEach(() => {
    const storeName = 'do-027c35c0-22cc-8e39-f164-a1c3e9c6377f';
    db = new PouchDB(storeName);

    storage = new SyncStorageManager(db, storeName, remote);
//    storage.connect();
  });

  afterEach((done) => {
    db.destroy().then(() => {
      done();
    });
  });


  describe('set', function () {

    it('should set the value for a given key-value tuple', function (done) {
      storage.set('key', { value: 'value' })
        .then(doc => {
          console.log('[SyncStorageManager.spec] set doc ', doc);
          delete doc._rev;
          expect(doc).to.be.eql({ _id: 'key', value: 'value' });
          done();
        });
    });

    it('should replace the value for a given key-version tuple if it exists', function (done) {
      storage.set('key', { value: 'value' })
        .then(() => {
          storage.set('key', { value: 'new value' })
            .then(() => {
              storage.get('key')
              .then(object => {
                console.log('[SyncStorageManager.spec] updated doc ', object);
                delete object._rev;
                expect(object).to.be.eql({ _id: 'key', value: 'new value' });
                done();
              });
            });
        });
    });
    it('should set the value and its version for a given key-value tuple', function (done) {
      storage.set('key', { value: 'value' }, '1-test')
        .then(doc => {
          console.log('[SyncStorageManager.spec] set doc with version ', doc);
          expect(doc).to.be.eql({ _id: 'key', value: 'value', _rev: '1-test' });
          done();
        });
    });
  });

  describe('backup', function () {

    it.skip('should backup the full database', function (done) {
      storage.set('key', { value: 'value' })
        .then(doc => {
          console.log('[SyncStorageManager.spec] backup database ', doc);
          storage.backup().then(()=>{
            done();
          })

        });
    });

    it.skip('should backup just one doc', function (done) {
      storage.set('key', { value: 'value' })
        .then(() => {
          storage.set('key1', { value: 'value2' })
          .then(doc => {
            console.log('[SyncStorageManager.spec] backup database ', doc);
            storage.backup('key1').then(()=>{
            done();
          })
        })

        });
    });

  });

  describe('get', function () {
    it('should get the value for a given key', function (done) {
      storage.set('key', { name: 'test' })
        .then(() => {
          storage.get('key')
            .then(object => {
              delete object._rev;

              expect(object).to.be.eql({ _id: 'key', name: 'test' });
              done();
            });

        });
    });

    it('should get the value for a given attribute', function (done) {
      storage.set('key', { name: 'test' })
        .then(() => {
          storage.get('key', 'name')
            .then(object => {
              expect(object).to.be.eql('test');
              done();
            });

        });
    });

    it('should return undefined if no object with the given key exists', function (done) {
      storage.get('key123')
        .then(object => {
          expect(object).to.be.undefined;
          done();
        });
    });
  });

  describe('delete', function () {
    it('should remove a value from StorageManager for a given key', function (done) {
      storage.set('key', { value: 'value' })
        .then(() => {
          storage.delete('key').then(() => {
            done();
          });
        });
    });

    it('should remove an attribute for a given key ', function (done) {
      storage.set('key', { value: 'value', name: 'test' })
        .then(() => {
          storage.delete('key', 'value')
            .then(() => {
              storage.get('key')
                .then(object => {
                  console.log('[SyncStorageManager.spec] after delete ', object);
                  delete object._rev;

                  expect(object).to.be.eql({ _id: 'key', name: 'test' });
                  done();
                });
            });
        });
    });

    it.skip('should delete the database', function (done) {
      storage.delete()
      .then(() => {
        storage.get('key')
          .then(() => {
            console.error('[SyncStorageManager.spec] after full delete failed ');
            done();
          },(err)=>{
            console.error('[SyncStorageManager.spec] full delete error: ', err);
            expect(err).to.be.eql('Error: database is destroyed');
            done();
          });
      });
  });

    it('shouldnt remove a value from StorageManager if the given key doesnt exist', function (done) {
      storage.delete('key321')
        .then(result => {
          expect(result).to.be.undefined;
          done();
        });
    });
  });

  describe('getVersion', function () {
    it('should get the value version for a given key', function (done) {
      storage.set('key', { value: 'teste' }, '1-teste')
        .then(() => {
          storage.getVersion('key')
            .then(version => {
              expect(version).to.be.eql('1-teste');
              done();
            });
        });
    });

    it('should get undefined if no object with the given key exists', function (done) {
      storage.getVersion('key123')
        .then(version => {
          expect(version).to.be.undefined;
          done();
        });
    });
  });

  describe('sync', function () {
    it.skip('should synchronise with remote db', function (done) {
      storage.sync()
        .then(() => {
          storage.get()
            .then(doc => {
              console.log('[SyncStorageManager.sync] doc ', doc )
              expect(doc).not.to.be.empty;
              done();
            });
        });
    });

  });

});
