refer 4.3

In AES, Galois field arithmetic is used in most layers, especially in the S-Box and theMixColumn layer. 



首先我们需要知道群 Group 的概念，通常我们提到群要么是 Addition(&subtraction) 要么是 Multiplication(&division)，而同时包含两种群的集合 set，叫做 域 Field。

In order to have all four basic arithmetic operations (i.e., addition, subtraction, multiplication, division) in one structure, we need a set which contains an additive and a multiplicative group. This is what we call a field.

## Field

### Definition 4.3.2 Field

Note: Field is a non-zero communitive ring+Inverse Exist(except additive Identity），实际上zero communitive ring {0} 也满足下面的properties

A field F is a set of elements with the following properties:

+ 加法结构：加群===Abelian Group

  All elements of F form an additive group with the group operation “+” and the neutral element 0.

  Additive Identity https://en.wikipedia.org/wiki/Characteristic_(algebra)#:~:text=A%20field%20of%20non%2Dzero,also%20called%20its%20prime%20field.&text=The%20finite%20field%20GF(p,infinite%20fields%20of%20prime%20characteristic.

  满足：

  + Closure
  + Associative
  + Additive Identity Exist
  + Inverse Exist
  + Commutative

+ 乘法结构：乘“群” （几乎是group甚至是abelian ，但是addictive identity不存在inverse）

  All elements of F except 0 form a multiplicative group with the group operation “×” and the neutral element 1.

  + Closure

  + Associative

  + Multiplicative Identity Exist

  + Inverse Exist(except additive Identity，所以不满足群定义)

    ∀ x ∈ F\\{0}, ∃ x<sup>-1</sup>∈ F, s.t. x◦x<sup>-1</sup>=x<sup>-1</sup>◦x=i

    通过分配律可以证明，

    a(b+c) = (ab)+(ac)，让c=0

    a(b+0) = (ab)+(a0) => ab = ab + a0 两边加上ab的加法逆 -ab => a0=0，再通过满足交换律得到0a=0，

    所以0跟任何元素相乘都是0，都不会是multiplicative identity，所以0不存在乘法逆

  + Commutative

+ Distributivity

  When the two group operations are mixed, the 分配律 distributivity law holds, i.e., for all a,b,c ∈ F: a(b+c) = (ab)+(ac).

例子：有理数、实数集合 、复数都是filed

The set R of real numbers is a field with the neutral element 0 for the additive group and the neutral element 1 for the multiplicative group. Every real number a has an additive inverse, namely −a, and every nonzero element a has a multiplicative inverse 1/a.

https://en.wikipedia.org/wiki/Field_(mathematics)#Constructing_fields_from_rings

### Characteristic of a Field

Field is a non-zero communitive ring，根据Field定义属性，

multiplicative identity normally denoted as 1 ∈ F, what you have to ask to work out the characteristic of a Field Ch(F)  is what is the smallest number of times I have to add 1 to itself to get back 0:

1+1+..............+1 = 0

there is a little caveat to this what if you can add one to itself as many times as you like and never get 0 back again, for example take rational numbers Q which is a filed, you can add 1 to itself as many times as you like and you'll get a bigger and bigger rational but you'll never come back to 0, so you might expect the Ch(F) to be infinity but it isn't, the way we define the characteristic of a field where you can add up 1 to itself arbitrarily many times and never get 0 back again is we define it to be zero, so the characteristic of Rational number Ch(Q) is defined to be zero

Prime Field F<sub>2</sub> = { 0, 1 } 1+1=0,  ch(F<sub>2</sub>)=2

n∈N, n*1 = 1+1....+1 (n times) 

m,n∈N, n\*1+m\*1 = (n+m)\*1

(n\*1)\*(m\*1) = (n\*m)\*1

结论：

<i>the characteristic of any field is either 0 or a prime number. A field of non-zero characteristic is called a field of *finite characteristic* or **positive characteristic** or **prime characteristic**.</i>

Characteristic of a Field Ch(F) can only be zero or prime, ch(F)= 0 or prime(2,3,5....)

Prove: assume Ch(F) = n = ab (non of a or b is 1)

according to the definition, n\*1=0 => (ab)\*1 = 0 => (a\*1)\*(b\*1) = 0 implies that a\*1 =0 or b\*1=0, 

for example, if a\*1=0 because  n = ab (non of a or b is 1) implies that a<n,b<n, means that we have found a smaller number a that times 1 equal to 0, this contradict to the definition of n is the characteristic of the field(the smallest )

example:

Fp=Z/(pZ) = { 0¯, 1¯, 2¯,(p-1)¯  }, Ch(Fp) = p , why?

1¯+1¯= 2¯

1¯+1¯+1¯=3¯

p*1¯ = 1¯+1¯+...+1¯ (p times) =p¯ = 0¯

Real number: Ch(R) = 0

Rational number: Ch(Q) = 0

Complex number: Ch(C)=0

## Prime Fields

### 尝试构造Fields

首先要满足加法群abelian group，举例Integer

Z = {0,1, -1, 2, -2, . . .}

但是明显不满足乘法结构要求的存在乘法逆，所以这个不是Fileds，（是 commutative ring）

Fp , p = 2, 3, 5, 7 ,11, 13, ..... |Fp| = p

Z/(pZ)

pZ={np|n∈Z} = {0, p, -p, 2p, -2p,.........}

Z是Abelian group

根据normal group的结论：All subgroups of Abelian groups is normal subgroup，

所以pZ也是normal group，means that when we construct the left and right coset partitions of the group integer Z, we'll get the same answer

开始进行 partition，以left cosets为例：

pZ = {0, p, -p, 2p, -2p,.........}, 	denoted by 0¯

1+pZ = {1, 1+p, 1-p,1+ 2p, 1-2p,.........}, 	denoted by 1¯

2+pZ = {2, 2+p, 2-p,2+ 2p, 2-2p,.........}, 	denoted by 2¯

...

p-1+pZ = {p-1, 2p-1, -1,3p-1, -p-1,.........}, 	denoted by (p-1)¯

Z/(pZ) = { 0¯, 1¯, 2¯,(p-1)¯  } 刚好prime order p

**Addition Composition Law**

a¯+b¯=(a+b)¯ 前面在group章节中证明过，现在要证明其满足fileds的加法结构即加法结构下是Abelian group：

1）closure，根据定义很明显 ∀ a¯,b¯ ∈ Z/(pZ),	a¯+b¯=(a+b)¯ ∈ Z/(pZ)

2）associativity, (a¯+b¯)+c¯ =a¯+ (b¯+c¯)

 (a¯+b¯)+c¯ = (a+b)¯ + c¯  = ((a+b)+c)¯

a¯+ (b¯+c¯) = (a+(b+c))¯, (a+b)+c= a+(b+c) 得证

3）identity

a¯+ 0¯ = (a+0)¯ =a¯ 

0¯ +a¯ = a¯

4) inverse

