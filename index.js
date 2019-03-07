console.log('Loading function');

const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const fs = require('fs');
const request = require('request');
const http = require('http');
const path = require('path');
const { promisify } = require('util');

const writeFilePromisified = promisify(fs.writeFile);
const readFilePromisified = promisify(fs.readFile);

exports.handler = async (event, context) => {
  // console.log('Received event:', JSON.stringify(event, null, 2));

  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  console.log('Bucket: ', bucket, ' | Key: ', key);

  const params = {
    Bucket: bucket,
    Key: key,
  };

  var s3Object;
  try {
    s3Object = await s3.getObject(params).promise();
    // console.log('S3 Object:', s3Object);

  } catch (err) {
    console.log(err);
    const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }

  try {
    await writeFilePromisified(`/tmp/${key}`, s3Object.body);
    // const fileCreatePromise = await writeFilePromisified('/tmp/acme.txt', 'This is a file with test content.');
  
  } catch (err) {
    console.log(err);
    const message = `Error writing the file to /tmp folder.`;
    console.log(message);
    throw new Error(message);
  }

  try {
    // const readFilePromise = await readFilePromisified(`/tmp/${key}`);
    // // const readFilePromise = await readFilePromisified('/tmp/acme.txt');
    // console.log('readFilePromise: ', readFilePromise.toString());

    // var installPromise = await invokeAEMInstallURL(key);
    // console.log('installPromise: ', installPromise);

    invokeAEMInstallURL(key);
    
    console.log('Exit');

  } catch (err) {
    console.log(err);
    const message = `Error invoking the HTTP request.`;
    console.log(message);
    throw new Error(message);
  }
};

/**
 * 
 * @param {*} fileName
 * This method is used to invoke an http request in place of the curl command
 * curl
 *  -u admin:admin 
 *  -F file=@"/Users/alfchemm/Downloads/we.retail.community.content-1.11.50.zip" 
 *  -F name="we.retail.community.content-1.11.50" 
 *  -F force=true 
 *  -F install=true 
 *  http://localhost:4502/crx/packmgr/service.jsp 
 */

const invokeAEMInstallURL = (key) => {
  console.log ('invokeAEMInstallURL | key: ', key);
  const filePath = `@/tmp/"${key}"`;
  const fileName = path.parse(key).name; 
  var formData = {
    file: filePath,
    name: fileName,
    force: 'true',
    install: 'true'
  };
  
  var options = {
    url: 'http://localhost:4502/crx/packmgr/service.jsp',
    method: 'POST',
    auth: {
      'user': 'admin',
      'pass': 'admin'
    },
    formData
  };
  console.log('options:', options);
  
  var callback = (error, response, body) => {
    console.log ('invokeAEMInstallURL | callback: ', response);
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  };

  request(options, callback);
  
};

// const invokeAEMInstallURL = (key) => {
//   console.log ('invokeAEMInstallURL | key: ', key);
//   const filePath = `@/tmp/"${key}"`;
//   const fileName = path.parse(key).name; 
//   var formData = {
//     file: filePath,
//     name: fileName,
//     force: 'true',
//     install: 'true'
//   };
  
//   var options = {
//     url: 'https://www.google.com',
//     method: 'GET',
//   };
//   console.log('options:', options);

//   const req = http.request(options, (res) => {
//     console.log('Res: ', res);
//     resolve('Success');
//   });

//   req.on('error', (e) => {
//     reject(e.message);
//   });

//   // send the request
//   req.write(JSON.stringify(formData));
//   req.end();

// }

// const invokeAEMInstallURL = (key) => {
//   return new Promise((resolve, reject) => {
//     const filePath = `@/tmp/"${key}"`;
//     const fileName = path.parse(key).name; 
//     var formData = {
//       file: filePath,
//       name: fileName,
//       force: 'true',
//       install: 'true'
//     };
  
//     var options = {
//       url: 'http://localhost:4502/crx/packmgr/service.jsp',
//       method: 'POST',
//       auth: {
//         'user': 'admin',
//         'pass': 'admin'
//       }
//     };
//     console.log('options:', options);
//     const req = http.request(options, (res) => {
//       console.log('Res: ', res);
//       resolve('Success');
//     });

//     req.on('error', (e) => {
//       reject(e.message);
//     });

//     // send the request
//     req.write(JSON.stringify(formData));
//     req.end();
//   });
// };

