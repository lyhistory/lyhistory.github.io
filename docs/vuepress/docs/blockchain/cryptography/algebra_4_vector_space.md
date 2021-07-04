前提：先要搞清楚 fields和prime fields

Vector space V over Fields:

V={...........}, the elements of the V is called Vectors

1. Addition Composition Law： must obey the axioms of Abelian Group

| +    | <-   | V    | ->   |
| ---- | ---- | ---- | ---- |
| <-   |      |      |      |
| V    |      |      |      |
| ->   |      |      |      |

Note: additive identity 0 here represents zero vector in the vector space, while 0 also can represents additive identity in Field in below, don't confuse each other

2. Scalar multiplication Law:

| *    | <-   | V    | ->   |
| ---- | ---- | ---- | ---- |
| <-   |      |      |      |
| F    |      |      |      |
| ->   |      |      |      |

1) closure

∀ c ∈ F, v ∈ V, cv ∈ V

2) associativity

∀ c<sub>1</sub>,c<sub>2</sub> ∈ F, v ∈ V, c<sub>1</sub>(c<sub>2</sub>v) = (c<sub>1</sub>c<sub>2</sub>)v

3) identity

1 ∈ F, ∀ v ∈ V, 1v = v1=v

4) distributivity

i) ∀ c ∈ F, v<sub>1</sub>,v<sub>2</sub> ∈ V, c(v<sub>1</sub>+v<sub>2</sub>) = cv<sub>1</sub>+cv<sub>2</sub>

ii) ∀ c<sub>1</sub>,c<sub>2</sub> ∈ F, v ∈ V, (c<sub>1</sub>+c<sub>2</sub>)v = c<sub>1</sub>v+c<sub>2</sub>v

let c<sub>2</sub>=0, (c<sub>1</sub>+0)v = c<sub>1</sub>v+0v => c<sub>1</sub>v=c<sub>1</sub>v+0v, c<sub>1</sub>v is vector in vector space, both sides apply additive inverse of vector space,

=>(-c<sub>1</sub>v)+c<sub>1</sub>v=(-c<sub>1</sub>v)+c<sub>1</sub>v+0v => 0 = 0v, note the 0 in the left side represents zero vector because two vectors (-c<sub>1</sub>v)+c<sub>1</sub>v add together results in another vector 
