import expect from 'expect.js';
import Syncher from '../src/sync/Syncher';

describe('Syncher', function() {
  it('verify sync messages', function(done) {
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

    //apply changes...
    data['1'] = {name: 'Micael', birthdate: new Date(1981, 1, 28), email: 'micael-xxx@gmail.com', phone: '911000000'};
    data['1'].obj1 = { name: 'xpto' };
    data['2'] = {name: 'Luis Duarte', birthdate: new Date(1991, 11, 2), email: 'luis-xxx@gmail.com', phone: '910000000', obj1: { name: 'xpto' }};

    expect(component).to.eql('syncher');

    setTimeout(() => {
      expect(msgList).to.eql([
        {
          header: {type: 'add', to: 'hyper-2', comp: 'syncher'},
          body: {res: 'PTIN', oType: 'object', attrib: '1',
            value: {
              name: 'Micael',
              birthdate: '1981-02-28T00:00:00.000Z',
              email: 'micael-xxx@gmail.com',
              phone: '911000000',
              obj1: { name: 'xpto'}
            }
          }
        },

        {
          header: {type: 'add', to: 'hyper-2', comp: 'syncher'},
          body: {res: 'PTIN', oType: 'object', attrib: '2',
            value: {
              name: 'Luis Duarte',
              birthdate: '1991-12-02T00:00:00.000Z',
              email: 'luis-xxx@gmail.com',
              phone: '910000000',
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
});
