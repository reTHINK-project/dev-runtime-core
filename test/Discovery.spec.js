import HypertyDiscovery from '../src/discovery/Discovery';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('Discovery', function() {
  let domain = 'ist.pt';
  let runtimeURL = 'runtimeURL';
  let expectedHypertyMessage = {'hyperty://ist.pt/1':
                  {descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                   lastModified: '"2016-03-03T13:32:06Z"',
                   dataSchemes: ['comm'],
                   resources:   ['chat']}
  };

  let expectedHypertiesMessage = [{'hyperty://ist.pt/1':
                  {descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                   lastModified: '"2016-03-03T13:32:06Z"',
                   dataSchemes: ['comm'],
                   resources:   ['chat']}
  }];

  let expectedDataObjectMessage = {'comm://ist.pt/1':
                  {schema: 'hyperty-catalogue://catalogue.hybroker.rethink.ptinovacao.pt/.well-known/dataschema/Communication',
                   url: 'comm://ist.pt/1',
                   name: 'mychat',
                   lastModified: '"2016-03-03T13:32:06Z"',
                   dataSchemes: ['comm'],
                   resources:   ['chat']}
  };

  let messageBus = {
    postMessage: (msg, replyCallback) => {

      if (msg.body.resource === 'user://gmail.com/openidtest10') { //deprecated
        expect(msg).to.eql({
          type: 'read', from: domain, to: 'domain://registry.ist.pt',
          body: {resource: 'user://gmail.com/openidtest10'}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://gmail.com/openidtest10',
            value: {'hyperty://ist.pt/1':
                        {descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                         lastModified: '"2016-03-03T13:32:06Z"'}}}
        });
      } else if (msg.body.resource === 'user://specific.com/openidtest10') { //deprecated
        expect(msg).to.eql({
          type: 'read', from: domain, to: 'domain://registry.specific.com',
          body: {resource: 'user://specific.com/openidtest10'}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://specific.com/openidtest10',
            value: {'hyperty://specific.com/1':
                        {descriptor: 'hyperty-catalogue://specific.com/.well-known/hyperty/HelloHyperty',
                         lastModified: '"2016-03-03T13:32:06Z"'}}}
        });
      } else if (msg.body.resource === 'user://gmail.com/openidtest20') { //deprecated
        expect(msg).to.eql({
          type: 'read', from: domain, to: 'domain://registry.ist.pt',
          body: {resource: 'user://gmail.com/openidtest20', criteria: {resources: ['chat'], dataSchemes: ['comm']}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://gmail.com/openidtest20',
            value: {'hyperty://ist.pt/1':
                        {descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}}
        });
      } else if (msg.body.resource === '/hyperty/userprofile/openidtest20') { //discoverHypertiesPerUserProfileData
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/hyperty/userprofile/openidtest20', criteria: {resources: ['chat'], dataSchemes: ['comm']}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: [{'hyperty://ist.pt/1':
                        {descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}]}
        });
      } else if (msg.body.resource === '/dataObject/userprofile/openidtest20') { //discoverDataObjectsPerUserProfileData
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/dataObject/userprofile/openidtest20', criteria: {resources: ['chat'], dataSchemes: ['comm']}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: {'comm://ist.pt/1':
                      {schema: 'hyperty-catalogue://catalogue.hybroker.rethink.ptinovacao.pt/.well-known/dataschema/Communication',
                       url: 'comm://ist.pt/1',
                       name: 'mychat',
                       lastModified: '"2016-03-03T13:32:06Z"',
                       dataSchemes: ['comm'],
                       resources:   ['chat']}}}
        });
      } else if (msg.body.resource === '/hyperty/guid/user-guid://3vGnMSSVVhJL7soMC9tSj6DyIxWUNrzj3BNBcbUyceo') { //discoverHypertiesPerGUID
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/hyperty/guid/user-guid://3vGnMSSVVhJL7soMC9tSj6DyIxWUNrzj3BNBcbUyceo', criteria: {resources: ['chat'], dataSchemes: ['comm']}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: [{'hyperty://ist.pt/1':
                        {descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}]}
        });
      } else if (msg.body.resource === '/dataObject/guid/user-guid://3vGnMSSVVhJL7soMC9tSj6DyIxWUNrzj3BNBcbUyceo') { //discoverDataObjectsPerGUID
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/dataObject/guid/user-guid://3vGnMSSVVhJL7soMC9tSj6DyIxWUNrzj3BNBcbUyceo', criteria: {resources: ['chat'], dataSchemes: ['comm']}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: {'comm://ist.pt/1':
                        {schema: 'hyperty-catalogue://catalogue.hybroker.rethink.ptinovacao.pt/.well-known/dataschema/Communication',
                         url: 'comm://ist.pt/1',
                         name: 'mychat',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}}
        });
      } else if (msg.body.resource === '/hyperty/user/openidtest20@gmail.com') { //discoverHyperties
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/hyperty/user/openidtest20@gmail.com', criteria: {resources: ['chat'], dataSchemes: ['comm'], domain: domain}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: [{'hyperty://ist.pt/1':
                        {descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}]}
        });
      } else if (msg.body.resource === '/dataObject/user/openidtest20@gmail.com') { //discoverDataObjects
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/dataObject/user/openidtest20@gmail.com', criteria: {resources: ['chat'], dataSchemes: ['comm'], domain: domain}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: {'comm://ist.pt/1':
                        {schema: 'hyperty-catalogue://catalogue.hybroker.rethink.ptinovacao.pt/.well-known/dataschema/Communication',
                         url: 'comm://ist.pt/1',
                         name: 'mychat',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}}
        });
      } else if (msg.body.resource === '/hyperty/url/ist.pt/1') { //discoverHypertyPerURL
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/hyperty/url/ist.pt/1', criteria: { domain: domain}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: {'hyperty://ist.pt/1':
                        {descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}}
        });
      } else if (msg.body.resource === '/dataObject/url/ist.pt/1') { //discoverDataObjectPerURL
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/dataObject/url/ist.pt/1', criteria: { domain: domain}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: {'comm://ist.pt/1':
                        {schema: 'hyperty-catalogue://catalogue.hybroker.rethink.ptinovacao.pt/.well-known/dataschema/Communication',
                         url: 'comm://ist.pt/1',
                         name: 'mychat',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}}
        });
      } else if (msg.body.resource === '/dataObject/name/myChat') { //discoverDataObjectsPerName
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/dataObject/name/myChat', criteria: {resources: ['chat'], dataSchemes: ['comm'], domain: domain}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: {'comm://ist.pt/1':
                        {schema: 'hyperty-catalogue://catalogue.hybroker.rethink.ptinovacao.pt/.well-known/dataschema/Communication',
                         url: 'comm://ist.pt/1',
                         name: 'mychat',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}}
        });
      } else if (msg.body.resource === '/dataObject/reporter/hyperty://ist.pt/1') { //discoverDataObjectsPerReporter
        expect(msg).to.eql({
          type: 'read', from: domain, to: runtimeURL + "/discovery/",
          body: {resource: '/dataObject/reporter/hyperty://ist.pt/1', criteria: {resources: ['chat'], dataSchemes: ['comm'], domain: domain}}
        });
        replyCallback({
          id: 1, type: 'response', to: msg.from, from: msg.to, body: {code: 200,
            assertedIdentity: 'user://google.com/openidtest20@gmail.com',
            value: {'comm://ist.pt/1':
                        {schema: 'hyperty-catalogue://catalogue.hybroker.rethink.ptinovacao.pt/.well-known/dataschema/Communication',
                         url: 'comm://ist.pt/1',
                         name: 'mychat',
                         lastModified: '"2016-03-03T13:32:06Z"',
                         dataSchemes: ['comm'],
                         resources:   ['chat']}}}
        });
      }
    }
  };

  let hypertyDiscovery = new HypertyDiscovery(domain, runtimeURL, messageBus);

  describe('constructor()', function() {
    it('should create a HypertyDiscovery object without error', function() {
      expect(hypertyDiscovery.discoveryURL).to.be.equal(domain);
    });
  });
  //deprecated
  describe('discoverHypertyPerUser()', function() {
    it('should return a Promise with an Identity using the default domain', function(done) {

      let expectedMessage = {id: 'openidtest10@gmail.com',
                            descriptor: 'hyperty-catalogue://ist.pt/.well-known/hyperty/HelloHyperty',
                            hypertyURL: 'hyperty://ist.pt/1'};

        expect(hypertyDiscovery.discoverHypertyPerUser('openidtest10@gmail.com').then(function(response) {
        console.log('Response->', response);
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedMessage).and.notify(done);

    });

    it('should return a Promise with an Identity using a given domain', function(done) {

      let expectedMessage = {id: 'openidtest10@specific.com',
                            descriptor: 'hyperty-catalogue://specific.com/.well-known/hyperty/HelloHyperty',
                            hypertyURL: 'hyperty://specific.com/1'};

      expect(hypertyDiscovery.discoverHypertyPerUser('openidtest10@specific.com', 'specific.com').then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedMessage).and.notify(done);
    });
  });
  //deprecated
  describe('discoverHyperty()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverHyperty('user://gmail.com/openidtest20', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedHypertyMessage).and.notify(done);
    });
  });

  describe('discoverHypertiesPerUserProfileData()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverHypertiesPerUserProfileData('openidtest20', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedHypertiesMessage).and.notify(done);
    });
  });

  describe('discoverDataObjectsPerUserProfileData()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverDataObjectsPerUserProfileData('openidtest20', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedDataObjectMessage).and.notify(done);
    });
  });

  describe('discoverHypertiesPerGUID()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverHypertiesPerGUID('user-guid://3vGnMSSVVhJL7soMC9tSj6DyIxWUNrzj3BNBcbUyceo', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedHypertiesMessage).and.notify(done);
    });
  });

  describe('discoverDataObjectsPerGUID()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverDataObjectsPerGUID('user-guid://3vGnMSSVVhJL7soMC9tSj6DyIxWUNrzj3BNBcbUyceo', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedDataObjectMessage).and.notify(done);
    });
  });

  describe('discoverHyperties()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverHyperties('openidtest20@gmail.com', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedHypertiesMessage).and.notify(done);
    });
  });

  describe('discoverDataObjects()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverDataObjects('openidtest20@gmail.com', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedDataObjectMessage).and.notify(done);
    });
  });

  describe('discoverHypertyPerURL()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverHypertyPerURL('ist.pt/1').then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedHypertyMessage).and.notify(done);
    });
  });

  describe('discoverDataObjectPerURL()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverDataObjectPerURL('ist.pt/1').then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedDataObjectMessage).and.notify(done);
    });
  });

  describe('discoverDataObjectsPerName()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverDataObjectsPerName('myChat', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedDataObjectMessage).and.notify(done);
    });
  });

  describe('discoverDataObjectsPerReporter()', function() {
    it('should conclude the advanced search without error', function(done) {

      expect(hypertyDiscovery.discoverDataObjectsPerReporter('hyperty://ist.pt/1', ['comm'], ['chat']).then(function(response) {
        return response;
      })).to.be.fulfilled.and.eventually.eql(expectedDataObjectMessage).and.notify(done);
    });
  });

});
