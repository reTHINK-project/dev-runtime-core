class SandboxManager {

  constructor() {

  }

  new(url, messageBus, configuration) {

    let worker = new Worker('src/utils/worker.js');
    worker.postMessage({
      url: url,
      messageBus: messageBus,
      configuration: configuration
    });

    return worker;
  }

}

export default new SandboxManager();
