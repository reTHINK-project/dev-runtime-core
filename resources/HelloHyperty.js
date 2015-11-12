class HelloHyperty {

  constructor(hypertyURL, bus, configuration) {

    let _this = this;
    _this.bus = bus;
    _this.configuration = configuration;
    _this.hypertyURL = hypertyURL;

    _this.bus.addListener(hypertyURL, function(msg) {
      console.log('Hello Hyperty: ', msg);
    });

  }

  sendMessage() {

    var _this = this;

    _this.bus.postMessage({
      header: {
        from: _this.hypertyURL,
        to: 'hyperty-runtime://sp1/WorldHyperty'
      },
      body: {
        value: 'Hello from world hyperty instance'
      }
    });

  }

}

export default function activate(hypertyURL, bus, configuration) {

  return {
    hypertyName: 'HelloHyperty',
    hypertyCode: new HelloHyperty(hypertyURL, bus, configuration)
  };

}
