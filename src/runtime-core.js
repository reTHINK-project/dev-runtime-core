import RuntimeUA from './runtime/RuntimeUA';

var runtime = new RuntimeUA();
runtime.loadStub('hyperty-runtime://sp1/protostub/123').then(function(resolved) {
  console.log('loadStub response', resolved);
}).catch(function(rejected) {
  console.log('loadStub fail', rejected);
});
