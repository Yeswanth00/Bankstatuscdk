import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "Bankstatusbucket",{
      bucketName : 'demobankstatus-cdk',
    });

    const iamstatusrole = new iam.Role(this, 'bankRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      roleName: 'bankingrole',
      description : 'This is a custom role for bankcheck',
    })
    iamstatusrole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));

    const banklambda = new lambda.Function(this, 'logicallambda',{
      handler: 'lambda.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_11,
      code: lambda.Code.fromAsset('../services'),
      role: iamstatusrole,
      environment: {
        VARIABLE_1: 'bankstatus-cdk',
        VARIABLE_2: 'DynamoDB_Samplefile (1).json',
      },

    })
       
    const bankrestapi = new apigateway.LambdaRestApi(this,'Lambdarestapi',{
      handler: banklambda ,
      restApiName: 'bankingrestapi',
      deploy: true,
      proxy:false 
    }) 
    
      const books = bankrestapi.root.addResource('banking');
        books.addMethod('GET');
      }
}
