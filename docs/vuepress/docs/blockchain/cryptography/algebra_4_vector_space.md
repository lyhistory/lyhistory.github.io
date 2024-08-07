前提：先要搞清楚 fields和prime fields

## Vector space Definition

Vector space V over Fields F:

V={...........}, the elements of the V is called **Vectors**

### 1. Addition Composition Law： must obey the axioms of Abelian Group

| +    | <-   | V    | ->   |
| ---- | ---- | ---- | ---- |
| <-   |      |      |      |
| V    |      |      |      |
| ->   |      |      |      |

Note: additive identity 0 here represents **zero vector** in the vector space, while 0 also can represents additive identity in Field in below, don't confuse each other

### 2. Scalar multiplication Law:

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

## V=F

The Field is a vector space over itself

看看是否满足前面的定义：

### 1. Addition Composition Law： 

显然 obey the axioms of Abelian Group，因为V=F，Field的加法结构就是Abelian Group



### 2. Scalar multiplication Law:

都很显然

1) closure

∀ c ∈ F, v ∈ V=F, cv ∈ V=F

2) associativity

∀ c<sub>1</sub>,c<sub>2</sub> ∈ F, v ∈ V=F, c<sub>1</sub>(c<sub>2</sub>v) = (c<sub>1</sub>c<sub>2</sub>)v

3) identity

1 ∈ F, ∀ v ∈ V=F, 1v = v1=v

4) distributivity

i) ∀ c ∈ F, v<sub>1</sub>,v<sub>2</sub> ∈ V, c(v<sub>1</sub>+v<sub>2</sub>) = cv<sub>1</sub>+cv<sub>2</sub> 显然满足Field的distributivity

ii) ∀ c<sub>1</sub>,c<sub>2</sub> ∈ F, v ∈ V, (c<sub>1</sub>+c<sub>2</sub>)v = c<sub>1</sub>v+c<sub>2</sub>v，这个可以先利用Field multiplicative communitive, 然后再用前面的distributivity

(c<sub>1</sub>+c<sub>2</sub>)v = v(c<sub>1</sub>+c<sub>2</sub>) = vc<sub>1</sub>+vc<sub>2</sub> = c<sub>1</sub>v+c<sub>2</sub>v



## V=F<sup>n</sup>

F<sup>n</sup>, n ∈ N={1,2,3.........}

take the arragnements of the little n elements of the field, so the set is going to underlie this vector space F<sup>n</sup> is going to be all n tuples of elements from the filed capital F, denote:

{ (x1,x2,........xn) | xi ∈ F }

### Addition

define addition:

v=(x1,x2,........xn) ∈ F<sup>n</sup>

v¯=(x1¯,x2¯,........xn¯) ∈ F<sup>n</sup>

v+v¯=(x1+x1¯,x2+x2¯,........xn+xn¯) ∈ F<sup>n</sup>

1) closure, prove by definition of addition

2) ∀ v1,v2,v3 ∈ F<sup>n</sup>

(v1+v2)+v3 = v1+(v2+v3)

v1=(x1,x2,........xn)

v2=(y1,y2,........yn)

v3=(z1,z2,........zn)

(v1+v2)+v3 = ( (x1+y1)+z1, (x2+y2)+z2...........,(xn+yn)+zn )

v1+(v2+v3) = ( (x1+(y1+z1), .................)

3) identity = (0,0............0)

4) additive inverse

v=(x1,x2,........xn)

-v = (-x1,-x2,........-xn)

v+(-v) =(x1+(-x1), x2+(-x2),...........) =  (0,0............0)

5) communitative

v=(x1,x2,........xn) ∈ F<sup>n</sup>

v¯=(x1¯,x2¯,........xn¯) ∈ F<sup>n</sup>

v+v¯=(x1+x1¯,x2+x2¯,........xn+xn¯) ∈ F<sup>n</sup>

v¯+v=(x1¯+x1,x2¯+x2,........xn¯+xn) ∈ F<sup>n</sup>

v+v¯=v¯+v

### scalar Multiplication

define scalar multiplication

c ∈ F, v ∈ F<sup>n</sup>,

cv=c(x1,x2.......xn) = ( cx1, cx2,......... cxn)

1) closure

∀ c ∈ F, v ∈ V=F<sup>n</sup>, cv ∈ V=F<sup>n</sup>

cv= ( cx1, cx2,......... cxn), c, x1,x2...xn∈ F， when we multiple two elements in the field we got another element in the field, so cx1, cx2..........cxn are all elements in the field F, by the definition of F<sup>n</sup>: { (x1,x2,........xn) | xi ∈ F }, 

cv= ( cx1, cx2,......... cxn) ∈ V=F<sup>n</sup>

2) associativity

∀ c<sub>1</sub>,c<sub>2</sub> ∈ F, v ∈ V=F<sup>n</sup>, c<sub>1</sub>(c<sub>2</sub>v) = (c<sub>1</sub>c<sub>2</sub>)v

c<sub>1</sub>(c<sub>2</sub>v) = c<sub>1</sub>(c<sub>2</sub>x1, c<sub>2</sub>x2,......... c<sub>2</sub>xn) = (c<sub>1</sub>(c<sub>2</sub>x1), c<sub>1</sub>(c<sub>2</sub>x2),......... c<sub>1</sub>(c<sub>2</sub>xn))

 (c<sub>1</sub>c<sub>2</sub>)v = ( (c<sub>1</sub>c<sub>2</sub>)x1,  (c<sub>1</sub>c<sub>2</sub>)x2........... (c<sub>1</sub>c<sub>2</sub>)xn)

同样的by the definition of F<sup>n</sup>: { (x1,x2,........xn) | xi ∈ F }, 并且c<sub>1</sub>,c<sub>2</sub> ∈ F，所以

c<sub>1</sub>(c<sub>2</sub>x1)= (c<sub>1</sub>c<sub>2</sub>)x1。。。。。。。。。。。c<sub>1</sub>(c<sub>2</sub>xn)= (c<sub>1</sub>c<sub>2</sub>)xn

3) identity

1 ∈ F, ∀ v ∈ V=F<sup>n</sup>, 1v = v1=v

4) distributivity

i) ∀ c ∈ F, v<sub>1</sub>,v<sub>2</sub> ∈ V, c(v<sub>1</sub>+v<sub>2</sub>) = cv<sub>1</sub>+cv<sub>2</sub> 证明方法同上，利用Field的distributivity

ii) ∀ c<sub>1</sub>,c<sub>2</sub> ∈ F, v ∈ V, (c<sub>1</sub>+c<sub>2</sub>)v = c<sub>1</sub>v+c<sub>2</sub>v，这个可以先利用Field multiplicative communitive, 然后再用前面的distributivity

(c<sub>1</sub>+c<sub>2</sub>)v = v(c<sub>1</sub>+c<sub>2</sub>) = vc<sub>1</sub>+vc<sub>2</sub> = c<sub>1</sub>v+c<sub>2</sub>v

## V=R<sup>3</sup>

R<sup>3</sup>={(x1,x2,x3)|xi ∈ R}

the intuitive way of visualizing the vector space is that you can view each one of these as being an arrow basically in three-dimentionaly space, basically you can view each of these vectors as a position vecor where the x coordinate is x1, y coordinate is x2, z coordinate is x3,

what is so wonderful about this is not only does it give us a picture for each vector but also gives us a picture of what it means to add two vectors together and scalar multiply vector

<disqus/>