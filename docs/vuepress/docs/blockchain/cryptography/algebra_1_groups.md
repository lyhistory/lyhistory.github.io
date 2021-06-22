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

其实更适合后面 Cayley's theorem, 对于 G={1 2 4 5 7 8} ，aG=G



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

举例：

S3

| i                    | t12                    | t13                    | t23                    | σ                      | σ<sup>2</sup>          |
| -------------------- | ---------------------- | ---------------------- | ---------------------- | ---------------------- | ---------------------- |
| 1->1<br>2->2<br>3->3 | 1->2<br/>2->1<br/>3->3 | 1->3<br/>2->2<br/>3->1 | 1->1<br/>2->3<br/>3->2 | 1->2<br/>2->3<br/>3->1 | 1->3<br/>2->1<br/>3->2 |

| ◦             | i             | t12  | t13           | t23  | σ    | σ<sup>2</sup> |
| ------------- | ------------- | ---- | ------------- | ---- | ---- | ------------- |
| i             | i             | t12  | t12           | t23  | σ    | σ<sup>2</sup> |
| t12           | t12           |      | σ<sup>2</sup> |      |      |               |
| t13           | t13           | σ    |               |      |      |               |
| t23           | t23           |      |               |      |      |               |
| σ             | σ             |      |               |      |      |               |
| σ<sup>2</sup> | σ<sup>2</sup> |      |               |      |      |               |

t12 ◦ t13 =   σ<sup>2</sup>

t13 ◦ t12 =   σ

所以S3不是abelian group

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



举例：

C4

| i                               | σ                               | σ<sup>2</sup>                   | σ<sup>3</sup>                   |
| ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| 1->1<br/>2->2<br/>3->3<br/>4->4 | 1->2<br/>2->3<br/>3->4<br/>4->1 | 1->3<br/>2->4<br/>3->1<br/>4->2 | 1->4<br/>2->1<br/>3->2<br/>4->3 |

| ◦             | i             | σ             | σ<sup>2</sup> | σ<sup>3</sup> |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| i             | i             | σ             | σ<sup>2</sup> | σ<sup>3</sup> |
| σ             | σ             | σ<sup>2</sup> | σ<sup>3</sup> | i             |
| σ<sup>2</sup> | σ<sup>2</sup> | σ<sup>3</sup> | i             | σ             |
| σ<sup>3</sup> | σ<sup>3</sup> | i             | σ             | σ<sup>2</sup> |



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



## Klein 4 Group

n {1, 2, 3, 4}

V = Klein 4 Group = {i, t12, t34, D}4

| i                            | t12                             | t34                             | D                               |
| ---------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| 1->1<br>2->2<br>3->3<br>4->4 | 1->2<br/>2->1<br/>3->3<br/>4->4 | 1->1<br/>2->2<br/>3->4<br/>4->3 | 1->2<br/>2->1<br/>3->4<br/>4->3 |



| ◦    | i    | t12  | t34  | D    |
| ---- | ---- | ---- | ---- | ---- |
| i    | i    | t12  | t34  | D    |
| t12  | t12  | i    | D    | t34  |
| t34  | t34  | D    | i    | t12  |
| D    | D    | t34  | t12  | i    |

## Group Isomorphisms 同构

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

注意：order相同的两个group未必是isomorphic的，比如 C4和Klein 4 group，对比两者的 i 明显规律不同！klein 4 group的每个元素都是自己跟自己互逆，而C4则不是

**Isomorphism Class:**

taking all groups that are isomorphic to one another and sticking them into a great big class, all of them are just the equivalent algebraic structure but with difference symbols used to denote the different elements of the group 



举例：

G:

(R, +)	实数是Filed，不过这里只考虑其在加法结构上的Abelian Group结构

G':

(R<sup>+</sup>, *)  R<sup>+</sup> = {x ∈ R | x > 0 }	正实数在乘法结构上是Abelian Group



φ: G->G'	

x,y ∈ G, ◦ 是 +， x ◦ y = x + y

φ(x),φ(y) ∈ G', ◦ 是 *, φ(x) = e<sup>x</sup>, φ(y) = e<sup>y</sup>

for ∀ x,y ∈ G, 

φ(x ◦ y) = φ(x + y) = e<sup>x+y</sup>= e<sup>x</sup>e<sup>y</sup> = φ(x)φ(y) = φ(x)  ◦ φ(y)

## Subgroups

