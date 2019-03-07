# astridAEMPackageDeployer
Lambda function to take a deployment package from a S3 bucket and deploy it to an AEM instance using it's cURL

TO-DO:
Reading a file from S3 bucket and creating it within the Lambda instance works.
Need to verify if deploying it to AEM via http request works or not (was unable to test it locally).
Find a viable cURL library in node to get away from the http request implementation.
