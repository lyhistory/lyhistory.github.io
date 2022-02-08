---
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
title: Object Oriented Analysis and Design
---

# SDLC

ISS-IDEF0 diagrams

Object Oriented Modeling

Domain Modeling & Design Modeling

A domain model is called conceptual model in database modeling, while a design model is called logical model.

These distinctions are also used in model-driven development, where we have a succession of three types of models:

    (solution-independent) domain models resulting from domain/requirements engineering in the system analysis, or inception, phase of a development project
    (platform-independent) design models resulting from the system design activities in the elaboration phase
    (platform-specific) implementation models, which are derived from a design model

While system modeling includes both information and process modeling, you seem to be concerned with information modeling only. Here, we can use the terms "domain class diagram" and "design class diagram" for the conceptual information model and the information design model made in the form of UML class diagrams.

(from http://stackoverflow.com/questions/21265491/what-is-the-difference-between-a-domain-class-diagram-and-a-design-class-diagram)

refer: http://ocw.mit.edu/courses/aeronautics-and-astronautics/16-355j-software-engineering-concepts-fall-2005/index.htm

# OOAD
Inception: Business Modeling
Elaboration: Requirements Analysis & Design
Construction: Implementation Test
Transition: Deployment
![](/content/images/post/20190101/ooad1.jpg)
## Pre-requisite

Object-Oriented Concepts:

Object(relatively distinguishable entities),characteristics: State,Behavior

Classes( is a means to classify objects)

Abstract(Extracting relevant characteristics of real world objects)

Encapsulation(group related elements into a single entity)

Relationship:

Dependency(used to model client-supplier relationship)

Association(represents a structural relationship between objects of different classes),Multiplicity, Unidirection,Bidirection

Aggregation(part-whole relationship)

composition(a especially strong form of an aggregation,live and die together)

Inheritance(allows a class to reuse the definition of another class as part of its own definition, is-a relationship)

Realization(between a specification/interface and its implementation/class that provides the interface's services)

Polymorphism:

1.the ability to manipulate different objects that have a common set of operations(can be enforced via an interface or a superclass)

2.supports plug-and-run benefits(allowing plugging of objects of different classes as long as that the objects conform to the interface required)

UML - Unified Modeling Language

arrow with (dashed) line,diamond with (dashed) line, triangle with (dashed) line, oval

## Object Oriented Requirements and Analysis

##############################################################################

### URS

##############################################################################

not in our scope

##############################################################################

### Requirements Modeling

##############################################################################

Requirements Workflow: (to let the customer and the developer agree on the system description and the detailed requirements)

Requirements management: (a systematic approach to eliciting, organizing and documenting the requirements of the system)

Requirement Modeling:(a formalized approach to analyzing and refining the requirements of the system)

Relation to other Activities:

1.Analysis (provides initial list of objects needed to realize use cases,further analyzed during analysis phase)

2.Testing (use case descriptions are used to generate system test cases)

3.Configuration&Change Management (use cases form the basis for configuration&change management)

4.Project Management(used for project planning&control)

-----------------------------------------------------------------------
Use Case Model:

Use Case Diagram( Use Cases, Actors)

Use Case Description

Who: Actor, What/When: Use Cases, How:Domain Objects.

Actors: An entity that interacts with the system for the purpose of completing a business event.(outside of and interact with the system)

Use Cases: A description of a set of sequences of actions, including variants, that a system performs that yield an observable result of value to the actor.(enactment of the system operations. must fulfill a valuable goal/business activity for the actor).

While capturing use cases, they tend to become complex because they generally contain redundancies.

Guidelines:

structure: include extend generalization

type: abstract concrete

Levels: system goal level, user goal level, single system interaction level

Linked/Associate actors and use cases with communication.

Build use case diagram: Business System, Real-time/embedded system.

----------------------------------------------------------------------------

Domain Objects:

develop domain object model diagrams depicting both static and dynamic perspectives.

Guidelines:

Name domain objects from a business/domain perspective. Use business/domain knowledge apart from noun-verb analysis to identity domain objects.

Analysis whether the identified domain objects are sufficient for the specified use case to execute.

Do Not create one-to-one mapping between domain objects and relational tables.

Analysis

ownership rules, collective behavior

Use Case Realization:

Use Case description:

Flow of events:

1. This use case is called*****

n. The use case terminates.

Alternative flows: ***

Produce Use Case Realization Report:

1.Brief description

2.Flow of events(standard and exceptional)

3.Interaction diagrams(views of participating domain objects shown as collaboration diagrams)

4.Participating objects

5.Class diagrams

6.Derived requirements

---------------------------------------------------------------------------------------------------------------------------------

Requirements Artifacts:

    Use Case model survey

Identify Actors,Use Cases(concrete and abstract), Relationship between Actors and Use Cases.

Draw the Use Case Global View diagram

    Domain object model

Identify domain objects

Relationships among domain objects

Draw the domain object diagrams

    Use case realization report(Requirements)

Write normal flow of events and exceptional flow of events for each use case.

---------------------------------------------------------------------------------------------------------------------------------
Use Case Validation (Prepare System Test Plan)

		System or use case test plans are usually developed during the early stage of Elaboration Phase.

		Use Case Descriptions can be made the basis for developing system test cases.

Use Case Instance: (use case is an abstract view of what happens between the user and the system, however,they do not describe the specific instances of interactions)

specific executions of a use case.
1.Refine requirements(Exploration of details, uncover business rules)

2.Provide mechanism to validate requirements

3.Facilitate better estimation

Use Case Instance Description:
UC Instance Name:

Instance ID: Unique ID assigned to UC instance

Conditions: Overall conditions in which the UC instance executes.Specific preconditions that must exist

Inputs: Any input parameters needed for the UC instance to execute

Instance Flow: Step by step flow description of the instance

Outputs: Results of execution of the instance

Use Case Paths and Minimum Test Cases(Test Case suite)

##############################################################################

### Analysis Modeling

##############################################################################

Dimensions:

The Information dimension specifies the information held in the system.

The Behavior dimension specifies the behavior which the system will adopt.

The Presentation dimension provides the details prevent the system to the outside world.

Analysis Objects:

Boundary Objects(the function that is directly dependent on the system environment)

Entity Objects(Contains the information that to be passed among object or to be kept for a long period of time)

Control Objects(Handle behavior dimension of the system), typically, wok as a glue or a cushion to unite the remaining objects of the system.

typically contain: Transaction related behavior, Coordination related behavior, Sequencing specific to one or more use cases.

Guidelines:

In analysis modeling, focus on the responsibility of the objects when defining behavior, ignore the implementation details and the logic of the operation(Such concern should be deferred till Design stage)

Objects communication Restrictions: Actor boundary entity control

Analysis Modeling Workflow:

1.Identify the objects that need to participate in the accomplishment of each use case

2.Categories the identified objects into types(boundary,control,entity)

3.Identify the static relationship between the objects and document.

4.For each use case, define the dynamic relationships between objects(communication associations)

5.Identify the operations and key(entity object) attributes required to facilitate dynamic and static relationships.

6.Document the static relationships as one or more Class Diagrams(can be created per use case or at the whole system level).

7.For each use case, document the dynamic relationships as one or more Collaboration Diagram.

8.Assess the exceptional flow of events for each use case, and ensure that appropriate operations/attributes are provided to cover their functionality.

9.Create additional Collaboration Diagrams(if necessary) to describe the processing of the exceptional flow for each use case.

10.Ensure that all use cases are covered, including abstract use cases.

11.Ensure that clear and appropriate links are made in the Collaboration Diagrams when use cases interact(when a concrete use case uses an abstract use case).

12.Write the Flow of Events(Standard and Exceptions) of each use case in terms of the analysis objects and their operations.

13.Document the analysis of each use case by preparing a Use Case Realization Report(Analysis).

14.(optional)Document each analysis object by preparing a Class Report(Analysis).

##############################################################################

### Design Modeling

##############################################################################
Object Oriented Design and Implementation

<Transition from Analysis to Design>

Design Objects:

Design Modeling: Design Objects, class diagram,sequence diagram

design for main scheduel:
![](/content/images/post/20190101/ooad2.jpg)

design of copy weekly schedule:
![](/content/images/post/20190101/ooad3.jpg)