H ⊂ G 或 H < G , every subgroup is a subset 

closure for H suddenly becomes non-trivial, because it's hard to say that for  ∀ x,y ∈ H, x ◦ y also ∈ H not outside of H

H需要包含G的identity

two trivial sub group：identity & the entire group

例子1：

S3= {  i, t12, t13, t23, σ, σ<sup>2</sup> }

C3  = {  i, σ, σ<sup>2</sup> }  

C3 ⊂  S3

H = { i, t12 }	(isomorphic to S2)

H ⊂  S3

例子2：

Integer Z= {0, 1, -1, 2, -2, ..........}

aZ = {za | z ∈ Z } = { 0, a, -a, 2a, -2a, .......}

aZ ⊂ Z

0Z = {0} 1Z = Z 刚好是Z的two trivia sub group

如何证明aZ也是group？

closure： 利用ring的分配律（因为Integer是ring）：za+z'a = (z+z')a = z''a, z''=z+z' ∈ Z, z''a ∈ aZ

其他 associative inverse identity都很显然



结论：H < Z and b ∈ H and b is the smallest positive integer, prove that H = bZ ⊂ Z

证明：

先证明 bZ ⊂ H

b存在inverse -b，b+b=2b............从而构造出

{0, b, -b, 2b, -2b, ......} 如果任何一个元素不存在与H中，那么H就不是闭合的，就不是group，所以bZ ⊂ H

再证明H can't contain any other integers that are not within the set bZ

let a  ∈ H but not in bZ, so:

if a<b, contradict to b is the smallest integers;

if a>b, then a = zb + r, z ∈ Z and b>r>0 (if r=b then a=(z+1)b, contradict to a not in bz)

=> r = a + (-zb) , because a ∈ H, -zb also ∈ H, so we have r ∈ H, contradict to b is the smallest integers



结论：it's impossible for a finite group to be isomorphic to it's subgroup, however in infinite group very that's not the case.

aZ isomorphic to Z

aZ = {za | z ∈ Z } 

φ:  aZ -> Z

for ∀ x,y ∈ G, φ(x) = x/a

φ(x ◦ y) = φ(x + y) = φ(za+z'a) = φ((z+z')a) =  z+z'

