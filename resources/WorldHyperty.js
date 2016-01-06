class WorldHyperty {

  constructor(hypertyURL, bus, configuration) {
    console.log('World Hyperty Instance');

    let _this = this;
    _this.hypertyURL = 'hyperty-runtime://sp1/WorldHyperty'; //hypertyURL;
    _this.bus = bus;
    _this.configuration = configuration;

    _this.bus.addListener(_this.hypertyURL, function(msg) {
      console.log('World Hyperty: ', msg);
    });

  }

  sendMessage() {

    let _this = this;

    _this.bus.postMessage({
      from: _this.hypertyURL,
      to: 'hyperty-runtime://sp1/HelloHyperty',
      body: {
        value: 'Hello from world hyperty instance'
      }
    });

  }

}

export default function activate(hypertyURL, bus, configuration) {

  return {
    hypertyName: 'WorldHyperty',
    hypertyCode: new WorldHyperty(hypertyURL, bus, configuration)
  };

}
