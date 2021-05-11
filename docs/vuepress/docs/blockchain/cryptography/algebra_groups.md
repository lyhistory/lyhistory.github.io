refer 8.2

## Groups

### Definition 8.2.1 Group
A group is a set of elements G together with an operation ◦ which combines two elements of G. A group has the following properties.

1. The group operation ◦ is closed. That is, for all a,b,∈ G, it holds that a ◦ b = c ∈ G.
2. The group operation is **associative 结合律** . That is, a◦(b◦c) = (a◦b)◦c for all a,b,c ∈ G.
3. There is an element 1 ∈ G, called the **neutral element (or identity element)**, such that a ◦ 1 = 1 ◦ a = a for all a ∈ G.
4. For each a ∈ G there exists an element a−1 ∈ G, called the inverse of a, such that a ◦ a<sup>−1</sup> = a<sup>−1</sup> ◦ a = 1.
5. A group G is **abelian (or commutative) 交换律** if, furthermore, a ◦ b = b ◦ a for all a,b ∈ G.

Note that in cryptography we use both **multiplicative groups**, i.e., the operation “◦” denotes multiplication, and **additive groups** where “◦” denotes addition. The latter notation is used for elliptic curves as we’ll see later.

Roughly speaking, a group is set with one operation and the corresponding inverse operation. If the operation is called addition, the inverse operation is subtraction; if the operation is multiplication, the inverse operation is division (or multiplication with the inverse element).



### Example 8.2. To illustrate the definition of groups

+ (Z,+) is a group, i.e., the set of integers Z = {. . . ,−2,−1,0,1,2, . . .} together with the usual addition forms an abelian group, where e = 0 is the identity element and −a is the inverse of an element a ∈ Z.

  + 加法模 

    The set of integers Z<sub>m</sub> = {-m+1, . . . , -1,0,1, . . . ,m−1} and the operation addition modulo m form a group with the neutral element 0. Every element a has an inverse −a such that a+(−a) =0 mod m. 

  + 乘法模

    Note that this set Z<sub>m</sub> does not form a group with the operation multiplication because most elements a do not have an inverse such that aa<sup>−1</sup> =1 mod m.

+ (Z without 0, ·) is not a group, i.e., the set of integers Z (without the element 0) and the usual multiplication does not form a group since there exists no inverse a<sup>−1</sup>for an element a ∈ Z with the exception of the elements −1 and 1. -1+1=0而0不存在，破坏了group 闭合的定义

+ (C, ·) is a group, i.e., the set of complex numbers u+iv with u,v ∈ R and i<sup>2</sup> =−1 together with the complex multiplication defined by (u1+iv1) · (u2+iv2) = (u1u2−v1v2)+i(u1v2+v1u2) forms an abelian group. The identity element of this group is e = 1, and the
  inverse a−1 of an element a = u+iv ∈ C is given by a<sup>−1</sup> = (u−iv)/(u<sup>2</sup>+v<sup>2</sup>).

However, all of these groups do not play a significant role in cryptography **because we need groups with a finite number of elements**. Let us now consider the group Z<sub>n</sub><sup>∗</sup> which is very important for many cryptographic schemes such as：

+ DHKE, 

+ Elgamal encryption, 
+ digital signature algorithm 
+ and many others.

### Theorem 8.2.1

The set Z<sub>n</sub><sup>∗</sup> which consists of all integers i=0,1, . . . ,n−1 for which gcd(i,n) = 1 forms an abelian group under multiplication modulo
n. The identity element is e = 1.

Example 8.3. If we choose n = 9,  Z<sub>n</sub><sup>∗</sup> consists of the elements {1,2,4,5,7,8}.

Multiplication table for Z<sub>9</sub><sup>∗</sup> 

| × mod 9 | 1 2 4 5 7 8 |
| ------- | ----------- |
| 1       | 1 2 4 5 7 8 |
| 2       | 2 4 8 1 5 7 |
| 4       | 4 8 7 2 1 5 |
| 5       | 5 1 2 7 8 4 |
| 7       | 7 5 1 8 4 2 |
| 8       | 8 7 5 4 2 1 |

从上面的表很容易看到定义的 1 3 5都满足，2不能直接从上表看出，但是也是满足的，至于4逆元也可以通过 extended Euclidean algorithm 来计算出



## Cyclic Groups



## Subgroups

