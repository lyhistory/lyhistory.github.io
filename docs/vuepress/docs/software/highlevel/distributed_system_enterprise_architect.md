
## 1. Enterprise Project Management - Overview
PM:	Project Management
SQM:	Software Quality Management
EA:	Enterprise Architecture
Business requirements, project constraints, Technology Options
Scope, Time, Resource
Consistency Integrity Availability
BPM:	Business Process Management
business requirements, Resource, People, IT
EI:	Enterprise Integration

## 2. Enterprise Architecture
Layering&Tier(Distribute) impact Architect
Performance impact Architect
Flexibility impact Architect
Extensibility impact Architect

### 2.1 Business Architect
Business Model?
new business process? existing business process?
centralize? distribute? de-centralize? for example, bank transaction operation

### 2.2 Database Architect
traditional database ? big data? blockchain?
Private Blockchain or Database? https://medium.com/blockchain-review/private-blockchain-or-database-whats-the-difference-523e7d42edc
 
MongoDB and HBase Compared https://www.mongodb.com/compare/mongodb-hbase
Big Data Analytics 3: Machine Learning to Engage the Customer, with Apache Spark, IBM Watson, and MongoDB https://www.mongodb.com/presentations/big-data-analytics-3-machine-learning-to-engage-the-customer-with-apache-spark-ibm-watson-and-mongodb

### 2.3 Application Architect
new application? existing application?
Concerns
CAP
Cluster loadbalancer http://standardwisdom.com/softwarejournal/2009/09/clustering-vs-load-balancing-what-is-the-difference/
high available
high performance
 
which put in the same zone(intranet, internet)

### 2.4 Tech Architect
Development mode? deployment mode? network ?
docker ? (network config, cluster config, mapping) vm?
cluster? distributed? decentralized?
what is cluster:
ha proxy (not cluster, but only switch server when one server down) http://www.haproxy.org/
Hadoop nodes (not cluster but distributed system)
security? cloud or blockchain or...
https://genaro.network/en/gsp
Proxy server https://en.wikipedia.org/wiki/Proxy_server

## 3. Solution Architecture
Explain how the application architecture fits into the broader context of organizational business goals and enterprise architecture.
Design the architecture with emphasis on the software quality attributes and their tradeoffs.
Design common application integration components.
Describe the software architecture with views and viewpoints.
Perform threat modeling to identify the threats, vulnerabilities and recommend appropriate controls.
Undertake capacity planning.

### 3.1 Introduce to Solution Architecture( Software Architecture/System Architecture/Network Architecture/Integration Architecture)

1).Enterprise Architecture vs Solution Architecture

Enterprise Architecture is the organizing logic for business processes and IT infrastructure reflecting the integration and standardization requirements of the firm's operating model.  A conceptual blueprint that defines the structure and operation of the organization. The intent of an enterprise architecture is to determine how an organization can most effectively achieve its current and future objectives.
Solution Architecture: Construction ICT projects (Information and communication technology) requires thought, analysis and design, the product of which is 'the solution'. Solution can be defined by business requirements(what is needed), project constraints, and available technology options. The overlap of these three influences is the logical solution. Solution Architecture commonly describes the components required for and end-to-end solution, tying together patterns from more than one domain.

2).Architecture vs Detailed Design

| Architecture | Detailed Design |
| -- | -- |
| Representing High Level Components | Representing sufficient details for implementing the system |
| Defines guidelines, standards, policies and constraints | Defines methods and tools for implementation and within the architectural decisions made. |
| Address overall system level issues such as physical distribution of components, software qualities | Address specific component implementation within the architectural decisions made. |

3).Responsibilities & Activities

Responsibilities: Solution Viability, Leadership&Communication, Project Management(Technical areas)
Activities:
1. Assessment of the business requirements for an initative
2.Shortlist&compare feasible technical solutions
3.Articulate the selected solution into a design
4.Align the selected technologies&design with the rest of the enterprise
5.Define the integration of components of the design&the rest of the enterprise(interfaces)
6.Investigate patterns of reuse, security single point of failure, calculate the capacity&reliability required for each 'stress point' in the design
7.Support the specification&construction of the design to completion.

4).Software Quality Attributes ( how well the software is designed & how well the software conforms to the design)

![](/docs/docs_image/software/architecture/enterprise_architecture01.png)