φ(x)  ◦ φ(y) = φ(x) + φ(y) = φ(za) + φ(z'a) = z+z'



结论：subgroup intersection交集也是subgroup

H1,H2 < G ,H1 ∩ H2 < G

H1 ∩ H2 = { g ∈ G | g∈H1,g∈H2 }

证明H1 ∩ H2是group即可：

首先不需要担心associativity 因为很显然如果其交集不遵守的话，H1和H2也就不是group，identity也显然即存在于H1又存在于H2,主要看其他几个性质：

关于closure, for ∀ x,y ∈ H1 ∩ H2 证明 xy ∈ H1 ∩ H2，很简单由于 x,y ∈ H1，所以xy ∈ H1，同理xy ∈ H2，得证

关于inverse，∀ x ∈ H1 ∩ H2，证明 x<sup>-1</sup> ∈ H1 ∩ H2，跟closure的证明一样x ∈ H1，所以x<sup>-1</sup> ∈ H1 ，同理x<sup>-1</sup> ∈ H2

## Cyclic Groups and subgroups

### finite & infinite Cyclic group

n ∈ N = {1, 2, 3, 4, 5, 6, ..........n}

Cyclic Permutation就是rotate旋转圆盘（每次旋转360/n），所以

旋转0次：

1->1 2->2 .............n->n	用i表示

旋转一次就是：

1->2 2->3 ..........n->1	用*σ* 表示

旋转两次

1->3 2->4...........n-1->1 n->2	用*σ<sup>2</sup>* 表示

......

旋转n-1次

1->n 2->1 ..........n->n-1	用*σ<sup>n-1</sup>* 表示

前面是finite Cyclic group，

但是如果我们假设研究infinite Cyclic group，比如整个自然数就会在旋转一次的时候遇到问题：

1->2 2->3 .......... 由于是整个自然数，无法得到自然数的最后一个数让其指向1，所以无法实现Permutation，

现在考虑更大的集合 Integer 整数，Z = { 0, 1, -1, 2, -2, .......}

旋转一次就是：

..... -3->-2 -2->-1 -1->0 0->1 1->2 2->3 ................. 现在随便找一个Integer 都能找到其对应的map

但是现在又有个问题，前面的finite Cyclic group Cn当旋转n-1次相当于逆时针旋转1次，旋转a次的逆是n-a次，旋转n次就回到了i，但是这里因为是infinite，如果向一个方向旋转是回不到i的，所以这里需要引入反方向的旋转，反方向旋转一次：

....-2->-3 -1->-2 0->-1 1->0 2->1 3->2............

现在定义一组新的符号：

identity：0

顺时针（向右旋转）一次：+1

逆时针（向左旋转）一次：-1

{ 0, 1, -1, 2, -2,...... } 神奇的发现产生的这个infinite Cyclic group跟我们考虑的整个Integer Z是完全一样的



### Cyclic Subgroup

for cyclic group G, x ∈ G (x is not identity element), \<x\> called Cyclic subgroup generated by x 

\<x\> = {e, x, x<sup>2</sup>,x<sup>3</sup>............. x<sup>-1</sup>, x<sup>-2</sup>......} 根据group的性质，肯定包含identity,e= x<sup>0</sup>，然后根据闭合性质，x跟自己compose成 x<sup>2</sup>（参考前面Cyclic Permutation的例子，相当于旋转两次），接着生成 x<sup>3</sup>等，并且每个元素都存在逆

注意：如果G是finite group，那么subgroup \<x\> 也必然是finite group（x的某个次幂=e），如果\<x\> 是infinite group，G必然也是infinite group

我们下面考虑 infinite group的情况，证明\<x\> 是group：

closure 闭合：∀ a,b ∈ Z (\<x\> 元素的次幂是Integer)

x<sup>a </sup> ◦ x<sup>b</sup> = x<sup>a+b</sup>

x<sup>a </sup> = x ◦ x ........◦ x 表示x compose自己a次，所以x<sup>a </sup> ◦ x<sup>b</sup>就是x compose with自己a+b次，所以是满足闭合

inverse显然存在，

例子：

for (Z,+) Integer under addition，

<2> = { 0, 2, 4, 6........, -2, -4, -6..........} = 2Z（前面subgroup举例的aZ）

结论：infinite Cyclic subgroup is always isomorphic to the infinite Cyclic group

\<x\> isomorphic to (Z,+)

\<x\> = {e, x, x<sup>2</sup>,x<sup>3</sup>............. x<sup>-1</sup>, x<sup>-2</sup>......}

φ: \<x\> ->(Z,+) , φ(x<sup>n</sup>) = n

for ∀ a,b ∈ \<x\>, 

φ(a ◦ b) = φ(x<sup>m</sup> ◦ x<sup>n</sup>) = φ(x<sup>m+n</sup>) =  m+n

φ(a)  ◦ φ(b) = φ(x<sup>m</sup>) + φ(x<sup>n</sup>) = m + n 	φ(a ◦ b)= φ(a)  ◦ φ(b) 得证



finite Group

\<x\> = {e, x, x<sup>2</sup>,x<sup>3</sup>.............}

if \<x\> is finite group, then must exist m∈N is the smallest that give an entry that already had(start cyclic), so that\<x\> = {e, x, x<sup>2</sup>, x<sup>3</sup>, ......x<sup>m-1</sup> }, and it must be x<sup>m</sup> = e

Prove:

suppose x<sup>m</sup> = x<sup>n</sup> ∈N and n<m

(x<sup>-1</sup>)<sup>n</sup> x<sup>m</sup> = (x<sup>-1</sup>)<sup>n</sup> x<sup>n</sup>

=> x<sup>m-n</sup> = e this contradict to m is the smallest that give an entry that already had

不难证明 \<x\> = {e, x, x<sup>2</sup>, x<sup>3</sup>, ......x<sup>m-1</sup> } 是一个group，满足group的属性:

closuer: x<sup>a</sup> ◦ x<sup>b</sup> = x<sup>a+b</sup> if a+b<m显然属于\<x\>, 等于m则 x<sup>m</sup> = e ，大于m比如介于(m,2m)则 x<sup>a</sup> ◦ x<sup>b</sup> = x<sup>m</sup>(x<sup>r</sup>)=x<sup>r</sup> r<m

inverse: 根据 x<sup>m</sup> = e => x<sup>1</sup> ◦ x<sup>m-1</sup> = e 找到complementary power即可

结论： \<x\> = {e, x, x<sup>2</sup>, x<sup>3</sup>, ......x<sup>m-1</sup> }  is isomorphic to Cm = {e, σ<sup>1</sup>, σ<sup>2</sup>, ......., σ<sup>m-1</sup>}



由上述得出**Cyclic Group 定义**：

Cyclic group both the finite and infinite cyclic groups what they contain basically is they need to contain an element x ∈ C such that the subgroup group generated by x \<x\> is actually equal to the entire group

<1> = { 0, +1, +2, +3......., -1, -2, -3,..........}



## Cayley's theorem

### 引入

前面讲了group的定义和属性，以及如何通过set Permutation来构造group，但是还没有回答一个问题就是：

so the questions now becomes is it the case that we can always think of a group as being a set of symbols where these symbols are representing set permutations of some set.

G={........}

a ∈ G, 

aG = {a◦g | g ∈ G}

| ◦    | <---G---> every elements in G |
| ---- | ----------------------------- |
| ...  |                               |
| a    | a◦g                           |
| .... |                               |



Ga = {g◦a | g ∈ G}

| ◦                     | ...  | a    | ...  |
| --------------------- | ---- | ---- | ---- |
| <--                   |      | g◦a  |      |
| G every elements in G |      | g◦a  |      |
| -->                   |      | g◦a  |      |

结论：aG = Ga = G for ∀ a ∈ G

for aG and Ga, every elements appear once and only once, 

Prove:

首先根据Group闭合的性质，a ∈ G，所以aG ∈ G，然后：

先证明appear only once：

assume   g<>g' but a◦g = a◦g' 

| ◦    | <--- |      | G every elements in G | ---> |
| ---- | ---- | ---- | --------------------- | ---- |
| ...  |      |      |                       |      |
| a    |      | a◦g  | a◦g'                  |      |
| .... |      |      |                       |      |

=>   a<sup>-1</sup>◦a◦g = a<sup>-1</sup>◦a◦g' 

=> g = g' contradict to g<>g' 

再来证明every elements appear once：

对于finite group来说，很简单，因为假设G的order是n，那么由于前面证明了g<>g'=>a◦g <> a◦g' 所以aG产生的n个元素也各不相同，所以得证；

然后对于infinite group来说，由于是infinite，换种思路：

for 任意 g ∈ G，只要可以找到ax=g, x ∈ G不就可以了么

=> x=a<sup>-1</sup>g，所以对于任意g都可以找到x=a<sup>-1</sup>g 从而让ax=g 得证



###  凱萊定理

官方定义：

In group theory, Cayley's theorem, named in honour of Arthur Cayley, states that every group G is isomorphic to a subgroup of the symmetric group acting on G.[1] This can be understood as an example of the group action of G on the elements of G.[2] The theorem can be obtained by explicitly constructing the representation within the representation of the symmetric group of permutation matrices, which is sometimes known as the regular representation.

A permutation of a set G is any bijective function taking G onto G. The set of all permutations of G forms a group under function composition, called the symmetric group on G, and written as Sym(G).[3] 



解释：

for group G={e.....}

let's just take the the symbols from the Group G (not taking the composition law, only the symbols), so we got a Set 

S={e......} 

this is the SET that we're going to think of every element of the group as representing a set permutation of and the composition law is then going to represent the composition of those set permutations

take any g ∈ S, a ∈ G, 

set permutation is bijective map from the SET to itself, 

we define **set permutation: a(g) **

and because g ∈ S, and it's the same symbol from group G, so we can have:

a(g) = a ◦ g，前面已经证明了 aG=G，every elements appear once and only once，所以必然是双射

then we can define a new composition law based on this set permutation, it will be the same composition as the Group G

| ◦    | <---------G---------->  |
| ---- | ----------------------- |
| e    | <---------G---------->  |
| ...  |                         |
| a    | <---------aG----------> |
| ...  |                         |

eG 就像之前set Permutation的i

aG 就像之前set Permutation的其他双射 比如之前研究过的t12 ，*σ*等

然后我们定义新的composition就是set Permutation的composition，换句话就是对 i t12 *σ*这些符号所对应的set Permutation的composition law，当然我们这里不需要使用这些符号了，可以直接用 我们定义的 **set permutation: a(g) **g ∈ S, a ∈ G，假设新的composition符号是&

所以对于∀ a,b ∈ G，a&b就代表 先进行set Permutation：b(g)，g ∈ S, b ∈ G，然后再进行set Permutation：a(b(g))， b(g) ∈ S, a ∈ G

进而我们可以证明实际上这个a&b = a(b(g)) 等同于 a和b先在G上composite a◦b，然后再进行我们定义的set Permutation (a◦b)(g), g ∈ S, a◦b ∈ G，即：

(a◦b)(g) = a(b(g))

很容易 根据我们的定义a(g) = a ◦ g 加上G上的associative性质即得证

但是注意，我们不可以定义set Permutation：a(g) = g ◦ a 虽然前面知道 Ga也是双射，但是

(a◦b)(g) = a(b(g)) 不成立，因为

(a◦b)(g) = g◦(a◦b) 而 a(b(g)) = a(g◦b) = (g◦b)◦a = g◦(b◦a) 但是我们知道对于group a◦b并不一定等于b◦a，只有abelian group才有这个属性

## Parity of a permutation





| t12 (1 2)                       | t123 (1 2 3)                    | t132 (1 3 2)                    | t13,24 (1 3)(2 4)               | (1 3 4)(2 5)                            | σ<sup>2</sup>                   |
| ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- | --------------------------------------- | ------------------------------- |
| 1->2<br/>2->1<br/>3->3<br/>4->4 | 1->2<br/>2->3<br/>3->1<br/>4->4 | 1->3<br/>2->1<br/>3->2<br/>4->4 | 1->3<br/>2->4<br/>3->1<br/>4->2 | 1->3<br/>2->5<br/>3->4<br/>4->1<br>5->2 | 1->3<br/>2->1<br/>3->2<br/>4->4 |

t12 (1 2) :

​	2-cycle 意思是3 4不变，单看1和2就是类似Cyclic Permutation的两个元素的cycle rotate

t123 (1 2 3) 

​	3-cycle 同理，4不变，此时是按 1 2 3的顺序进行的Cyclic Permutation的三个元素的一次rotate

t132 (1 3 2) 

​	3-cycle 同理，只不过顺序变成了 1 3 2 进行的一次rotate

t13,24 (1 3)(2 4) 

​	two 2-cycle

进一步观察发现

(1 2 3)=(1 3)(1 2)

所有的Permutation都可以分解为多个2-cycle的composition，情况分为：

(1 2)(1 2) 这种完全一样的就互相抵消

(1 3 2) = (2 3)(1 2) = (1 3)( 2 3) 这种是有一个重合的就有多种写法

(1 2)(3 4)=(3 4)(1 2) 这种没有重合的就满足communitative交换

(1 3)(1 2) is the inverse of (1 2)(1 3)

can only have even or odd decompositions

(1 2)(1 3)(1 3)(1 2) = e 很简单 (1 3)(1 3) = e 抵消

a = tn tn-1.....t1 

a<sup>-1</sup> = t1t2.....tn

a = tn..........t1 n = even

a = sm........s1 m = odd

a<sup>-1</sup> =  s1.....sm

a<sup>-1</sup> a = s1......smtn........t1 =e identity必须是even number of transpositions，如果是odd无法互相抵消

## Group Homomorphisms 同态

φ: G->G' φ doesn't have to be bijective

for ∀ x,y ∈ G, φ(x ◦ y) = φ(x)  ◦ φ(y)

1) 不需要满足 surjective 满射，即：

