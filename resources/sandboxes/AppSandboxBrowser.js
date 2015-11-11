import MiniBus from '../../src/bus/MiniBus';

class AppSandboxBrowser extends MiniBus {

  constructor() {
    super();

    let _this = this;

    _this.components = {};
  }

  deployComponent(sourceCode, componentURL, configuration) {

    let _this = this;

    return new Promise(function(resolve, reject) {

      try {
        // Evaluate the code to this scope;
        eval(sourceCode);

        // After evaluate the code activate the instance of hyperty
        var hyperty = activate(componentURL, _this, configuration);

        // TODO: change the hyperty.name to componentURL
        // Temporary code
        _this.components[hyperty.hypertyName] = hyperty.hypertyCode;

        // Only for testin
        // this make components accessible from browser console;
        window.components = _this.components;

        resolve('deployed');
      } catch (e) {
        reject(e);
      }

    });

  }

}

export default AppSandboxBrowser;