### 3.2 Architect the Solution Architecture (Asset)

1.Assets Metamodel

2.Pattern:
1.Idioms  low-level patterns specific to a programming language
2.Design Patterns
3.Architectural Styles

Structural
	Client-Server / Tiered Computing / Network Components / Server Components (service execution, B2C integration, Service and B2B integration, Service management and governance, Data Persistence) / Peer to Peer
Communication
	Data Flow /

3.Components and Integration
4.Description

### 3.3 Architect the Solution Architecture (Method)

Design for performance in Architecture
Performance Metrics
	Speed
	Throughput
	Arrival Rate
	Output Rate
	Utilization
	Think Time
	Response Time=Network latency+Service Time+Wait Time / Queue Time
	Time to First Byte
	Time to Last Byte
![](/docs/docs_image/software/architecture/enterprise_architecture02.png)

https://www.w3.org/TR/navigation-timing/
request rate ? throughput

Time and Throughput:  Speed, max/min per hour,
	Faster response time generally lead to better throughput
Request Rate and Throughput: req/s,
	if a system has continuous request rate of 2 req/s and the system can cope with it
	If the system capacity is only able to computer 2 responses ever second
Throughput and Load: Fully loaded, idle
Utilization Load and Throughput:
	Used / available resources Time
https://theperformanceengineer.com/2013/09/11/loadrunner-how-to-calculate-transaction-per-second-tps/
Case Study:
Pokeman GO: http://architizer.com/blog/architecture-in-video-games-pokemon-go/
https://www.quora.com/What-is-the-client-server-architecture-for-Pok%C3%A9mon-GO-like
Microservices SOA API: http://www.ibm.com/developerworks/websphere/library/techarticles/1601_clark-trs/1601_clark.html
https://www.infoq.com/news/2015/12/soa-v-microservices

## 4. Enterprise Integration

### 4.1 Basic
Definition:
Creation of new business solutions by enabling systems(applications/databases/interfaces/people) to exchange business-critical information in real-time.Include both the process of creating the solution and the tools and services required to develop the solution.

Scope:
Enterprise Application Integration
B2B
B2C - Web/Portal Integration
Drivers：
Mergers and acquisitions
Adoption of packaged applications for processes (back and front office: CRM)

Existence of legacy applications and organization is undergoing technology transition.
Emergence of Web as a business channel
Need for straight through processing
Supply chain management.
Benefits:
Improve customer relationship
Improve supply-chain relationship
Enables automation of business processes
Supports rapid introduction of new solutions
Enhances visibility of information and processes
Levels:
-integration model defines the nature of and mechanisms for integration
Process/Workflow level
Application level
Data level
Interface level(screen scraping)
Key issues considered: scalability flexibility vs complexity Batched mode vs event trigger Consistency Volume of Data Velocity

Communication Models:
Synchronous(Request reply, Request acknowledge)
Asynchronous(Publish subscribe, Point-to-Point,Broadcast)

B2B Integration :
(Secured coordination of information between business and their information systems)
●	Models(Peer-to-Peer, Hub-and-Spoke)
●	Components
●	Standards

Summary:
●	As an organization matures, Enterprise Integration must be the centerpiece that orchestrate and streamline the business processes of the organization.
●	The scope of EI is not just within the organization but includes linking its customer and its partners. It's about integrating the entire value chain.
●	The trend of EI is moving towards On-Demand Integration and Standards based.
●	There are 4 basic levels that EI can occur: Screen,Data,Application and Process/Workflow. EI must usually work at more than one level concurrently.

### 4.2 Traditional Middleware
Middleware is an enabling layer of software which supports communication between application components on client and server(makes multiple computer a single coherent system to the user);
Middleware is the transport software that allows you to move information from one system/application/database to another, by shielding the developer from low level communication protocols, operating systems and hardware platform;
Middleware resides between business application & network infrastructure.

	File Transfer Middleware
	Remote Procedure Call Middleware(RPC)
	Distributed Object Technology Middleware
	Database Middleware
	Web Service
	Message Oriented Middleware(MOM)
	
### 4.3 Advanced Integration Technologies
Integration Broker
Integration Patterns

### 4.4 Service Oriented Architecture