∀ a¯ ∈ Z/(pZ)

a¯ + (-a+p)¯ = (a-a+p)¯=p¯=0¯

5) communitativity

a¯+b¯ = (a+b)¯ 

b¯+a¯ = (b+a)¯ = (a+b)¯ =a¯+b¯



**Multiplication Composition  Law**

a¯b¯ = (ab)¯

前面没有证明过multiplication，所以这里要证明该定义 well defined，

for a¯,b¯ ∈ Z/(pZ), take arbitrary elements from a¯,b¯: a+z<sub>1</sub>p and b+z<sub>2</sub>p

a¯b¯ =((a+z<sub>1</sub>p)(b+z<sub>2</sub>p))¯=(ab+az<sub>2</sub>p+z<sub>1</sub>pb+z<sub>1</sub>pz<sub>2</sub>p)¯

a,b,p,z<sub>1</sub>,z<sub>2</sub>都是integer，所以根据commutativity以及associativity of multiplication for integer

ab+az<sub>2</sub>p+z<sub>1</sub>pb+z<sub>1</sub>pz<sub>2</sub>p = ab+az<sub>2</sub>p+z<sub>1</sub>bp+z<sub>1</sub>pz<sub>2</sub>p = ab+(az<sub>2</sub>+z<sub>1</sub>b+z<sub>1</sub>pz<sub>2</sub>)p

