refer 8.2

## Groups

### Definition 8.2.1 Group
A group is a set of elements G together with an operation ◦ which combines two elements of G. A group has the following properties.

**Note:**

in cryptography we use both **multiplicative groups**, i.e., the operation “◦” denotes multiplication, and **additive groups** where “◦” denotes addition. The latter notation is used for elliptic curves as we’ll see later. Roughly speaking, a group is set with one operation and the corresponding inverse operation. If the operation is called addition, the inverse operation is subtraction; if the operation is multiplication, the inverse operation is division (or multiplication with the inverse element).

#### Closure

The group operation ◦ is closed. That is, for all a,b,∈ G, it holds that a ◦ b = c ∈ G.

#### Associative

The group operation is **associative 结合律** . That is, a◦(b◦c) = (a◦b)◦c for all a,b,c ∈ G.

**Note: associative is non trivial**

例1：

| ◦    | x1   | x2    | x3    |
| ---- | ---- | ----- | ----- |
| x1   |      | x1◦x2 |       |
| x2   |      |       | x2◦x3 |
| x3   |      |       |       |

假设G只有三个元素 x1 x2 x3

(x1◦x2)◦x3 	根据闭合属性，x1◦x2 的值肯定是属于G也就是x1/x2/x3其中一个，所以 (x1◦x2)◦x3的值就落在最后一列

x1◦(x2◦x3) 	同理，(x2◦x3) 的值也是属于G也就是x1/x2/x3其中一个，所以其值落在第一行

可见想让第一行的某个值和最后一列的某个值相等并不是显而易见的事情，所以说non trivial

例2：

集合set {a, b}，定义set permutation如下：

i(identity):

a->a

b->b

t(transform):

a->b

b->a

然后在此基础定义Group G={i, t}，即将两个set permutation操作符号本身抽象为G的元素，

然后定义composition 操作，如

i◦t是指在t的基础上进行i操作：

a->b ->b

b->a ->a

=>

a->b

b->a

即i◦t=t

很容易得到

| ◦    | i    | t    |
| ---- | ---- | ---- |
| i    | i    | t    |
| t    | t    | i    |

很容易理解：

i◦t◦t = (i◦t)◦t = i◦(t◦t)

所以由此也可以看出Group定义中的Associativity也是一种元素排列的复杂数据结构



#### Neutrual/Identity element

There is an element 1 ∈ G, called the **neutral element (or identity element)**, such that a ◦ 1 = 1 ◦ a = a for all a ∈ G.

#### Inverse

For each a ∈ G there exists an element a<sup>−1</sup> ∈ G, called the inverse of a, such that a ◦ a<sup>−1</sup> = a<sup>−1</sup> ◦ a = 1.

#### Commutative(Abelian Group)

A group G is **abelian (or commutative) 交换律** if, furthermore, a ◦ b = b ◦ a for all a,b ∈ G.

take above example, commutative means that in the table it's symmetric down the diagonal line

### Example: To illustrate the definition of groups

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

### 构造Group(Set=>Group)

假设自然数 natural number

n ∈ N = {1, 2, 3, 4, 5, 6, ..........}

Set集合 S1 S2 ........ Sn

n=1，S1 = {1}

n=2，S2 = {1,2}

如果通过Set构造Group呢？



#### 构造1：Set Permutation (Symmetric Group)

n=2 

集合set S2={1, 2}，定义set permutation如下（1对1全映射 bijections，不能多对1）：

i(identity):

1->1

2->2

t(transform):

1->2

2->1

然后在此基础定义Group G={i, t}，即将两个set permutation Symbols操作符号本身抽象为G的元素，

然后定义composition 操作，如

i◦t是指在t的基础上进行i操作：

1->2 ->2

2->1 ->1

=>

1->2

2->1

即i◦t=t

很容易得到

| ◦    | i    | t    |
| ---- | ---- | ---- |
| i    | i    | t    |
| t    | t    | i    |

#### 构造2：模运算 Theorem 8.2.1

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

这不就是一种set permutation吗，

S={1 2 4 5 7 8} 

permutation1: S*1 mod 9	结果映射   1 2 4 5 7 8

permutation2: S*2 mod 9	结果映射	2 4 8 1 5 7

。。。。。



#### Group的序 Size/Order

从上面两个例子可以看出，模运算的构造其实也是一种Set Permutation！

本质都是Set集合一对一的全排列，

比如Sn:

1,2,3.......n 映射到 1,2,3.......n 

从1开始，1有n种选择，2有n-1种........

总共

~~Sn的序 Order = |Sn| = n(n-1)(n-2).....1 = n!~~