for ∀ g' ∈ G' ∃ g ∈ G, s.t. φ(g)  = g'

2）不需要满足injective 单射

for ∀ g' ∈ Im(φ)	Im(φ)={φ(g) | g ∈ G},

∃ only one g ∈ G, s.t. φ(g)  = g'



Prove:	φ(e<sub>G</sub>) = e<sub>G'</sub>	e<sub>G</sub>代表G的e  e<sub>G'</sub>是G'的e

we know that:

x ∈ G,  x ◦ x = x => x=e only solution for x compose with itself equal to itself is the identity

so, to prove φ(e<sub>G</sub>) = e<sub>G'</sub> we just need to prove that φ(e<sub>G</sub>) ◦ φ(e<sub>G</sub>) = e<sub>G'</sub> ，

φ(e<sub>G</sub>) ◦ φ(e<sub>G</sub>)  = φ(e<sub>G</sub>  ◦ e<sub>G</sub>)  and e<sub>G</sub>  ◦ e<sub>G</sub> = e<sub>G</sub>  

=> φ(e<sub>G</sub>) ◦ φ(e<sub>G</sub>) = φ(e<sub>G</sub>)  and because φ(e<sub>G</sub>)  is element in G',

so we got the only solution is e<sub>G'</sub>	



Prove:

