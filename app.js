'use strict'
const AWS = require('aws-sdk'); 
//TODO Add region parameter from ssm
AWS.config.update({region: process.env.REGION});
const s3 = new AWS.S3();

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.uploadHandler = async (event, context) => {
    try {

        if(event.queryStringParameters && event.queryStringParameters.file_name 
            && event.queryStringParameters.bucket_name){

            const s3Params = {
                Bucket: event.queryStringParameters.bucket_name,
                Key: event.queryStringParameters.file_name,
            }

            }

        return new Promise((resolve, reject)=>{
            let uploadURL = s3.getSignedUrl('putObject', s3Params);
            
            resolve({
                "statusCode": 200, 
                "isBase64Encoded": false, 
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": JSON.stringify({
                    "uploadURL": uploadURL
                })
            });
        });

    } catch (err) {
        console.log(err);
        return err;
    }
};
