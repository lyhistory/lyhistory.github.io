
## The AWS Command Line Interface (CLI)
is a unified tool to manage your AWS services. With just one tool to download and configure, you can control multiple AWS services from the command line and automate them through scripts.

The AWS CLI v2 offers several new features including improved installers, new configuration options such as AWS Single Sign-On (SSO), and various interactive features. 

All IaaS (infrastructure as a service) AWS administration, management, and access functions in the AWS Management Console are available in the AWS API and AWS CLI.

The AWS CLI provides direct access to the public APIs of AWS services. You can explore a service's capabilities with the AWS CLI, and develop shell scripts to manage your resources. In addition to the low-level, API-equivalent commands, several AWS services provide customizations for the AWS CLI.

https://aws.amazon.com/cli/

install:
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html


region:
eu-central-1
 us-east-2

### config
https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
```
$ aws help
$ aws autoscaling help
$ aws autoscaling create-auto-scaling-group help

aws configure
$ aws configure --profile produser
$ aws s3 ls --profile produser

~/.aws/credentials
C:\Users\USERNAME\.aws\credentials
~/.aws/config
C:\Users\USERNAME\.aws\config

$ aws configure import --csv file://credentials.csv

aws configure list

```
### IAM
https://docs.aws.amazon.com/cli/latest/userguide/cli-services-iam.html

###  Amazon Elastic Compute Cloud (Amazon EC2) instances
https://docs.aws.amazon.com/cli/latest/userguide/cli-services-ec2.html
```
aws ec2 describe-instances

$ aws ec2 describe-instances

$ aws ec2 start-instances --instance-ids i-1348636c

$ aws sns publish --topic-arn arn:aws:sns:us-east-1:546419318123:OperationsError --message "Script Failure"

$ aws sqs receive-message --queue-url https://queue.amazonaws.com/546419318123/Test
```

### Amazon Simple Storage Service - S3
https://docs.aws.amazon.com/cli/latest/userguide/cli-services-s3.html
https://docs.aws.amazon.com/cli/latest/userguide/cli-services-glacier.html
File Commands for Amazon S3
```
$ aws s3 ls s3://mybucket
$ aws s3 cp myfolder s3://mybucket/myfolder --recursive
$ aws s3 sync myfolder s3://mybucket/myfolder --exclude *.tmp

```

### dynamodb 
https://docs.aws.amazon.com/cli/latest/userguide/cli-services-dynamodb.html
```
$ aws dynamodb list-tables
```

### Amazon SNS
https://docs.aws.amazon.com/cli/latest/userguide/cli-services-sns.html

### Amazon SWF
https://docs.aws.amazon.com/cli/latest/userguide/cli-services-swf.html

### others

Perform Basic Kinesis Data Stream Operations Using the AWS CLI:
https://docs.aws.amazon.com/streams/latest/dev/fundamental-stream.html

### troubleshooting

debug:

aws command --debug

error:
```
An error occurred (AuthFailure) when calling the DescribeInstances operation: AWS was not able to validate the provided access credentials

An error occurred (UnauthorizedOperation) when calling the DescribeInstances operation: You are not authorized to perform this operation.

```

## aws shell
https://github.com/awslabs/aws-shell