a, a<sup>-1</sup> ∈ G, (a, a<sup>-1</sup>  can be the same element)

=> φ(a) inverse is φ(a<sup>-1</sup>) 

or write as: φ(a<sup>-1</sup>) = InverseOf(φ(a)) 或写作 (φ(a))<sup>-1</sup>

φ(a) ◦ φ(a<sup>-1</sup>) = φ(a ◦ a<sup>-1</sup>)  = φ(e<sub>G</sub>) = e<sub>G'</sub> 



Prove:

**Im(φ) < G' 	Im(φ)={φ(g) | g ∈ G}** , means that we can reduce a non-surjective homomorphism to surjective homomorphism

if the homomorphisms is surjective, then Im(φ) = G' , else Im(φ) is a proper subset of G',

so we konw Im(φ)  is a subset of G', how to prove Im(φ)  is a subgroup of G',仍然是看group的性质：

1) closure	∀ g1,g2 ∈ Im(φ) , g1◦ g2 ∈ Im(φ)

prove: if g1,g2 ∈ Im(φ), means exist φ(a)=g1, φ(b)=g2 (a b can be equal, hormomorphism no need to be injective)

g1◦ g2 = φ(a) ◦ φ(b) = φ(a ◦ b) ∈ Im(φ) 得证

2) associativity 继承的性质

