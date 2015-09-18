import expect from 'expect.js';
import Syncher from '../src/syncher/Syncher';

describe('Syncher', function() {
  it('verify produced sync messages', function(done) {
    this.timeout(10000);

    let component;
    let msgList = [];

    let mockBus = {
      owner: 'hyper-1',

      subscribe: function(comp, callback) {
        component = comp;
      },

      publish: function(msg) {
        msgList.push(msg);
      }
    };

    let db = new Syncher(mockBus);
    db.addSchema('Persons', {});

    let sObj = db.create('PTIN', 'Persons');
    db.addSubscription('PTIN', 'hyper-2');

    let data = sObj.data;

    expect(component).to.eql('syncher');

    //apply changes...
    data['1'] = {name: 'Micael', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000};
    data['1'].obj1 = { name: 'xpto' };
    data['2'] = {name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: { name: 'xpto' }};

    setTimeout(() => {
      expect(msgList).to.eql([
        {
          header: {type: 'add', to: 'hyper-2', comp: 'syncher'},
          body: {res: 'PTIN', oType: 'object', attrib: '1',
            value: {
              name: 'Micael',
              birthdate: '28-02-1981',
              email: 'micael-xxx@gmail.com',
              phone: 911000000,
              obj1: { name: 'xpto'}
            }
          }
        },

        {
          header: {type: 'add', to: 'hyper-2', comp: 'syncher'},
          body: {res: 'PTIN', oType: 'object', attrib: '2',
            value: {
              name: 'Luis Duarte',
              birthdate: '02-12-1991',
              email: 'luis-xxx@gmail.com',
              phone: 910000000,
              obj1: { name: 'xpto' }
            }
          }
        }
      ]);

      msgList = []; //empty message list

      //apply changes...
      data['1'].name = 'Micael Pedrosa';
      data['1'].birthdate = new Date(1982, 1, 28);
      data['1'].obj1.name = 'XPTO';
      delete data['2'];

      setTimeout(() => {
        expect(msgList).to.eql([
          {
            header: {type: 'remove', to: 'hyper-2', comp: 'syncher'},
            body: {res: 'PTIN', oType: 'object', attrib: '2', value: undefined}
          },

          {
            header: {type: 'update', to: 'hyper-2', comp: 'syncher'},
            body: {res: 'PTIN', oType: 'object', attrib: '1.name', value: 'Micael Pedrosa'}
          },

          {
            header: {type: 'update', to: 'hyper-2', comp: 'syncher'},
            body: {res: 'PTIN', oType: 'object', attrib: '1.birthdate', value: '1982-02-28T00:00:00.000Z'}
          },

          {
            header: {type: 'update', to: 'hyper-2', comp: 'syncher'},
            body: {res: 'PTIN', oType: 'object', attrib: '1.obj1.name', value: 'XPTO'}
          }
        ]);

        msgList = []; //empty message list

        //apply changes...
        data['1'].arr = [1, 0, {x: 10, y: 20}];

        setTimeout(() => {
          expect(msgList).to.eql([
            {
              header: {type: 'add', to: 'hyper-2', comp: 'syncher'},
              body: {res: 'PTIN', oType: 'object', attrib: '1.arr', value: [1, 0, {x: 10, y: 20}]}
            }
          ]);

          msgList = []; //empty message list

          //apply changes...
          data['1'].arr[1] = 2;

          setTimeout(() => {
            expect(msgList).to.eql([
              {
                header: {type: 'update', to: 'hyper-2', comp: 'syncher'},
                body:{res:'PTIN', oType: 'array', attrib: '1.arr.1', value: 2}
              }
            ]);

            msgList = []; //empty message list

            //apply changes...
            data['1'].arr.push(3);
            data['1'].arr.push({x: 1, y: 2});

            setTimeout(() => {
              expect(msgList).to.eql([
                {
                  header: {type: 'add', to: 'hyper-2', comp: 'syncher'},
                  body: {res: 'PTIN', oType: 'array', attrib: '1.arr.3', value: [3]}
                },

                {
                  header: {type: 'add', to:'hyper-2', comp:'syncher'},
                  body: {res: 'PTIN', oType: 'array', attrib: '1.arr.4', value: [{x: 1, y: 2}]}
                }
              ]);

              msgList = []; //empty message list

              //apply changes...
              data['1'].arr.splice(1, 2, 10, 11, 12);
              data['1'].arr[5].x = 10;

              setTimeout(() => {
                expect(msgList).to.eql([
                  {
                    header: {type: 'remove', to: 'hyper-2', comp: 'syncher'},
                    body: {res: 'PTIN', oType: 'array', attrib: '1.arr.1', value: 2}
                  },

                  {
                    header: {type: 'add', to: 'hyper-2', comp: 'syncher'},
                    body: {res: 'PTIN', oType: 'array', attrib: '1.arr.1', value: [10, 11, 12]}
                  },

                  {
                    header: {type: 'update', to: 'hyper-2', comp: 'syncher'},
                    body: {res: 'PTIN', oType: 'object', attrib: '1.arr.5.x', value: 10}
                  }
                ]);

                msgList = []; //empty message list

                //apply changes...
                data['1'].arr.pop();

                setTimeout(() => {
                  expect(msgList).to.eql([
                    {
                      header: {type: 'remove', to: 'hyper-2', comp: 'syncher'},
                      body: {res: 'PTIN', oType: 'array', attrib: '1.arr.5', value: 1}
                    }
                  ]);

                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  it('verify consumed sync messages', function(done) {
    this.timeout(10000);

    let component;
    let busCallback;

    let mockBus = {
      owner: 'hyper-1',

      subscribe: function(comp, callback) {
        component = comp;
        busCallback = callback;
      },

      publish: function(msg) {
        console.log(msg);
      }
    };

    let db = new Syncher(mockBus);
    db.addSchema('Persons', {});

    let sObj = db.create('PTIN', 'Persons', {}, 'hyper-2');
    let data = sObj.data;

    expect(component).to.eql('syncher');

    busCallback({
      header: {type: 'add', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
      body: {res: 'PTIN', oType: 'object', attrib: '1',
        value: {
          name: 'Micael',
          birthdate: '28-01-1981',
          email: 'micael-xxx@gmail.com',
          phone: 911000000,
          obj1: { name: 'xpto'}
        }
      }
    });

    busCallback({
      header: {type: 'add', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
      body: {res: 'PTIN', oType: 'object', attrib: '2',
        value: {
          name: 'Luis Duarte',
          birthdate: '02-12-1991',
          email: 'luis-xxx@gmail.com',
          phone: 910000000,
          obj1: { name: 'xpto' }
        }
      }
    });

    setTimeout(() => {
      expect(data).to.eql({
        1: {name: 'Micael', birthdate: '28-01-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'xpto'}},
        2: {name: 'Luis Duarte', birthdate: '02-12-1991', email: 'luis-xxx@gmail.com', phone: 910000000, obj1: {name: 'xpto'}}
      });

      busCallback({
        header: {type: 'remove', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
        body: {res: 'PTIN', oType: 'object', attrib: '2'}
      });

      busCallback({
        header: {type: 'update', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
        body: {res: 'PTIN', oType: 'object', attrib: '1.name', value: 'Micael Pedrosa'}
      });

      busCallback({
        header: {type: 'update', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
        body: {res: 'PTIN', oType: 'object', attrib: '1.birthdate', value: '28-02-1981'}
      });

      busCallback({
        header: {type: 'update', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
        body: {res: 'PTIN', oType: 'object', attrib: '1.obj1.name', value: 'XPTO'}
      });

      setTimeout(() => {
        expect(data).to.eql({
          1: {name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}}
        });

        busCallback({
          header: {type: 'add', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
          body: {res: 'PTIN', oType: 'object', attrib: '1.arr', value: [1, 0, {x: 10, y: 20}]}
        });

        setTimeout(() => {
          expect(data).to.eql({
            1: {name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 0, {x: 10, y: 20}]}
          });

          busCallback({
            header: {type: 'update', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
            body:{res:'PTIN', oType: 'array', attrib: '1.arr.1', value: 2}
          });

          setTimeout(() => {
            expect(data).to.eql({
              1: {name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 2, {x: 10, y: 20}]}
            });

            busCallback({
              header: {type: 'add', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
              body: {res: 'PTIN', oType: 'array', attrib: '1.arr.3', value: [3]}
            });

            busCallback({
              header: {type: 'add', from: 'hyper-2', to: 'hyper-1', comp:'syncher'},
              body: {res: 'PTIN', oType: 'array', attrib: '1.arr.4', value: [{x: 1, y: 2}]}
            });

            setTimeout(() => {
              expect(data).to.eql({
                1: {name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 2, {x: 10, y: 20}, 3, {x: 1, y: 2}]}
              });

              busCallback({
                header: {type: 'remove', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
                body: {res: 'PTIN', oType: 'array', attrib: '1.arr.1', value: 2}
              });

              busCallback({
                header: {type: 'add', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
                body: {res: 'PTIN', oType: 'array', attrib: '1.arr.1', value: [10, 11, 12]}
              });

              busCallback({
                header: {type: 'update', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
                body: {res: 'PTIN', oType: 'object', attrib: '1.arr.5.x', value: 10}
              });

              setTimeout(() => {
                expect(data).to.eql({
                  1: {name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 10, 11, 12, 3, {x: 10, y: 2}]}
                });

                busCallback({
                  header: {type: 'remove', from: 'hyper-2', to: 'hyper-1', comp: 'syncher'},
                  body: {res: 'PTIN', oType: 'array', attrib: '1.arr.5', value: 1}
                });

                setTimeout(() => {
                  expect(data).to.eql({
                    1: {name: 'Micael Pedrosa', birthdate: '28-02-1981', email: 'micael-xxx@gmail.com', phone: 911000000, obj1: {name: 'XPTO'}, arr: [1, 10, 11, 12, 3]}
                  });

                  done();
                });
              });
            });
          });
        });
      });
    });
  });
});
