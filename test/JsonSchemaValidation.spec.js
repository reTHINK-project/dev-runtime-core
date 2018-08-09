
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiJsonSchema from 'chai-json-schema';
import tv4 from "tv4";
//import chai.tv4 from "chai.tv4";

let expect = chai.expect;
let assert = chai.assert;
let should = chai.should();
// let tv4 = chai.tv4();


chai.use(chaiAsPromised);
chai.use(chaiJsonSchema);

//Testing the Message factory the chai
let goodApple = {
    skin: "thin",
    colors: ["red", "green", "yellow"],
    taste: 10
};
let badApple = {
    colors: ["brown"],
    taste: 0,
    worms: 2
};
let fruitSchema = {
    "title": "fresh fruit schema v1",
    "type": "object",
    "required": ["skin", "colors", "taste"],
    "properties": {
        "colors": {
            "type": "array",
            "minItems": 1,
            "uniqueItems": true,
            "items": {
                "type": "string"
            }
        },
        "skin": {
            "type": "string"
        },
        "taste": {
            "type": "number",
            "minimum": 5
        }
    }
};


describe('schema validation of good Apple', () => {
    describe('good Apple should be good', () => {
        it('should return false instead of true', () => {
            //bdd style
            expect(goodApple).to.be.jsonSchema(fruitSchema);
            expect(badApple).to.not.be.jsonSchema(fruitSchema);

            //tdd style
            assert.jsonSchema(goodApple, fruitSchema);
            assert.notJsonSchema(badApple, fruitSchema);

            goodApple.should.be.jsonSchema(fruitSchema);
            badApple.should.not.be.jsonSchema(fruitSchema);
        });
    });
});

describe('adding new schema', () => {
    it('should add a new schema', ()=>{
        //tv4.addSchema(uri, schema);

        let list = chai.tv4.getMissingUris();
        let uris = chai.tv4.getMissingUris(/^https?:/);
        let urisSchema = chai.tv4.getSchemaUris(/example.com/);

        let schema = chai.tv4.getSchema('http://example.com/item');
        console.log('This is the schema', schema);

    });
});