3) Identity 

φ(e<sub>G</sub>) = e<sub>G'</sub>	e<sub>G'</sub> ∈ Im(φ)

4) Inverses	a' ∈ Im(φ) , (a')<sup>-1</sup> ∈ Im(φ)

we konw  (a')<sup>-1</sup>  = φ(a<sup>-1</sup>) so we got (a')<sup>-1</sup> ∈ Im(φ) 得证



Example:

φ: (Z, +) -> S2

Z={0,1,-1,2,-2.........}

S2={+1,-1} 	+1代表identity，-1代表transpose

φ(x)= +1 if x is even =-1 if x is odd

Prove: (Z, +) -> S2	∀ a,b ∈ Z φ(a+b)=φ(a)φ(b)

case 1: a,b are even, φ(a)=φ(b)=1, a+b is even , φ(a+b)=1=φ(a)φ(b) 其他情况同理



Kernel(φ) = { g ∈ G | φ(g)=e<sub>G'</sub>}

if it's isomorphism,means it's bijective, then e<sub>G</sub> is the only element

Prove: Kernel(φ) < G subgroup:

1) closure, any a,b  ∈ kernel(φ), φ(a◦b)=e<sub>G'</sub> φ(a)◦φ(b)=e<sub>G'</sub> ◦ e<sub>G'</sub> = e<sub>G'</sub>  得证

2) associativity 和 identity都很显然

3) Inverse	a ∈ kernel(φ) prove a<sup>-1</sup> ∈ kernel(φ) 即证明 φ(a<sup>-1</sup>)=e<sub>G'</sub> :

根据前面的结论知道φ(a) inverse is φ(a<sup>-1</sup>) 所以

