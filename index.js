const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Get the bucket and object key from the event
    const sourceBucket = event.Records[0].s3.bucket.name;
    const sourceKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    // Define the destination bucket
    const destinationBucket = 'socialboulderdev';
    
    // Define the copy source
    const copySource = `/${sourceBucket}/${sourceKey}`;
    
    try {
        // Copy the object
        await s3.copyObject({
            CopySource: copySource,
            Bucket: destinationBucket,
            Key: sourceKey
        }).promise();
        
    } catch (err) {
        throw err;
    }
};