#### 4.4.1 Introduction
Describe:
What is: SOA is architecture( a set of best practice for the organization and use of IT, and discipline to follow them);Abstracts software functionality as loosely-coupled, business-oriented Services;Services can be composed into applications which implement business process in a flexible way without programming.
Messaging Backbone -> EAI --> Service Oriented Integration
Service :
is a discoverable software resource, can be governed by declarative policies.
Different things to different people
Business:
Architecture:
Implementation:
Operations:

Define:
A service -
a logical representation of a repeatable business activity that has a specified outcome;
is self-contained;
may be composed of other services;
is a 'black box' exposed by a 'provider' to 'consumers' of the service
Service orientation is a way of thinking in terms of services and service-based development and the outcomes of services.
Service-Oriented Architecture is an architectural style that supports service orientation.
An approach for building distributed systems that allow tight correlation between the business model and the IT implementation.
Characteristics:
Represents business function as a service;
Shifts focus to application assembly rather than implementation details;
Allows individual software assets to become building blocks that can be reused in developing composite applications representing business processes.
Leverages open standards to represent software

#### 4.4.2 SOA Architecture
Principles:
Standardized Service Contract
Service Loose Coupling
Service Abstractioin
Service Reusability
Service Autonomy
Service Composability
Service Discoverability
Interoperability
Core Principles:
Service Invocation: The communication mechanism & model
Service Virtualization: Multiple providers act as one service
Service Reuse: Developing new applications from existing services
Service Brokering: Facilitating discovery of and binding to services
The Reference Model:
Service:
Dynamics: Visibility; Interacting with services(often accomplished by sending and receiving messages or modifying shared state of resource); Real world effect
Service Description
Policies and Contracts
Execution context
SOA Reference Architecture - Layers of the IBM SOA solution stack
Layer 1 - Operational Layer
Layer 2 - Service Component Layer
Layer 3 - Service Layer
Layer 4 - Business Process Layer (compositions and choreographs of services exposed in layer 3
Layer 5 - Consumer Layer
Layer 6 - Integration Layer ( is a key enabler for an SOA; Enterprise Service Bus - acts like a super-middleman;Ensures that consumer can talk with service provider;Primarily integrates layers 2 to 4)
Layer 7 - Quality of Service Layer( Inherent in SOA characteristics that exacerbate existing QoS concerns:Service virtualization, Loose coupling, Composition of services, Widespread use of XML; Monitor, log and signal non-compliance of requirements relating to service qualities; Enforcement of security policies)
Layer 8 - Information Architecture and Business Intelligence Layer
Layer 9 - Governance Layer

#### 4.4.3 SOA Methodology (Value Proposition&Return on Investment)

SOA Value Proposition:
Any business or IT initiative and investment should yield results.The value propositions tries to provide an estimate of benefits that an investment in SOA is likely to yield benefits.
Involves:
Providing an Imperative Analysis;
Understanding what the Return on Investment is.
Understanding the tangible and intangible benefits of SOA.
Evolving 'hot' domains where SOA brings in greatest value.
The value of SOA:
Top-line benefits: Increasing business agility and reducing risk
Bottom-line benefits: Reducing integration expense and increasing asset reuse
Revenue Generation:
Time to Market(Agility)
Improved Service
Extended Value Chain
Cost Saving:
Development and Integration
Maintenance and Support
Operations
Imperative Analysis:
Business Challenges: A business imperative is an organizational challenge of such gravity that failing to change or improve it may imperil the organization.
IT Challenges: IT imperative is a challenge or roadblock that the CIO faces that has detrimental effects on the organization's IT functioning.

Translating Business Context to SOA Value
SOA DRIVERS - motivating forces to SOA
used to focus the SOA initiative on spectific areas of business value chain where there is a great potential for an SOA initiative to deliver business results
Achieve better business agility
Achieve greater IT efficiency and productivity
Quickly respond to market and competitive threats
Improve 'time to market' goals
Enhance customer, supplier and partner collaboration.
SOA VALUE DRIVERS - measurable and can be tracked
example: Improve Business Agility
definition: Improve time to market for business initiative that rely on IT Systems.
measurement: Time difference between an established baseline metric based on past projects and services-based projects, based on calendar time elapsed.
SOA VALUE ANALYSIS
It is a technique that maps SOA value drivers to the organization's value chain/key business processes.
Helps in identifying likely businesses and process domains that offer great potential for achieving SOA value
Helps in prioritizing business and process domains
SOA Value Analysis Matrix
Hotspots ( clusters of high/medium value SOA opportunities exist)
it can validate or confirm areas of your business where SOA initiatives can add value
It may help in identifying new (overlooked) areas of emphasis where SOA can add value

#### 4.4.4 SOA Planning and Governance
Background : SOA Adoption Challenge
Ad Hoc SOA Adoption VS Program-based SOA Adoption
Organic versus Strategic Approach
SOA Pilot
Governance
Chains of responsibility
Policies
Control mechanisms
Communication
Measurement
Corporate Governance -- IT Governance -- SOA Governance
IT Governance is broader and covers all aspects of IT governance ( includes data governance and IT security)
SOA Governance is a catalyst for improving overall IT Governance, it addresses aspects of the service life cycle such as: Planning, Publish, Discover, Versioning, Management, Security
SOA Governance Model
Service Life-cycle Governance
SOA involves the creation of discrete, well-defined services
SOA exposes standalone application functionality at a fine-grained level of granularity, necessitating a new form of governance.
Design-Time Governance
Run-Time Governance
Change-Time Governance

#### 4.4.5 SOA Business Modeling Methodology (Preparing for SOA - Business Driven Approach
Business Modeling
Ensures that SOA initiative is truly a business initiative rather than a technology initiative
SOA initiative targets business results
SOA Needs Analysis
SOA Business Modeling
SOA Business Iteration
SOA Strategy Iteration
SOA Project Iteration
SOA Service Iteration
Prepare for SOA
SOA Roadmap:
Maturity
Scope/demension
Quality

#### 4.4.6 SOA Methodology - Service Identification
Methodology
SOA Methodology
known Methodology :
OASIS
SOMA
Top Down or Bottom Up
SOMA
●	It is a method with roles and activities that produce artifacts(workproducts) realting to the identification, specification and realization of services components and flows(processes).
●	SOMA is aimed at enabling target business processes through the identification, specification and realization of business-aligned services that form the SOA foundation.
●	It introduces new and innovative techniques where gaps exist in existing techniques, to specifically address SOA needs. SOMA enables creation of composable services.
●	It creates continuity between the business intent and IT implementation by extending business characteristics(e.g. goals and key performance indicators) into the IT analysis and architectural decisions.
●	Analysis and modeling performed during SOMA is technology and product agnostic, but establishes a context for making technology and product specific decisions in later phases of the lifecycle.
●	Its goal is to provide guidance in the modeling(analysis and design) of SOA.
SOMA activities are grouped into three major steps: Identification, Specification, and Realization Decisions.
At the heart of SOMA is the identification and specification of services, components, and flows.
Each step is carried out by applying one or more complementary techniques.
Service identification
Goal-Service Modeling
Domain Decomposition(Top down Analysis)
Process decomposition
Variation-oriented Analysis(Processes,Structure(data/semantics))
Existing Asset Analysis(Bottom-up Analysis)
Means to identify Candidate Services
●	Existing Asset Analysis
1.	Preexisting Services
■	Pilot/Prototype/Accidental/rouge
2.	Opportunistically via budgeted initiatives
3.	Existing business application
■	Replicating existing functionality
■	Aggregating existing functions
■	Fragmenting existing functions
●	Domain Decomposition
1.	Business or Domain expertise
2.	Core entity analysis
3.	Business process analysis(ideal)
Business process analysis steps:
1.	Perorm value chain analysis
2.	develop a high-level process map of your enterprise
3.	From this process map, identify candidate business services that relate to these major business proccesses.
4.	Based on these candidate business services prioritize and/or model these services.
Goal-Service Modeling
Goal - KPI

Appropriate Services?
Business Impact
Service feasibility
Technical Feasibility

Services Identification Process
1.	Identify potential business services using above techniques
2.	Identify business services that relate to business events, entities, processes and roles within your organization.
3.	Identify srevice reuse by consumer, high-level granularity across business functions and organizational boundaries.
4.	Prioritize these services based on business imperatives and SOA drivers.

### 4.5 RPC/web service/Mom/distributed object broker/message broker/service broker/Integration broker/EAI/BPM/ESB/Services/SOA

#### 4.5.1 MOM
Message oriented middleware (MOM) is a type of technology where as SOA is a type of architecture. Even though a lot of people think about web-service when they talk about SOA, you can use MOM to implement it as well (in fact in many cases that's the better option)
Message brokers - https://msdn.microsoft.com/en-us/library/ff648849.aspx
Message brokers are one (quite popular) kind of MOM. Another kind of MOM would be brokerless MOM, like ZeroMQ. With broker based MOM, all messages go to one central place: broker, and get distributed from there. Broker less MOM usually allows for peer to peer messaging (but does not exc lude option of central server as well) .
Message Bus - https://msdn.microsoft.com/en-us/library/ff647328.aspx
Publish/Subscribe - https://msdn.microsoft.com/en-us/library/ff649664.aspx
service broker
The service broker is meant to be a registry of services, and stores information about what services are available and who may use them. For example, UDDI which was originally conceived as a web service registry is now considered a SOA Service Broker.

https://www.safaribooksonline.com/library/view/java-message-service/9780596802264/ch04.html
 Message Oriented Middleware and Queues - Do We Even Need Web Services at All?
http://www.practicingsafetechs.com/TechsV1/MOMs/
in other words,the disadvantage of MOM? OR  compare mom with other middleware like RPC
The primary disadvantage of many message-oriented middleware systems is that they require an extra component in the architecture, the message transfer agent (message broker). As with any system, adding another component can lead to reductions in performance and reliability, and can also make the system as a whole more difficult and expensive to maintain.In addition, many inter-application communications have an intrinsically synchronous aspect, with the sender specifically wanting to wait for a reply to a message before continuing (see real-time computing and near-real-time for extreme cases). Because message-based communication inherently functions asynchronously, it may not fit well in such situations. That said, most MOM systems have facilities to group a request and a response as a single pseudo-synchronous transaction.-https://en.wikipedia.org/wiki/Message-oriented_middleware
In which domains are message oriented middleware like AMQP useful?
http://stackoverflow.com/questions/2388539/in-which-domains-are-message-oriented-middleware-like-amqp-useful

#### 4.5.2 ESB
An ESB is typically a layer that routes, logs, transforms, and performs other 'technical' (i.e. non-business) functions on messages. It could process messages from a messaging system (such as something JMS-based), or it could work with other types of message (such as SOAP-based web services). In that respect, it's more general than MoM.
Understanding Web services in anenterprise service bus environment. http://www-05.ibm.com/si/soa/att/understanding_web_services_in_an_enterprise_service_business_context_.pdf
Queue Manager vs Message Broker vs Message Bus
http://stackoverflow.com/questions/19609705/difference-between-queue-manager-and-message-broker
Message Broker - The message-oriented middleware server that hosts messaging destinations (i.e., queues and topics) for the purposes of asynchronous communication. Sometimes known as a queue manager
Message Queue - A messaging destination that uses a queue data structure to hold messages and is hosted by the message broker. The alternative to a queue is a topic which provides publish/subscribe semantics.
http://stackoverflow.com/questions/19609705/difference-between-queue-manager-and-message-broker
Message transports / Queues
Message brokers / Message queues
Integration frameworks
Enterprise Service Buses
Integration Suites
--http://ox86.tumblr.com/post/76315629526/do-you-know-the-difference-between-queue-mq-esb

#### 4.5.3 Integration Broker
Pro BizTalk 2006 Page 271 Convoys: Serial vs Parallel
https://books.google.com.sg/books?id=1qjiyHT-wRQC&pg=PA271&lpg=PA271&dq=correlation+property+concurrent&source=bl&ots=3pX9WvUkme&sig=hUGzFxEslAxOTjGFa1PTKCX4gp0&hl=en&sa=X&ved=0CCkQ6AEwAmoVChMI-7Gel_O1yAIVhnCOCh39ewPK#v=snippet&q=correlation&f=false
 
http://www.tibco.com/blog/2015/03/25/integration-broker-or-enterprise-service-bus/
 
https://www.mulesoft.com/resources/esb/enterprise-application-integration-eai-and-esb
 
https://alialagoz.wordpress.com/2012/05/01/message-based-integration-in-soa-architectures/
 
http://geekswithblogs.net/sthomas/archive/2006/08/15/88094.aspx
Content-Based Routing Tutorial
https://docs.mulesoft.com/mule-fundamentals/v/3.7/content-based-routing-tutorial


MOM VS SOA?
RPC VS WEBSOCKET?
MOM VS webService
SOA VS webServices
EAI ? SOA
ESB ? SOA



