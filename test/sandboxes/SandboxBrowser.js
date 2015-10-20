class SandboxBrowser {

  constructor() {

    let _this = this;

    _this.name = 'SandboxBrowser';

    try {

      let blob = new Blob([SandboxCode], {type: 'text/javascript'});
      var blobURL = window.URL.createObjectURL(blob);
      let sandbox = new Worker(blobURL);

      _this.sandbox = sandbox;

    } catch (e) {
      throw new Error('Your environment does not support worker \n', e);
    }

  }

}

const SandboxCode = 'self.protoStubs = {}; self.addEventListener("message", function(event) { if (event.data.sourceCode) { eval(event.data.sourceCode); postMessage({header: {}, body: {value: "deployed", desc: "The component has been loaded."}}); } else { postMessage({header: {}, body: {value: "error", desc: "You don\'t provide any source code;"}}); } var callback = function(msg) { console.log("callback msg: ", msg); postMessage(msg); }; var protoStub = self.protoStubs[event.data.componentURL]; if (!protoStub){ self.protoStubs[event.data.componentURL] = new VertxProtoStub(event.data.componentURL, callback, event.data.configuration); protoStub = self.protoStubs[event.data.componentURL]; } switch (event.data.type) { case "CREATE": protoStub.connect(); break; case "REMOVE": console.log("REMOVE: ", protoStub); protoStub.disconnect(); break; } }); self.addEventListener("error", function(event) { postMessage({header: {}, body: {value: "error", desc: "An error has occurred when we try downloading: " + event.data}}); });';

export default SandboxBrowser;
