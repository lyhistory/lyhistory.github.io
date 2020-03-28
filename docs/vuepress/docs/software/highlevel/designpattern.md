
Procedural Programming, Functional Programming, OO and AO Programming, we have so many programming methodology, what we discuss here is all based on OO Programming.
When we say OO design and design pattern, we must mention 'GOF book',as introduced in wiki:
The name of the book ("Design Patterns: Elements of Reusable Object-Oriented Software") is too long for e-mail, so "book by the gang of four" became a shorthand name for it. After all, it isn't the ONLY book on patterns. That got shortened to "GOF book", which is pretty cryptic the first time you hear it.

## 1.Principle
**Single Responsibility Principle**
Motivation
In this context a responsibility is considered to be one reason to change. This principle states that if we have 2 reasons to change for a class, we have to split the functionality in two classes. Each class will handle only one responsibility and on future if we need to make one change we are going to make it in the class which handle it. When we need to make a change in a class having more responsibilities the change might affect the other functionality of the classes.
The Single Responsibility Principle is a simple and intuitive principle, but in practice it is sometimes hard to get it right.
Intent
A class should have only one reason to change.

**Open-Closed Principle**
Motivation
A clever application design and the code writing part should take care of the frequent changes that are done during the development and the maintaining phase of an application. Usually, many changes are involved when a new functionality is added to an application. Those changes in the existing code should be minimized, since it's assumed that the existing code is already unit tested and changes in already written code might affect the existing functionality in an unwanted manner.
The Open Close Principle states that the design and writing of the code should be done in a way that new functionality should be added with minimum changes in the existing code. The design should be done in a way to allow the adding of new functionality as new classes, keeping as much as possible existing code unchanged.
Intent
Software entities like classes, modules and functions should be open for extension but closed for modifications.

**Liskov Substitution Principle**
Motivation
All the time we design a program module and we create some class hierarchies. Then we extend some classes creating some derived classes.
We must make sure that the new derived classes just extend without replacing the functionality of old classes. Otherwise the new classes can produce undesired effects when they are used in existing program modules.
Likov's Substitution Principle states that if a program module is using a Base class, then the reference to the Base class can be replaced with a Derived class without affecting the functionality of the program module.
Intent
Derived types must be completely substitutable for their base types.


**Interface Segregation Principle**
Motivation
When we design an application we should take care how we are going to make abstract a module which contains several submodules. Considering the module implemented by a class, we can have an abstraction of the system done in an interface. But if we want to extend our application adding another module that contains only some of the submodules of the original system, we are forced to implement the full interface and to write some dummy methods. Such an interface is named fat interface or polluted interface. Having an interface pollution is not a good solution and might induce inappropriate behavior in the system.
The Interface Segregation Principle states that clients should not be forced to implement interfaces they don't use. Instead of one fat interface many small interfaces are preferred based on groups of methods, each one serving one submodule.
Intent
Clients should not be forced to depend upon interfaces that they don't use.

