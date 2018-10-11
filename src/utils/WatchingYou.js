import 'proxy-observe';

class WatchingYou {

  constructor() {
    this._watching = {};
    this._observers = [];
  }

  watch(key, object, deep = false) {
    if (deep) {
      this._watching[key] = Object.deepObserve(object, (changes) => {
        changes.every((change) => {
          this._fireEvent(key, change);
        });
      });
    } else {
      this._watching[key] = Object.observe(object, (changes) => {
        changes.every((change) => {
          this._fireEvent(key, change);
        });
      });
    }
    return this._watching[key];
  }

  observe(key, callback) {
    this._observers.push({key: key, callback: callback});
  }

  _fireEvent(key, change) {

    this._observers.filter((observe) => {
      return observe.key === key;
    }).forEach((observe) => {
      observe.callback(change);
    });

  }

}

export default WatchingYou;

/*let watchChanges = new WatchChanges();
let p2pRequesterStub = watchChanges.watch('p2p', {}, true);
let stub = watchChanges.watch('stub', {});

watchChanges.observe('p2p', (change) => {
  console.log('p2pRequesterStub: ' + change.name + ' - ' + JSON.stringify(change.newValue));
});

watchChanges.observe('p2p', (change) => {
  console.log('p2pRequesterStub: ' + change.name + ' - ' + JSON.stringify(change.newValue));
});

watchChanges.observe('stub', (change) => {
  console.log('stub ' + change.name);
});

p2pRequesterStub.a = {};
stub.b = {name: 'vitor'};
p2pRequesterStub.a.name = 'Hello';
stub.b = {name: 'vitor'};
p2pRequesterStub.a.age = '32';
p2pRequesterStub.a.name = 'World';*/
