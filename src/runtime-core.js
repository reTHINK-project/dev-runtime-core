import RuntimeUA from './runtime/RuntimeUA';

var runtime = new RuntimeUA();
console.log(runtime);
runtime.loadStub('hyperty-runtime://sp1/protostub/123').then(function(resolve, reject) {
  console.log('testes', resolve, reject);
});
