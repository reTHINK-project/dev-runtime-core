import chai from 'chai';

import 'proxy-observe';
import SyncObject from '../src/syncher/ProxyObject';

chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

let expect = chai.expect;

describe('The Object.Observer and Array.Observer', () => {

  it('should use SyncObject', () => {

    let initialData = {};
    let syncObj = new SyncObject(initialData);

    let data = syncObj.data;

    //apply changes...
    data['1'] = { name: 'Micael', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'xpto'}};
    expect(data['1']).to.have.all.keys({name: 'Micael', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'xpto'}});

    data['2'] = { name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: { name: 'xpto' } };
    expect(data['2']).to.have.all.keys({name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: { name: 'xpto' }});

    data['1'].name = 'Vitor Silva';
    expect(data['1']).to.deep.equal({ name: 'Vitor Silva', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'xpto'}});

    data['1'].birthdate = new Date(1982, 1, 28);
    expect(data['1']).to.deep.equal({name: 'Vitor Silva', birthdate: new Date(1982, 1, 28), email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'xpto'}});

    data['2'].obj1.name = 'XPTO NEW';
    expect(data['2']).to.deep.equal({name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: { name: 'XPTO NEW' }});

    data['1'].obj1.name = 'Vitor Silva';
    expect(data['1']).to.deep.equal({name: 'Vitor Silva', birthdate: new Date(1982, 1, 28), email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'Vitor Silva'}});

    data['1'].arr = [1, 0, { x: 10, y: 20 }];
    expect(data['1']).to.deep.equal({name: 'Vitor Silva', birthdate: new Date(1982, 1, 28), email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'Vitor Silva'}, arr: [1, 0, { x: 10, y: 20 }]});

    data['1'].arr[1] = 2;
    expect(data['1'].arr[1]).to.deep.equal(2);

    delete data['2'];
    expect(data['2']).to.be.an('undefined');

  });

  it('should use SyncObject observe', (done) => {

    let initialData = {};
    let syncObj = new SyncObject(initialData);
    let seq = 0;

    syncObj.observe((event) => {
      seq++;

      console.log('seq ' + seq + ' | ' + ' - ' + JSON.stringify(event));

      if (seq === 1) {
        expect(event).to.deep.equal({cType: 'add', oType: 'object', field: '1', data: {name: 'Micael', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'xpto'}, arr: []}});
      }

      if (seq === 2) {
        expect(event).to.deep.equal({cType: 'add', oType: 'object', field: '2', data: {name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: { name: 'xpto' }}});
      }

      if (seq === 3) {
        expect(event).to.deep.equal({cType: 'update', oType: 'object', field: '1.name', data: 'Vitor Silva'});
      }

      if (seq === 4) {
        expect(event).to.deep.equal({cType: 'update', oType: 'object', field: '1.arr', data: [1, 0, { x: 10, y: 20 }]});
      }

      if (seq === 5) {
        expect(event).to.deep.equal({cType: 'update', oType: 'array', field: '1.arr.1', data: 2});
        done();
      }

    });

    let data = syncObj.data;

    //apply changes...
    data['1'] = {name: 'Micael', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'xpto'}, arr: []};
    data['2'] = {name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: { name: 'xpto' }};
    data['1'].name = 'Vitor Silva';
    data['1'].arr = [1, 0, { x: 10, y: 20 }];
    data['1'].arr[1] = 2;
  });

});
