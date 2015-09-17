import expect from 'expect.js';
import Pipeline from '../src/Pipeline';

describe('Pipeline', function() {
  it('fail detected', function() {
    var errorResult = 'none';
    var msgResult;

    let pipeline = new Pipeline((error) => {
      errorResult = error;
    });

    pipeline.handlers = [
      function(ctx) {
        ctx.msg.value++;
        msgResult = ctx.msg;
        ctx.fail('error-msg');
      },
      function(ctx) {
        ctx.msg.value++;
        ctx.next();
      }
    ];

    pipeline.process({id: 1, value: 0}, (msg) => {
      msg.result = 'OK';
      msgResult = msg;
    });

    expect({id: 1, value: 1}).to.eql(msgResult);
    expect('error-msg').to.eql(errorResult);
  });

  it('deliver detected', function() {
    var errorResult = 'none';
    var msgResult;

    let pipeline = new Pipeline((error) => {
      errorResult = error;
    });

    pipeline.handlers = [
      function(ctx) {
        ctx.msg.value++;
        ctx.deliver();
      },
      function(ctx) {
        ctx.msg.value++;
        ctx.next();
      }
    ];

    pipeline.process({id: 1, value: 0}, (msg) => {
      msg.result = 'OK';
      msgResult = msg;
    });

    expect({id: 1, value: 1, result: 'OK'}).to.eql(msgResult);
    expect('none').to.eql(errorResult);
  });

  it('sequence processor', function() {
    var errorResult = 'none';
    var msgResult;

    let pipeline = new Pipeline((error) => {
      errorResult = error;
    });

    pipeline.handlers = [
      function(ctx) {
        ctx.msg.value++;
        ctx.next();
      },
      function(ctx) {
        ctx.msg.value++;
        ctx.next();
      }
    ];

    pipeline.process({id: 1, value: 0}, (msg) => {
      msg.result = 'OK';
      msgResult = msg;
    });

    expect({id: 1, value: 2, result: 'OK'}).to.eql(msgResult);
    expect('none').to.eql(errorResult);
  });

});
