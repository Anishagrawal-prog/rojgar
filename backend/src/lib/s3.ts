import AWS from 'aws-sdk';
const s3 = new AWS.S3({
  region: process.env.S3_REGION
});

export function getSignedUploadParams(key: string, contentType: string) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: key,
    Expires: 60 * 5,
    ContentType: contentType,
    ACL: 'private'
  };
  return s3.getSignedUrlPromise('putObject', params);
}
