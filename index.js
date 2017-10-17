'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});
const Sharp = require('sharp');

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;

const widths = [400, 800];

exports.handler = function(event, context, callback) {
  const key = event.queryStringParameters.key;
  const match = key.match(/(\d+)\/(.*)/);
  const width = parseInt(match[1], 10);
  const originalKey = match[2];
  if(widths.indexOf(width) >= 0 && originalKey.substring(0, 13) == 'bouldersPics/'){
      S3.getObject({Bucket: BUCKET, Key: originalKey}).promise()
          .then(data => Sharp(data.Body)
              .resize(width)
              .toFormat('jpeg')
              .toBuffer()
          )
          .then(buffer => S3.putObject({
                  Body: buffer,
                  Bucket: BUCKET,
                  ContentType: 'image/jpeg',
                  Key: key,
              }).promise()
          )
          .then(() => callback(null, {
                  statusCode: '301',
                  headers: {'location': `${URL}/${key}`},
                  body: '',
              })
          )
          .catch(err => callback(err))
  }
}