其实应该是Sn构造的Group的序 =  n(n-1)(n-2).....1 = n!



## Symmetric Groups

上面例子通过Set Permutation构造的Sn就是Symmetric Group，

注意S1和S2比较简单，都满足communitative，所以都是abliean group，

但是S3不满足！

**所以Symmetric Group不一定是abliean group**

定义：

In abstract algebra, the symmetric group defined over any set is the group whose elements are all the bijections from the set to itself, and whose group operations is the composition of functions. In particular, the finite symmetric group Sn defined over a finite set of n symbols consists of the permutations that can be performed on the n symbols.



## Cyclic Groups

假设自然数 natural number

n ∈ N = {1, 2, 3, 4, 5, 6, ..........n}

跟Sn类似，这次用 Cn 表示，Cn构造的Group的元素也类似前面的Set Permutation，这次换成了 Cyclic Permutation：

想象一个圆盘/钟表，将其按照360度/n等分为n份，从刻度1开始，下一个刻度2，。。。。直到n，

比如n=2，就是12点钟刻度位置放1，6点钟刻度位置放2

然后，Cyclic Permutation就是rotate旋转圆盘（每次旋转360/n），所以

旋转0次：

1->1 2->2 .............n->n	用i表示

旋转一次就是：

1->2 2->3 ..........n->1	用*σ* 表示

旋转两次

1->3 2->4...........n-1->1 n->2	用*σ<sup>2</sup>* 表示

......

旋转n-1次

1->n 2->1 ..........n->n-1	用*σ<sup>n-1</sup>* 表示



首先这种构造满足Group的定义：

1) closure, x,y ∈ Cn x◦y ∈ Cn 

证明：Cn包含了所有的Cyclic Permutation/rotation的可能性，所以任意的xy组合也一定属于Cn

2) Associativity

3) Identity: i 旋转0次

4) Inverse ∀ g ∈ Cn, ∃ g<sup>-1</sup>∈ Cn, s.t. g◦g<sup>-1</sup>=g<sup>-1</sup>◦g=i

证明：假设g是旋转m次，即 m(360/n)，其inverse就是(n-m)(360/n)，因为两者加起来就是旋转360度，相当于旋转0度，即等于i

5) 并且还满足commutative，即Cyclic Group必然是Abelian Group

证明：x◦y和y◦x都是代表总共旋转x+y次，所以结果是一样的



容易得到，|Cn|的序=n 也就是所有的Cyclic Permutation总共有n种可能，可以联想之所以set Permutation是n阶乘，而这里是n，主要是这里1 2 3。。。。n这些元素是联动的，也就是当1旋转到了2，2必然对应3，而set Permutation中可以自由选择

## Dihedral Groups

假设自然数 natural number

n ∈ N = {1, 2, 3, 4, 5, 6, ..........n}

这次用 Dn 表示

这次的Permutation是在rotation/Cyclic Permutation的基础上增加了flipping，按照对称轴翻转，

比如 {1,2,3,4}就可以按照1-3 2-4两条对称轴+12和34间的轴线+14和23之间的轴线，总共4条对称轴，

对于{1,2,3,4,5} 五条对称轴则都是穿过每个数字

所以

|Dn|=n(cyclic permutation)+n(flipping) = 2n

那么Cyclic Permutation和flipping结合起来呢？结论是也会落在这2n个可能性里面

D1=S1, D2=S2, D3=S3

但是D4!=S4而是介于 C4和S4之间，当然D4不是abelian Group

Dn不是abelian group

## Group Isomorphisms

G = S2 = {i, t}

G'= {+1, -1}

G和G' 两者除了符号不同，性质相同，可以relabeling 

i<->+1

t<->-1



G&G' are isomorphic if exists:

φ: G<->G' φ is bijective

for ∀ x,y ∈ G, φ(x ◦ y) = φ(x)  ◦ φ(y)



| G    | ...  | y     | .... |
| ---- | ---- | ----- | ---- |
| ...  |      |       |      |
| x    |      | x ◦ y |      |
| ...  |      |       |      |

| G'   | ...  | φ(y)        | ...  |
| ---- | ---- | ----------- | ---- |
| ...  |      |             |      |
| φ(x) |      | φ(x) ◦ φ(y) |      |
| ...  |      |             |      |



## Subgroups

H < G , every subgroup is a subset 



## Cosets + Lagranges

G={........}

a ∈ G, 

aG = {a◦g | g ∈ G}

Ga = {g◦a | g ∈ G}

aG == Ga == G, every elements in the group appear once and only once