import json
import boto3

client = boto3.client('s3')

def lambda_handler(event,context):
    bucket = event['bucket']
    key = event['key']
    
    response = client.get_object(
        Bucket = bucket, 
        Key = key
    ) 
    
    json_data= response['Body'].read()
    data_string = json_data.decode("UTF-8")
    data_dict = json.loads(data_string)
    return {
        'statuscode': 200,
        'body': 'data_dict'
    }
  
    
    

