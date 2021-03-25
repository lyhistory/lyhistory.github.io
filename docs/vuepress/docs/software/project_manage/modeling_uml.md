https://www.visual-paradigm.com/guide/uml-unified-modeling-language/uml-class-diagram-tutorial/

## Realization:  

class => dotted/dashed line with solid/closed arrow =>interface 

## Inheritance/Generalization: 

sub class => solid line with solid/closed arrow => super class



## Association:

Cardinality is expressed in terms of:

- one to one
- one to many
- many to many

control class => solid line => boundary class

## Dependency: 

A special type of association, 

An object of one class might use an object of another class in the code of a method. If the object is not stored in any field

class => dotted/dashed line with open arrow => the other class



## Aggregation

A special type of association.

It represents a "part of" relationship.

class => solid line with a unfilled diamond (is part of) => the other class

## Composition

A special type of aggregation where parts are destroyed when the whole is destroyed

class => solid line with a filled diamond (live and die with ) => the other class