**Dependency Inversion Principle-IOC**
Motivation
When we design software applications we can consider the low level classes the classes which implement basic and primary operations(disk access, network protocols,...) and high level classes the classes which encapsulate complex logic(business flows, ...). The last ones rely on the low level classes. A natural way of implementing such structures would be to write low level classes and once we have them to write the complex high level classes. Since high level classes are defined in terms of others this seems the logical way to do it. But this is not a flexible design. What happens if we need to replace a low level class?
Let's take the classical example of a copy module which reads characters from the keyboard and writes them to the printer device. The high level class containing the logic is the Copy class. The low level classes are KeyboardReader and PrinterWriter.
In a bad design the high level class uses directly and depends heavily on the low level classes. In such a case if we want to change the design to direct the output to a new FileWriter class we have to make changes in the Copy class. (Let's assume that it is a very complex class, with a lot of logic and really hard to test).
In order to avoid such problems we can introduce an abstraction layer between high level classes and low level classes. Since the high level modules contain the complex logic they should not depend on the low level modules so the new abstraction layer should not be created based on low level modules. Low level modules are to be created based on the abstraction layer.
According to this principle the way of designing a class structure is to start from high level modules to the low level modules:
High Level Classes --> Abstraction Layer --> Low Level Classes
 
 
Intent
High-level modules should not depend on low-level modules. Both should depend on abstractions.
Abstractions should not depend on details. Details should depend on abstractions.


<<Dependency Injection in .NET(2011)>>
<<Manning.Dependency.Injection.In.Dot.NET.Sep.2011.ISBN.1935182501>>

From the book, understand more than IOC but other patterns: the Null Object pattern, Decorator pattern, Composite pattern,Adapter pattern

![](/docs/docs_image/software/designpattern/designpattern00.png)

“Programming to an interface instead of an implementation” ENABLES “Loose couple”, “loose couple” MAKES CODE “extensible”, “extensibility” MAKES IT “maintainable”

Benefits gained from “loose couple”

![](/docs/docs_image/software/designpattern/designpattern01.png)

As a class relinquishes control of DEPENDENCIES, it gives up more than the decision to select particular implementations. However, as developers, we gain some advantages.As developers, we gain control by removing that control from the classes that consume DEPENDENCIES. This is an application of the SINGLE RESPONSIBILITY
PRINCIPLE: these classes should only deal with their given area of responsibility, without concerning themselves with how DEPENDENCIES are created.
DI gives us an opportunity to manage DEPENDENCIES in a uniform way. When consumers directly create and set up instances of DEPENDENCIES, each may do so in its own way, which may be inconsistent with how other consumers do it. We have no way to centrally manage DEPENDENCIES, and no easy way to address CROSS-CUTTING CONCERNS. With DI, we gain the ability to intercept each DEPENDENCY instance and act upon it before it’s passed to the consumer. With DI, we can compose applications while intercepting dependencies and controlling their lifetimes. OBJECT COMPOSITION, INTERCEPTION, and LIFETIME MANAGEMENT are three dimensions of DI.

## 2.design patterns in software process
URS(functional requirements) --> Requirements Modeling --> Use Case Model--->Analysis Modeling-->Analysis Model--->Design Modeling-->Design Model

Software Architecture
Functional requirements are structured as use cases.Dependencies among functional requirements are identified as relationships between use cases.The operation flows of each use case is described.
Analysis objects are identified along with their state(attributes) and responsibilities(operations) without considerations for implementation.
Design strategies are devised for the operating environment to fulfill the quality requirements.
Analysis objects are adapted according to the design strategies to become design objects with full class details.

Incremental and Iterative Model
Agile Model

Design problems surface during design activities, they may be solved by applying design patterns,
In OOAD, design patterns are applicable when:
1.Devising/Refining the design strategies.
2.Transitioning from analysis model to design model.
3.Iterating within design Model.

## 3.Appreciate the intent of design patterns
Design patterns capture the intent behind a design by identifying objects and classes, their collaborations, and the distribution of their roles and responsibilities.
Importance:
Patterns are a rational reconstruction of existing design practices
Patterns identify key assumptions that govern the design decisions.
Value of a pattern is determined by the quality of exposition.

### 3.1 Behavior

**Template pattern:**
In Template pattern, an abstract class exposes defined way(s)/template(s) to execute its methods. Its subclasses can override the method implementation as per need but the invocation is to be in the same way as defined by an abstract class. This pattern comes under behavior pattern category.
https://baijiahao.baidu.com/s?id=1619116206359982963&wfr=spider&for=pc
https://www.tutorialspoint.com/design_pattern/template_pattern.htm

![](/docs/docs_image/software/designpattern/designpattern02.png)

**Observation pattern**
problem:
when a change in the object requires change in the others, and you don't know how many of them need changes.
Intent:
Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

ApplicationContext PublishEvent EventListener
https://springframework.guru/gang-of-four-design-patterns/observer-pattern/
publisher(subject), subscriber(observer)

**Strategy :** Client context Strategy ConcreteStrategy, algorithm related,
problem: context has to handle different occasions
Intent: defines an interface for a family of algorithms.
1.improve maintainability & extensibility by capturing algorithms in classes.
2.improve extensibility by abstracting the algorithm classes - polymorphism - treating all the algorithms uniformly.

**Iterator: ** Client Aggregate ConcreteAggregate Iterator ConcreteIterator
problem: traverse aggregate in a structured manner, robust to modify traverse algorithm in future.
Intent: defines an interface for accessing and traversing aggregate without exposing the latter's internal representation.
Implementation issues and choices:
The iteration through the selected aggregate items can be controlled externally, or internally from within the iterator,modify on aggregate items during iteration.
it there are multi iterator in aggregator, aggregator

**Memento:** Caretaker Originator Memento
problem:capture snapshots of required subset of state, not burden originator  with undo and possibly redo functions.
Intent:
Memento stores internal state of originator and allows access only by originator,
Originator creates and restores from Memento,
CareTaker safe keeps memento and does not access the content of Memento.
Implementation issues and choices:
Programming languages support is required to support the wide and narrow interfaces of memento: Java:inner class C#:nested class C++:friend class
Storing incremental changes in memento is feasible if mementos are restored in a predictable sequence

**Command:** Client ConcreteCommand Invoker Receiver
**Visitor:** double dispatch vs visitor pattern
http://www.cnblogs.com/significantfrank/archive/2012/10/31/4875836.html

### 3.2 Structural

**Bridge:** Client Abstraction RefinedAbstraction Implementor ConcreteImplementor
problem:
avoid permanent binding between an abstraction and an implementation, vary or replace the implementation without changing the client code.
Intent:
separate a class's interface from its implementation / decouple abstraction from implementation so that the two can vary independently.
place abstraction and implementation into separate hierarchies.

**Composite:**Client Component Composite(keep components collection, addComponent()/removeComponent())
problem:
represent complex objects that comprises other simple objects,
clients should be able to treat complex objects in the same way as other simple objects.
Intent:
compose object into tree structures to represent part-whole hierarchies.
composite lets clients treat individual objects and compositions of objects uniformly.

**Decorator:**
problem:
add responsibility(states or operations, can be withdrawn) to individual objects dynamically and transparently when extension by sub-classing is not possible.
Intent:
provide a flexible alternative to sub-classing for extending functionality, attach additional responsibilities to an object dynamically.
Please be aware of operation sequence in ConcreteDecorator(decide should you call base.Operation() before or after AddedBehavior()), that will make great difference when drawing sequence diagram.

```
// Abstract decorator class - note that it extends Coffee abstract class
public abstract class CoffeeDecorator extends Coffee {
protected final Coffee decoratedCoffee;
public CoffeeDecorator(Coffee c) {
this.decoratedCoffee = c;
}
public double getCost() { // Implementing methods of the abstract class
return decoratedCoffee.getCost();
}
public String getIngredients() {
return decoratedCoffee.getIngredients();
}
}
// Decorator WithMilk mixes milk into coffee.
// Note it extends CoffeeDecorator.
class WithMilk extends CoffeeDecorator {
public WithMilk(Coffee c) {
super(c);
}
public double getCost() { // Overriding methods defined in the abstract superclass
return super.getCost() + 0.5;
}
public String getIngredients() {
return super.getIngredients() + ", Milk";
}
}
// Decorator WithSprinkles mixes sprinkles onto coffee.
// Note it extends CoffeeDecorator.
class WithSprinkles extends CoffeeDecorator {
public WithSprinkles(Coffee c) {
super(c);
}
public double getCost() {
return super.getCost() + 0.2;
}
public String getIngredients() {
return super.getIngredients() + ", Sprinkles";
}
}
public class Main {
public static void printInfo(Coffee c) {
System.out.println("Cost: " + c.getCost() + "; Ingredients: " + c.getIngredients());
}
public static void main(String[] args) {
Coffee c = new SimpleCoffee();
printInfo(c);
c = new WithMilk(c);
printInfo(c);
c = new WithSprinkles(c);
printInfo(c);
}
}
Cost: 1.0; Ingredients: Coffee
Cost: 1.5; Ingredients: Coffee, Milk
Cost: 1.7; Ingredients: Coffee, Milk, Sprinkles

```

### 3.3 creation

**Factory Method:** product concreteProduct creator concreteCreator,
problem: polymorphism applies only to the use of objects, not to their creation. Object creation could become very cumbersome especially if the num of subclasses increases.
Intent:
1. client cannot anticipate the class of objects it must create.
2. Localise : Hide from the client the knowledge of where and how to create whichever subclass you desire.
futhermore: Factory Method Pattern VS Abstract Factory Pattern
Factory Method intent to insulate the creation of object from their usage. Parameterizing the desired concrete subclasses.

**Abstract Factory** provide a way to encapsulate a group of factories without specifying their concrete classes.
Implementation issues and choices: How to create factories ? normally we would put creation of factories in Client using simple factory method, more elegant way is using reflection.

**Builder:** Client Director ConcreteBuilder
problem: creating complex products
Intent:
Separate the construction of a complex object from its representation, so that the same construction process can create different representations.

**Singleton:** Clients access a Singleton instance solely through Singleton's getInstance() operation
problem:
when multiple copies are floated in the system, it is difficult to ensure control over the updates.
Intent:
Ensuring controlled updates of data
Implementation issues and choices:use a registry of singletons, the registry maps between key and singleton, when getInstance needs a singleton, it consults the registry, asking for the singleton by name, the registry looks up the corresponding singleton.

Static vs singleton 
About Singleton:
![](/docs/docs_image/software/designpattern/designpattern03.png)
About double-checked lock
https://en.wikipedia.org/wiki/Double-checked_locking

Refer to “Static and thread safe”=>“Class-load time”, use private static instance = new Object(), initial at class-load time, not run time to avoid multthread issue.

Difference between static class and singleton pattern? https://stackoverflow.com/questions/519520/difference-between-static-class-and-singleton-pattern?page=2&tab=votes#tab-top

Why singleton is bad?
https://medium.com/@sinethneranjana/5-ways-to-write-a-singleton-and-why-you-shouldnt-1cf078562376



## 4. 在应用层思考设计模式
design pattern status machine

Recommended practice is to code frontends in a state-machine style that will accept any message type at any time that it could make sense, rather than wiring in assumptions about the exact sequence of messages. https://www.postgresql.org/docs/11/static/protocol-flow.html

Producer-consumer pattern
https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem
Pub-sub pattern
Html5 - server sent event

address resolver / service locator

---

ref:

[PHP design pattern](http://www.php5dp.com/)