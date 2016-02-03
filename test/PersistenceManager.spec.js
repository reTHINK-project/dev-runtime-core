import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import persistenceManager from '../src/persistence/PersistenceManager'

let expect = chai.expect;
let localStorage = window.localStorage

describe('PersistenceManager', function(){
    describe('set', function(){
        it('should set the value for a given key-version tuple', function(){
            persistenceManager.set('key', 'v1.0.0', {})

            expect(localStorage.getItem('key')).to.exist
        })
    })

    describe('get', function(){
        it('should get the value for a given key', function(){
            persistenceManager.set('key', 'v1.0.0', {})

            expect(persistenceManager.get('key')).to.be.eql({})
        })
    })

    describe('getVersion', function(){
        it('should get the value version for a given key', function(){
            persistenceManager.set('key', 'v1.0.0', {})

            expect(persistenceManager.getVersion('key')).to.be.equal('v1.0.0')
        })
    })
    
    describe('delete', function(){
        it('should remove a value from PersistenceManager for a given key', function(){
            localStorage.setItem('key', '{}')

            persistenceManager.delete('key')

            expect(localStorage.getItem('key')).to.be.a('null') 
        })
    })
})
