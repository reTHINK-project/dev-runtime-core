import tv4 from './tv4';

export function schemaValidation(scheme, descriptor, value) {

  console.log('Scheme: ', scheme);

  // schema validation
  console.log('Running object validation...');
  try {
    let obj = value;
    let schema = descriptor.sourcePackage.sourceCode;

    // add support for schema referencing itself
    tv4.addSchema(schema.id, schema);

    // validate
    let result = tv4.validateMultiple(obj, schema);

    // delete error stacks to improve logging
    result.errors.forEach((error) => {
      delete error.stack;
    });

    // print more details about validation if it fails or schema contains $refs
    if (!result.valid || (result.missing.length > 0)) {
      console.warn('Object validation ' + (result.valid ? 'succeeded, but schema contained references:' : 'failed:'), JSON.stringify(result, null, 2));
      console.debug('Object:', JSON.stringify(obj, null, 2), '\r\nSchema:', JSON.stringify(schema, null, 2));
    } else {
      console.log('Object validation succeeded');
    }
  } catch (e) {
    console.warn('Error during object validation:', e);
  }

}
