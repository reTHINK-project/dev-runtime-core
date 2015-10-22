import request from '../src/utils/request';

describe('Request', function() {

  it('should can invoke the GET, POST, PUT, DELETE', function() {
    expect(request).to.have.property('get');
    expect(request).to.have.property('post');
    expect(request).to.have.property('put');
    expect(request).to.have.property('delete');
  });

  it('should have parameters on methods', function() {
    request.makeRequest = function() {
      expect(arguments).to.be.arguments;
      expect(arguments[0]).to.be.an('string');
      expect(arguments[1]).to.be.an('string');

      if (arguments[2]) {
        expect(arguments[2]).to.be.a('object');
      }

      if (arguments[3]) {
        expect(arguments[3]).to.be.a('object');
      }

      return new Promise(function(resolve, reject)
      {
        resolve();
      });
    };
  });

  it('make a valid ajax request', function(done) {

    request.get('dist/VertxProtoStub.js').then(function(resolved) {
      done();
      expect(resolved).to.not.throw();
    }).catch(function(error) {
      done();
      expect(error).to.throw();
    });

  });

  it('make a invalid ajax request', function(done) {
    request.get('test.js').then(function(resolved) {
      done();
      expect(resolved).to.not.throw();
    }).catch(function(error) {
      done();
      expect(error).to.throw();
    });
  });

});
