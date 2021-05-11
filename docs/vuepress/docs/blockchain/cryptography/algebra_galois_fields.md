refer 4.3

In AES, Galois field arithmetic is used in most layers, especially in the S-Box and theMixColumn layer. 



首先我们需要知道群 Group 的概念，通常我们提到群要么是 Addition(&subtraction) 要么是 Multiplication(&division)，而同时包含两种群的集合 set，叫做 域 Field。

In order to have all four basic arithmetic operations (i.e., addition, subtraction, multiplication, division) in one structure, we need a set which contains an additive and a multiplicative group. This is what we call a field.

## Definition 4.3.2 Field

A field F is a set of elements with the following properties:

+ All elements of F form an additive group with the group operation “+” and the neutral element 0.

  Additive Identity https://en.wikipedia.org/wiki/Characteristic_(algebra)#:~:text=A%20field%20of%20non%2Dzero,also%20called%20its%20prime%20field.&text=The%20finite%20field%20GF(p,infinite%20fields%20of%20prime%20characteristic.

  

+ All elements of F except 0 form a multiplicative group with the group operation “×” and the neutral element 1.

+ When the two group operations are mixed, the 分配律 distributivity law holds, i.e., for all a,b,c ∈ F: a(b+c) = (ab)+(ac).

Example 4.2. 实数集合 

The set R of real numbers is a field with the neutral element 0 for the additive group and the neutral element 1 for the multiplicative group. Every real number a has an additive inverse, namely −a, and every nonzero element a has a multiplicative inverse 1/a.

https://en.wikipedia.org/wiki/Field_(mathematics)#Constructing_fields_from_rings

## Finite Field

https://en.wikipedia.org/wiki/Finite_field

Fields with a finite number of elements, which we call finite fields or Galois fields. The number of elements in the field is called **the order  阶 or cardinality of the field**. Roughly speaking, a Galois field is a finite set of elements in which we can add, subtract, multiply and invert. 

### Theorem 4.3.1 prime power

A field with order m only exists if m is a **prime power**, i.e., m = p<sup>n</sup>, for some positive integer n and prime integer
p. p is called **the characteristic 特征 of the finite field**.

<i>the characteristic of any field is either 0 or a prime number. A field of non-zero characteristic is called a field of *finite characteristic* or **positive characteristic** or **prime characteristic**.</i>

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

## Prime Fields

Theorem 4.3.2 

Let p be a prime. The integer ring Z<sub>p</sub> is denoted as GF(p) and is referred to as a **prime field**, or as a **Galois field(or Finite Fields) with a prime number of elements**. All nonzero elements of GF(p) have an inverse. Arithmetic in GF(p) is done modulo p.

素数阶群必为循环群 https://blog.csdn.net/qq_25847123/article/details/100572099