az<sub>2</sub>+z<sub>1</sub>b+z<sub>1</sub>pz<sub>2</sub> 必然是integer，即 az<sub>2</sub>+z<sub>1</sub>b+z<sub>1</sub>pz<sub>2 </sub>∈ Z，所以(az<sub>2</sub>+z<sub>1</sub>b+z<sub>1</sub>pz<sub>2</sub>)p ∈ pZ，所以ab+(az<sub>2</sub>+z<sub>1</sub>b+z<sub>1</sub>pz<sub>2</sub>)p ∈ (ab)¯

接下来就是验证满足fileds的乘法结构：

1）closure，根据定义很明显 ∀ a¯,b¯ ∈ Z/(pZ),	a¯b¯=(ab)¯ ∈ Z/(pZ)

2）associativity, (a¯b¯)c¯ =((ab)c)¯ =a¯(b¯c¯) =(a(bc))¯

3）identity

1¯a¯=(1a)¯=a¯ = a¯1¯

4) inverse

∀ a¯ ∈ F\\{0¯}=Z/(pZ)\\{0¯} = { 1¯, 2¯,(p-1)¯  }={}, 

∃ a¯<sup>-1</sup>∈F\\{0¯}, s.t. a¯◦a¯<sup>-1</sup>=a¯<sup>-1</sup>◦a¯=1¯ or ∃ b¯∈ F\\{0¯}, s.t. a¯◦b¯=b¯◦a¯=1¯

first, prove a¯◦b¯<>0¯, if a¯◦b¯ = 0¯, means a¯◦b¯=zP =>ab=zp , so that the prime factor of a or b must contain p, but 

a¯,b¯ ∈ { 1¯, 2¯,(p-1)¯  }  so the max of a,b is (p-1) < p 得证a¯◦b¯<>0¯

second, prove for different b1,b2, a¯◦b1¯<>a¯◦b2¯, assume a¯◦b1¯= a¯◦b2¯, => (a◦b1)¯= (a◦b2)¯, means a◦b1 and a◦b2 in the same cosets, a◦b1=a◦b2+zp => a◦b1-a◦b2=zp => a(b1-b2) = zp ，跟前面一样the max of a,b1,b2 is (p-1) < p

finally,

b¯ ∈ { 1¯, 2¯,(p-1)¯  }  有 p-1种可能，然后每种可能跟a¯ 的 a¯◦b¯结果都是不同的，a¯◦b¯=(a◦b)¯∈ { 0¯, 1¯, 2¯,(p-1)¯  } 但是前面知道了a¯◦b¯<>0¯，所以自然的必然存在一个b¯使得 a¯◦b¯=1¯

5) communitativity

a¯b¯=(ab)¯ = b¯a¯=(ba)¯

6) distributivity

a¯(b¯+c¯) = a¯b¯+a¯c¯

a¯(b¯+c¯) = a¯(b+c)¯ = (a(b+c))¯

a¯b¯+a¯c¯ = (ab)¯+(ac)¯=(ab+ac)¯

a(b+c)=ab+ac => (a(b+c))¯= (ab+ac)¯ 得证



Theorem 4.3.2 

Let p be a prime. The integer ring Z<sub>p</sub> is denoted as GF(p) and is referred to as a **prime field**, or as a **Galois field(or Finite Fields) with a prime number of elements**. All nonzero elements of GF(p) have an inverse. Arithmetic in GF(p) is done modulo p.

素数阶群必为循环群 https://blog.csdn.net/qq_25847123/article/details/100572099



## Finite Field

https://en.wikipedia.org/wiki/Finite_field

Fields with a finite number of elements, which we call finite fields or Galois fields. The number of elements in the field is called **the order  阶 or cardinality of the field**. Roughly speaking, a Galois field is a finite set of elements in which we can add, subtract, multiply and invert. 

### Theorem 4.3.1 prime power

