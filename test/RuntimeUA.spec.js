import chai from 'chai';
let expect = chai.expect;

//Testing Module
import RuntimeUA from '../src/runtime/RuntimeUA';

//Main dependecies
import Registry from '../src/registry/Registry';
import IdentityModule from '../src/identity/IdentityModule';
import PolicyEngine from '../src/policy/PolicyEngine';
import MessageBus from '../src/bus/MessageBus';

//Mockup code, for tests;
class SandboxBrowser {

	constructor() {
		console.log('Sandbox Browser');
	}

}

class AppSandboxBrowser {

	constructor() {
		console.log('App Sandbox Browser');
	}

}

class SandboxFactoryTest {

	get messageBus() {
		let _this = this;
		return _this._messageBus;
	}

	set messageBus(messageBus) {
		let _this = this;
		_this._messageBus = messageBus;
	}

	createSandbox() {
		let _this = this;
		return new SandboxBrowser(_this._messageBus);
	}

	createAppSandbox() {
		let _this = this;
		return new AppSandboxBrowser(_this._messageBus);
	}

	removeSandbox() {

	}

}

//Testing runtimeUA;
describe('RuntimeUA', function() {

	// Only for testing
	let runtimeURL = 'hyperty-runtime://sp1/protostub/123';

	let sandboxFactory = new SandboxFactoryTest();

	let runtime = new RuntimeUA(sandboxFactory);

	let messageBus = new MessageBus(registry);

	let registry = new Registry(runtimeURL);
	registry.registerMessageBus(messageBus);


	describe('constructor()', function() {

		it('depends of the Registry', function() {
			expect(runtime.registry).to.be.instanceof(Registry);
		});

		it('depends of the Identity Module', function() {
			expect(runtime.identityModule).to.be.instanceof(IdentityModule);
		});

		it('depends of the Policy Engine', function() {
			expect(runtime.policyEngine).to.be.instanceof(PolicyEngine);
		});

		it('depends of the MessageBus', function() {
			expect(runtime.messageBus).to.be.instanceof(MessageBus);
		});
	});


	describe('loadHyperty(HypertyDescriptorURL)', function() {

		// chose a descriptor.  To test against a real catalgue,
		// run the following docker images before starting this test.
		//
		//		docker run -it --net=host rethink/catalogue-broker
		//		docker run -it --net=host rethink/catalogue-database
		let HypertyDescriptorURL = 'localhost:8080/.well-known/hyperty/KarmaTestHyperty';


	    it('should be a Promise', function(done) {

	        let result = runtime.loadHyperty(HypertyDescriptorURL);
	        expect(result).to.be.instanceof(Promise);
	        done();
	      });
	    
	    describe('Testing loadHyperty() against a running instance of the reTHINK catalogue. (Make sure the docker images with the catalogue are running.)',
	    		function() {
	    	
	    	describe('Calling loadHyperty() with a valid path to an existing Hyperty Descrption', function() {
	    		it('should return a HypertyDiscriptor', function(done) {
	    			let hyperty = runtime.loadHyperty(HypertyDescriptorURL);
	    			expect(runtime.getHypertyDescriptor).to.not.be.empty;
	    			// TODO: adjust once we have the final content of the KarmaTestHypertyDescriptor
	    			//expect(runtime.getHypertyDescriptor).to.equal('{"status":"CONTENT","content":{"id":0,"resources":[{"id":1,"value":"KarmaTestHyperty"},{"id":5,"value":"console.log(\u0027hello world!\u0027)"}]}}';)
	    			done();
	    		});
	    		it('should have loaded the hyperty source code', function(done) {
	    			let hyperty = runtime.loadHyperty(HypertyDescriptorURL);
	    			expect(runtime.getHypertySourceCode).to.not.be.empty;
	    			// TODO: adjust once we have the final content of the KarmaTestHypertyDescriptor
	    			//expect(runtime.getHypertyDescriptor).to.equal('{"status":"CONTENT","content":{"id":5,"value":"console.log(\u0027hello world!\u0027)"}}');
	    			done();
	    		});
	    		it('should have set a hypertyRuntimeURL', function(done) {
	    			let hyperty = runtime.loadHyperty(HypertyDescriptorURL);
	    			expect(runtime.getHypertyRuntimeURL).to.not.be.empty;
	    			done();
	    		});
	    		
	    	});
	    	
	    });


		describe('describe the status of load hyperty', function() {

			it('should return Hyperty Registration Status', function(done) {

				let hyperty = runtime.loadHyperty(HypertyDescriptorURL);
				let hypertyRegistration = {};

				hyperty.then(function(result) {
					done();
					expect(result).to.not.throw();
				}).catch(function(reason) {
					done();
					expect(reason).to.not.throw();
				});

			});

		});

	});

	describe('loadStub(domain)', function() {

		let domain = 'localhost:8080';

		it('should throw when given no arguments', function() {
			expect(runtime.loadStub).to.throw();
		});

		it('should be a Promise', function(done) {

			let result = runtime.loadStub(domain);

			expect(result).to.be.instanceof(Promise);

			done();

			// result.then(function(resolved) {
			//   done();
			//   expect(resolved).to.not.throw();
			// }).catch(function(reason) {
			//   done();
			//   console.log('REASON: ', reason);
			//   expect(rejected).to.not.throw();
			// });

		});

	});

});
