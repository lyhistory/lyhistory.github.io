(window.webpackJsonp=window.webpackJsonp||[]).push([[331],{759:function(e,a,t){"use strict";t.r(a);var s=t(65),n=Object(s.a)({},(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h2",{attrs:{id:"vpc"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#vpc"}},[e._v("#")]),e._v(" VPC")]),e._v(" "),t("h3",{attrs:{id:"basics-for-creating-an-internet-connected-vpc"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#basics-for-creating-an-internet-connected-vpc"}},[e._v("#")]),e._v(" Basics for creating an Internet-connected VPC")]),e._v(" "),t("ol",[t("li",[t("p",[e._v("Choosing an address range\nRecommended: RFC1918 range /16(64K addresses) 172.31.0.0/16 (avoid ranges that overlap with other networks to which you might connect)")])]),e._v(" "),t("li",[t("p",[e._v("Setting up subnets in Availability Zones\nRecommended: /24 subnets(251 addresses)\nexample: one subnet per Availability Zone:\nAvailability Zone 1: 172.31.0.0/24\nAvailability Zone 2: 172.31.1.0/24\nAvailability Zone 3: 172.31.2.0/24")])]),e._v(" "),t("li",[t("p",[e._v("Creating a route to the Internet")])])]),e._v(" "),t("ul",[t("li",[e._v("Route tables contain rules for which packets go where")]),e._v(" "),t("li",[e._v("Your VPC has a default route table")]),e._v(" "),t("li",[e._v("but you can assign different route tables to different subnets\nexample:")])]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("default:\nDestination     Target\n172.31.0.0/16   local\n\nafter create internet gateway:\nDestination     Target\n172.31.0.0/16   local\n0.0.0.0/0       igw-xxxxxx\n")])])]),t("ol",{attrs:{start:"4"}},[t("li",[e._v("Authorizing traffic to/from the VPC")])]),e._v(" "),t("ul",[t("li",[e._v("Network ACLs = stateless firewall rules")]),e._v(" "),t("li",[e._v("Security groups = stateful firewall")])]),e._v(" "),t("h3",{attrs:{id:"more-scenarios"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#more-scenarios"}},[e._v("#")]),e._v(" More scenarios")]),e._v(" "),t("ul",[t("li",[e._v("non-internet facing VPC access the internet by routing to NAT in the internet facing VPC")]),e._v(" "),t("li",[e._v("VPC Peering\n"),t("ol",[t("li",[e._v("Initiate peering request")]),e._v(" "),t("li",[e._v("Accept peering request")]),e._v(" "),t("li",[e._v("create routes")])])]),e._v(" "),t("li",[e._v("Extend your own network to VPC\n"),t("ul",[t("li",[e._v("VPN")]),e._v(" "),t("li",[e._v("Direct Connect")])])])]),e._v(" "),t("h2",{attrs:{id:"the-aws-command-line-interface-cli"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#the-aws-command-line-interface-cli"}},[e._v("#")]),e._v(" The AWS Command Line Interface (CLI)")]),e._v(" "),t("p",[e._v("is a unified tool to manage your AWS services. With just one tool to download and configure, you can control multiple AWS services from the command line and automate them through scripts.")]),e._v(" "),t("p",[e._v("The AWS CLI v2 offers several new features including improved installers, new configuration options such as AWS Single Sign-On (SSO), and various interactive features.")]),e._v(" "),t("p",[e._v("All IaaS (infrastructure as a service) AWS administration, management, and access functions in the AWS Management Console are available in the AWS API and AWS CLI.")]),e._v(" "),t("p",[e._v("The AWS CLI provides direct access to the public APIs of AWS services. You can explore a service's capabilities with the AWS CLI, and develop shell scripts to manage your resources. In addition to the low-level, API-equivalent commands, several AWS services provide customizations for the AWS CLI.")]),e._v(" "),t("p",[e._v("https://aws.amazon.com/cli/")]),e._v(" "),t("p",[e._v("install:\nhttps://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html")]),e._v(" "),t("p",[e._v("region:\neu-central-1\nus-east-2")]),e._v(" "),t("h3",{attrs:{id:"config"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#config"}},[e._v("#")]),e._v(" config")]),e._v(" "),t("p",[e._v("https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("$ aws help\n$ aws autoscaling help\n$ aws autoscaling create-auto-scaling-group help\n\naws configure\n$ aws configure --profile produser\n$ aws s3 ls --profile produser\n\n~/.aws/credentials\nC:\\Users\\USERNAME\\.aws\\credentials\n~/.aws/config\nC:\\Users\\USERNAME\\.aws\\config\n\n$ aws configure import --csv file://credentials.csv\n\naws configure list\n\n")])])]),t("h3",{attrs:{id:"iam"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#iam"}},[e._v("#")]),e._v(" IAM")]),e._v(" "),t("p",[e._v("https://docs.aws.amazon.com/cli/latest/userguide/cli-services-iam.html")]),e._v(" "),t("h3",{attrs:{id:"amazon-elastic-compute-cloud-amazon-ec2-instances"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#amazon-elastic-compute-cloud-amazon-ec2-instances"}},[e._v("#")]),e._v(" Amazon Elastic Compute Cloud (Amazon EC2) instances")]),e._v(" "),t("p",[e._v("https://docs.aws.amazon.com/cli/latest/userguide/cli-services-ec2.html")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('aws ec2 describe-instances\n\n$ aws ec2 describe-instances\n\n$ aws ec2 start-instances --instance-ids i-1348636c\n\n$ aws sns publish --topic-arn arn:aws:sns:us-east-1:546419318123:OperationsError --message "Script Failure"\n\n$ aws sqs receive-message --queue-url https://queue.amazonaws.com/546419318123/Test\n')])])]),t("h3",{attrs:{id:"amazon-simple-storage-service-s3"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#amazon-simple-storage-service-s3"}},[e._v("#")]),e._v(" Amazon Simple Storage Service - S3")]),e._v(" "),t("p",[e._v("https://docs.aws.amazon.com/cli/latest/userguide/cli-services-s3.html\nhttps://docs.aws.amazon.com/cli/latest/userguide/cli-services-glacier.html\nFile Commands for Amazon S3")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("$ aws s3 ls s3://mybucket\n$ aws s3 cp myfolder s3://mybucket/myfolder --recursive\n$ aws s3 sync myfolder s3://mybucket/myfolder --exclude *.tmp\n\n")])])]),t("h3",{attrs:{id:"dynamodb"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#dynamodb"}},[e._v("#")]),e._v(" dynamodb")]),e._v(" "),t("p",[e._v("https://docs.aws.amazon.com/cli/latest/userguide/cli-services-dynamodb.html")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("$ aws dynamodb list-tables\n")])])]),t("h3",{attrs:{id:"amazon-sns"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#amazon-sns"}},[e._v("#")]),e._v(" Amazon SNS")]),e._v(" "),t("p",[e._v("https://docs.aws.amazon.com/cli/latest/userguide/cli-services-sns.html")]),e._v(" "),t("h3",{attrs:{id:"amazon-swf"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#amazon-swf"}},[e._v("#")]),e._v(" Amazon SWF")]),e._v(" "),t("p",[e._v("https://docs.aws.amazon.com/cli/latest/userguide/cli-services-swf.html")]),e._v(" "),t("h3",{attrs:{id:"others"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#others"}},[e._v("#")]),e._v(" others")]),e._v(" "),t("p",[e._v("Perform Basic Kinesis Data Stream Operations Using the AWS CLI:\nhttps://docs.aws.amazon.com/streams/latest/dev/fundamental-stream.html")]),e._v(" "),t("h3",{attrs:{id:"troubleshooting"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#troubleshooting"}},[e._v("#")]),e._v(" troubleshooting")]),e._v(" "),t("p",[e._v("debug:")]),e._v(" "),t("p",[e._v("aws command --debug")]),e._v(" "),t("p",[e._v("error:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("An error occurred (AuthFailure) when calling the DescribeInstances operation: AWS was not able to validate the provided access credentials\n\nAn error occurred (UnauthorizedOperation) when calling the DescribeInstances operation: You are not authorized to perform this operation.\n\n")])])]),t("h2",{attrs:{id:"aws-shell"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#aws-shell"}},[e._v("#")]),e._v(" aws shell")]),e._v(" "),t("p",[e._v("https://github.com/awslabs/aws-shell")]),e._v(" "),t("h2",{attrs:{id:"aws-security-reference-architecture"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#aws-security-reference-architecture"}},[e._v("#")]),e._v(" AWS Security Reference Architecture")]),e._v(" "),t("p",[t("a",{attrs:{href:"https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/welcome.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("AWS Security Reference Architecture"),t("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=n.exports}}]);