A field with order m only exists if m is a **prime power**, i.e., m = p<sup>n</sup>, for some positive integer n and prime integer
p. p is called **the characteristic 特征 of the finite field**.



n=1 => Prime Fields

n>1 => Non-Prime Fields

Prime fields vs non-prime fields https://crypto.stackexchange.com/questions/78422/prime-fields-vs-non-prime-fields

Example:

This theorem implies that there are, for instance, finite fields with 11 elements(11=11<sup>1</sup>, or with 81 elements (since 81 = 3<sup>4</sup>) or with 256 elements (since 256 = 2<sup>8</sup>, and 2 is a prime). However, there is no finite field with 12 elements since 12 = 2<sup>2</sup> · 3, and 12 is thus not a prime power.

#### Prove?

为什么p一定要是prime素数，不能是composite number合数？

https://www.quora.com/Why-must-a-finite-field-have-prime-power-order

> Note that the order of the field must be a power of a prime, which is the characteristic (additive order) of every non-zero element. Short answer, because it's finite, and because it's a field. I know, that sounds ridiculous, but pretty much that's all the proof uses. What we prove is that any finite field is "a vector space over a subfield of prime order".
>
> **The field has a multiplicative identity, 1, and an additive identity, 0.** Since the field is **finite** then there is a minimal number N such that 1+1+…+1=0 for N ones. Suppose N were composite. Then we could find two integers greater than 1, such that pq=N, and then there are two elements of the field 1+1+…+1, one with p 1's, and one with q. Those two elements are not 0, since p,q<N. Their product is 0, which cannot be true in a **field**. (This is called the "scalar field". It's a subfield, isomorphic to integers modulo N). So N must be prime. From there it's a quick application of the distributive law to show the additive order of every non-zero element in the field must be N, a prime.
>
> Finally, you inductively construct the elements of the field in the form a0⋅1+a1x1+a2x2+…, for ai∈0…p−1. (After k steps you have found an additive subgroup of the field with pk elements. If this is not every element in the field, simply take another element of the field as xk. The only detail you need to make this proof rigorous is to prove that the elements so generated are distinct, which is not difficult.)

> example: Let's try it with a composite number, 12. We have 3⋅4 mod 12 =0, so
>
> 0=3<sup>−1</sup>⋅0=3<sup>−1</sup>⋅(3⋅4)=(3<sup>−1</sup>⋅3)⋅4=1⋅4=4.
>
> That's why it does not work with composite numbers. Why it does work with prime numbers is a more substantial thing: How do you prove everything except 0 has a multiplicative inverse in that case? That involves the quotients in Euclid's algorithm.



If the characteristic were p', a composite, say p'=pn′, then 0=pn′. This shows p is a zero-divisor and therefore not a unit.

If p were a unit, you would have 0=p−1⋅0=p−1pn′=n′ 0=p−1⋅0=p−1pn′=n′.



根据定义Field 必然包含0，如果是



？https://math.stackexchange.com/questions/633056/the-proof-that-a-finite-field-has-a-prime-power-order#:~:text=As%20the%20field%20is%20finite,field%20has%20order%20pn.

### 有限域乘法|加法结构

首先Finite Field必须满足Field定义，所以包含0和1

**1．有限域的乘法结构** [3] 

域的全体非0元素集合构成交换乘群；全体元订归素集合构成交换加群。有限域的元素个数是有限的。因此，全体非0元素集合构成有限乘群，乘群中每个元素的级为有限。并可以证明，该群必由[群](https://baike.baidu.com/item/群/6977479)中的一个元素生成，且是循环群。
Why is the multiplicative group of a finite field cyclic? 

https://math.stackexchange.com/questions/837562/why-is-the-multiplicative-group-of-a-finite-field-cyclic

**2．有限域的加法结构** [3] 

在域中必有乘法单位元1，若作1+1+1+…运算，对无限域来说，则有可能n·1≠o，但在有限域中，1+1+…+1=0，否则该域必成为无限域。例如，在GF(2)中，1+1=0。



## Field Extensions

K / F , K Over F vector space