φ(a<sup>-1</sup>) = InverseOf(φ(a)) 或写作 (φ(a) )<sup>-1</sup> =  InverseOf(e<sub>G'</sub>) =e<sub>G'</sub>





**conjugate element**

a,g ∈ G, the conjugate of g by a: aga<sup>-1</sup>

if G is abelian, aga<sup>-1</sup> = aa<sup>-1</sup>g = g



### Normal subgroup 正规子群:

H<G, ∀ h ∈ H ∀ g ∈ G, ghg<sup>-1</sup>∈ H, means that H has to be stable under conjugation by any element in G

结论：All subgroups of Abelian groups is normal subgroup

结论：all kernel group is normal subgroup，

Prove: H= Kernel(φ) ∀ h ∈ Kernel(φ), ∀ g ∈ G, ghg<sup>-1</sup> ∈ Kernel(φ)，即证明 φ(ghg<sup>-1</sup>) = e<sub>G'</sub>

φ(ghg<sup>-1</sup>) = φ(gh) ◦ φ(g<sup>-1</sup>) = φ(g) ◦ φ(h) ◦ φ(g<sup>-1</sup>) =φ(g) ◦  e<sub>G'</sub>◦ φ(g<sup>-1</sup>) =φ(g) ◦  φ(g<sup>-1</sup>) 

我们知道：

φ(g) ◦  φ(g<sup>-1</sup>) = φ(g ◦  g<sup>-1</sup>)  = φ(e<sub>G</sub>) = e<sub>G'</sub>

或者直接根据φ(g<sup>-1</sup>) 就是φ(g) 的inverse，得到e<sub>G'</sub>

得证



## Cosets + Lagranges

G={........}

a ∈ G, 

aG = {a◦g | g ∈ G}

Ga = {g◦a | g ∈ G}

aG == Ga == G, every elements in the group appear once and only once



**Cosets:**

a ∈ G, subgroup H<G ,

left coset of H under a: aH = {a◦h | h ∈ H}

right coset of H under a: Ha

a ∈ aH, a ∈ Ha， 因为subgroup H必然包含identity e，left cosets和right cosets必然不包含identity e，因为下面会证明cosets跟H元素完全不同，所以叫cosets而不是group

if a ∈ H，跟前面的Cayley's theorem讲的内容一样，aH=Ha=H	(aH=Ha 还有几种情况：G是abelian group；或者H是normal subgroup)

if a ∉ H, aH Ha are free of H (distinct from H), Prove by contradiction:

aH = {a◦h | h ∈ H} , h' = a◦h, assume h' ∈ H

h' = a◦h=> h'◦h<sup>-1</sup> = a , h<sup>-1</sup> ∈ H (h ∈ group H, exist inverse), so h'◦h<sup>-1</sup> ∈ H (closure), so a ∈ H, contradict to a ∉ H得证

note: 当然很容易知道，aH的元素不仅distinct from H，各自也是不同的，也是利用反证，比如假设存在不同的h1 h2使得ah1=ah2，两边取a的逆就得到反证，因此aH的元素个数跟H的元素个数相同，即order相同



if H is a Normal subgroup of G: ∀ a ∈ G, left cosets equal to right cosets:aH=Ha，即 aH ⊂ Ha  AND Ha ⊂ aH 

Prove: a◦h ∈ aH, h ∈ H, to show ∃ h' ∈ H, s.t. h'a = ah => h' = aha<sup>-1</sup> ,

because H is a normal subgroup of G, by the definition of normal subgroup:

> H<G, ∀ h ∈ H ∀ g ∈ G, ghg<sup>-1</sup>∈ H, means that H has to be stable under conjugation by any element in G

so  h' = aha<sup>-1</sup> is true 得证



**Properties of Coset**

a◦h ∈ aH,	(a◦h)H = aH

(a◦h)H =  {(a◦h)◦h' | h' ∈ H} = {a◦(h◦h')| h' ∈ H} 	再次使用 Cayley's theorem，{h◦h'| h' ∈ H} = hH =H

=> (a◦h)H ={a◦(h◦h')| h' ∈ H} ={a◦h''| h'' ∈ H} 



Example:

G=(Z, +) 

subgroup一节讲过 H=5Z={ 5z|z∈Z} = {0, 5, -5, 10, -10.......}

because (Z, +) is abelian group, left coset is the same as right coset

a = 1

aH = 1+H = 1+5Z = {1, 6, -4, 11, -9, ........}



Partition of set, split SET into N partition, P = { subset1, subset2, .....,subsetN}

H<G,

if H not G, then there must be some elements outside of H but inside of G, 

a ∉ H, 从前面结论知道 element in aH totally distinct from H, then:

H union aH 可能等于 G，否则就存在

b ∉ H union aH，that bH totally distinct from  (H union aH)，我们已经知道同理aH，bH totally distinct from  H，但是怎么证明 bH totally distinct from  aH，prove by contradiction:

aH =  {a◦h | h ∈ H} 

bH =  {b◦h | h ∈ H} 

assume exist b◦h1 = a◦h2, h1,h2∈H

=> b = a◦h2◦h1<sup>-1</sup> ,h2◦h1<sup>-1</sup> ∈ H, so b ∈ aH，跟前面的前提b ∉ H union aH矛盾，得证

如果 H union aH union bH 都不能cover整个G，则continue

所以Partition of G = { H, aH,bH, .........} 注意，如果确定了H，这个结果是唯一的

如果H是finite group，H的order |H|=m, 即H有m个元素，那么所有的cosets都跟H有相同的order，因为all elements in aH are distinct

### Lagranges Theorem

G is finite group / has an order(number of elements in group)

|G| = n|H| n ∈ N, 

OR  \|H\| must be divide by \|G\|

n实际上就是前面的 Partition of G  = { H, aH,bH, .........}  partition的数量，因为前面知道aH，bH，nH都跟H的order一样

用处--快速验证 是不是subgroup，首先看是否 obey lagranges theorem，看order是否被整除，如果否则不是，如果是进一步验证是否满足group的composition law

example：

|G| = Prime number=P = 2, 3, 5, 7............

其 subgroup |H|=1 or |G|

take some non-identity element x from G, x≠ e<sub>G</sub>，前面讲的Cyclic subgroup提到的，

infinite Cyclic group: \<x\> = {e, x, x<sup>2</sup>,x<sup>3</sup>............. x<sup>-1</sup>, x<sup>-2</sup>......} 

finite cyclic group: \<x\> = {e, x, x<sup>2</sup>, x<sup>3</sup>, ......x<sup>m-1</sup> }  x<sup>m</sup> = e

对于 order为prime number=P 的finite group G来说，从non-identity element x生成的finite Cyclic group \<x\> = {e, x, x<sup>2</sup>, x<sup>3</sup>, ......x<sup>m-1</sup> }  x<sup>m</sup> = e，m就是G的order = P，因为我们前面有结论其 subgroup |H|=1 or |G|，然后我们取出的是non-identity element x，所以 \<x\> 的 order就是等于|G|，所以m=P=|G|,x<sup>P</sup>=e，换句话说就是non-identity element x生成的finite Cyclic group \<x\> 就是整个 G，所以G is isomorphic to a finite cyclic group 即 C<sub>P</sub> 



## Quotient Groups

N < G (N is a subgroup of G and N is a normal subgroup 正规子群，conjunction stable：

∀ n ∈ N	∀ g ∈ G	gng<sup>-1</sup> ∈ N), 

we call G/N: Quotient Group G over N or Group G module group N

现在开始构造Quotient Group，前面一节我们知道

if H is a Normal subgroup of G: ∀ a ∈ G, left cosets equal to right cosets: aN=Na，意味着我们对large group G进行 Partition分区的话，就只有一种方式或一种结果，因为left cosets和right cosets相等，

假设G被partition成：N, aN，bN。。。。

G/N={	{N}, {aN}, {bN}, .....	}

然后用符号来表示{N}, {aN}, {bN}，比如{N}包含identity，可以用e bar即e上面加一横，不好打出来，就这么写：e¯，这也叫做 equivalence class: forgot the load of elements in {N}, {aN}, {bN}，we are going to view them as one mathematical entity now, we're going to sort of contract them down and just denote them all basically to just be represented by a single symbol, kind of crushing them together into one blob rather than loads of elements, condensing it all down to think of it as one mathematical object.

同理用a¯，b¯代表{aN}, {bN}

G/N = {e¯, a¯, b¯...........}

然后在构造其 composition law，

a¯ ◦ b¯ 相当于两个cosets进行组合计算，这里的◦定义为：

第一步： take representative from each cosets and compose，自然的a¯  b¯ 各自的representative是a 和 b（或者说是ae和be，e ∈ N），所以

a¯ ◦ b¯ = a ◦ b，变回了G这个group元素a b的composition

第二步：取 (a ◦ b)¯ 即a ◦ b的cosets {abN}

问题：how do we know whichever representative we take within these cosets doesn't matter？换言之：

假设我们不取特殊的a/ae和b/be，而是从a¯=aN取普通的 a◦n （∀ n ∈ N），同样取得b¯ 的representative b◦n' （∀ n' ∈ N），

a¯ ◦ b¯ =  a◦n ◦ b◦n' ，现在要证明a◦n ◦ b◦n' 一定是属于(a ◦ b)¯ 即a ◦ b的cosets {abN}，再转换一下就是说一定存在 n'' ∈ N，从而让

a◦n ◦ b◦n'= a◦b◦n''

证明：a◦n ◦ b◦n' = a◦b◦b<sup>-1</sup>◦n ◦ b◦n' = a◦b◦(b<sup>-1</sup>◦n ◦ b)◦n'，而 b<sup>-1</sup>◦n ◦ b 对于normal group N来说就等于another element in N,

所以(b<sup>-1</sup>◦n ◦ b)◦n'自然也是N的元素比如用n''表示，得证
