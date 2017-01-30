import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(sinonChai);

import {encodeUTF8, decodeUTF8} from '../src/identity/utf8.js';

describe('encode decode function', function() {

    it('should encode a string', () => {
        let string = '1485798154207';
        let buf = encodeUTF8(string);
        let str = decodeUTF8(buf);
        expect(str).to.equal(string);
    });
});
