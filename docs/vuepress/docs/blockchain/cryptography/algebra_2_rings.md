## 1. Rings

### 1.1 Definition 1.4.2 Ring

The integer ring Zm consists of:

1. The set Zm = {0,1,2, . . . ,m−1}
2. Two operations “+” and “×” for all a,b ∈ Zm such that:
3. a+b ≡ c mod m , (c ∈ Zm)
4. a×b ≡ d mod m , (d ∈ Zm)

e.g. Z<sub>9</sub> ={0,1,2,3,4,5,6,7,8}.

Note:

+ for Additive Composition 加法环是abelian group，
+ but for Multiplicative Composition 而乘法环不一定

Properties of rings：

In summary, we can say that the ring Zm is the set of integers {0,1,2, . . . ,m−1} in which we can add, subtract,
multiply, and sometimes divide.

### 1.2 Property: Closed(addition&multiplication)

 We can add and multiply any two numbers and the result is always in the ring. A ring is said to be closed.

### 1.3 Property: Associative(addition&multiplication)

 Addition and multiplication are associative, e.g., a+(b+c) = (a+b)+c, and a · (b · c) = (a · b) · c for all a,b,c ∈ Zm.

### 1.4 Property: Additive Identity/Neutral element 0

 There is the neutral element 0 with respect to addition, i.e., for every element a ∈ Zm it holds that a+0 ≡ a mod m.

### 1.5 Property: Additive Inverse(Uniqueness)

 For any element a in the ring, there is always the negative element −a such that a+(−a) ≡0 mod m, i.e., the additive inverse always exists.

唯一性，反证利用结合律：

对于x ∈ Zm 如果存在两个不同的加法逆元a,b ∈ Zm，st. x+a=a+x=x+b=b+x=0，

根据结合律 a+x+b = (a+x)+b = 0+b=b , a+x+b=a+(x+b)=a+0=a，跟a和b不同矛盾

**负数的模：** mod(a, n) = a - n * floor(a / n)

### 1.6 Property: Additive Communitativity

for all a,b ∈ Zm, a+b=b+a

### 1.7 Property: distributive(Connection between addition&multiplication)

 Distributive law holds that a×(b+c) = (a×b)+(a×c) for all a,b,c ∈ Zm,

Expand 扩展：

(x1+x2+....xm)×(y1+y2+...yn) = ..

可以将 (x1+x2+....xm)先看做a，然后b=y1, c=y2+...yn，然后展开即可

### 1.8 Property: Multiplicative Identity/Neutral element 1

 There is the neutral element 1 with respect to multiplication, i.e., for every element a ∈ Zm it holds that a×1 ≡ a mod m.

### 1.9 Property: Multiplicative Communitativity(NA)

### 1.10 Property: Multiplicative Inverse(NA)

 The multiplicative inverse exists only for some, but not for all, elements. Let a ∈ Z, the inverse a<sup>−1</sup> is defined such that a · a<sup>−1</sup> ≡1 mod m If an inverse exists for a, we can divide by this element since b/a ≡ b · a<sup>−1</sup> mod m.

 It takes some effort to find the inverse (usually employing the **Euclidean algorithm**). However, there is an easy way of telling whether an inverse for a given element a exists or not:
An element a ∈ Z has a multiplicative inverse a<sup>−1</sup> if and only if gcd(a,m) = 1, where gcd is the greatest common divisor , i.e., the largest integer that divides both numbers a and m. The fact that two numbers have a gcd of 1 is of great importance in number theory, and there is a special name for it: if gcd(a,m) = 1, then a and m are said to be relatively prime or coprime 互质.

##### 如果存在multiplicative Inverse,则有如下几个性质:

+ 唯一性

  跟前面additive inverse一样反证利用结合律：

  对于x ∈ Zm 如果存在两个不同的加法逆元a,b ∈ Zm，st. xa=ax=xb=bx=1，

  根据结合律 axb = (ax)b = 1b=b , axb=a(xb)=a1=a，跟a和b不同矛盾

+ x对n模运算的乘法逆存在的前提是公约数gcd(x,n)=1 

  **证明Proving that modular inverse only exists when gcd(n,x)=1**https://math.stackexchange.com/questions/2101189/proving-that-modular-inverse-only-exists-when-gcdn-x-1

  If there is an inverse of x mod n, that gives us a number y so that xy≡1mod n . That means that xy=kn+1, or (rearranging) that xy−kn=1.

  Now for any common divisor, c, of x and n we will have that c∣(xy−kn) which gives c∣1, that is, c=1. So that is an outcome - and therefore a requirement - of finding the inverse of x mod n

##### Unit

x ∈ R ,x is unit if ∃ 1/x = x<sup>-1</sup> ∈ R

s.t. x(1/x)=1 , (1/x)x=1

## 2. Communitative Rings

based on the definition of Rings, just add one more axioms, that it must obey :

∀ x,y ∈ R , xy=yx

example: 

Rational numbers,

Real numbers,

Complex numbers,

all the prime fields on vector space,

Integer Rings, 

Zero Ring:

{0} the additive identity&multiplicative identity is the same 0

## 3. Sub Ring

Two trivial example:

+ Zero Ring is sub ring of any Ring;
+ any Ring is the sub ring of itself

## 4. Ring of Polynomials

R[x] = Ring of polynomials in the indeterminant x over the ring R

x<sup>0</sup>, x<sup>1</sup>, x<sup>2</sup>, x<sup>3</sup>, ...........

$$
\sum_{i=0}^∞ ai \quad
$$

<disqus/>