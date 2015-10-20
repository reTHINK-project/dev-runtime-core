import request from '../src/utils/request';

describe('Request', function() {

  it('make an ajax request', function(done) {

    let response;

    request.get('dist/VertxProtoStub.js').then(function(resolved) {
      response = resolved;
      expect(response).to.not.be.empty();
      done();
    }).catch(function(error) {
      response = error;
      expect(response).to.not.be.empty();
      done();
    });

  });

});
