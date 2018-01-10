class PromiseQueue {

  // TODO: Improve this Queuing
  constructor(concurrency) {
    this.flushing = false;
    this.Promise = Promise;
    this.concurrency = (typeof concurrency !== 'number') ? 1 : concurrency;
    this.promises = [];
    this.queue = [];
    this.isProcessing = false;
  }

  done(cb) {
    this.callback = cb;
  }

  add(promise) {
    this.queue.push(promise);

    if (!this.isProcessing) {
      return this.queue.reduce((promiseChain, currentTask) => {
        return promiseChain.then(chainResults => currentTask.then(currentResult => [...chainResults, currentResult]));
      }, Promise.resolve([])).then(arrayOfResults => {
        // Do something with all results
        this.isProcessing = false;
      });

    }
  }

}

export default PromiseQueue;

