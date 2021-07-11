Modular Arithmetic

## 1.Definition 1.4.1 Modulo Operation

Let a, r,m ∈ Z (where Z is a set of all integers) and m > 0. We write
`a ≡ r mod m`
if m divides a−r.
m is called the modulus and r is called the remainder.

=>

It is always possible to write a ∈ Z, such that
a = q ·m+r for 0 ≤ r < m

Since a−r = q ·m (m divides a−r) we can now write: a ≡ r mod m. Note that r ∈ {0,1,2, . . . ,m−1}.

example:

13/5 = 2 ("the quotient") + 3/5 ("the remainder").
13 = 2(5) + 3.
If a and b are positive integers, there exist integers unique non-negative integers q and r so that
a = qb + r , where 0 =< r < b.
q is called the quotient and r the remainder.

### Properties

#### 1) The Remainder Is Not Unique

 12 ≡3 mod9, 3 is a valid remainder since 9|(12−3)
 12 ≡ 21 mod 9, 21 is a valid remainder since 9|(21−3)
 12≡−6 mod 9, −6 is a valid remainder since 9|(−6−3)

−6 ≡ 21 ≡ 12 ≡ 3 ≡ 3 mod9

where the “x|y” means “x divides y”. There is a system behind this behavior. The set of numbers
{. . . ,−24,−15,−6,3,12,15,24, . . .}
form what is called an **equivalence class**. There are eight other equivalence classes for the modulus 9:
{. . . ,−27,−18,−9, 0, 9,18,27, . . .}
{. . . ,−26,−17,−8, 1, 10,19,28, . . .}
...
{. . . ,−19,−10,−1, 8, 17,26,35, . . .}

#### 2) All Members of a Given Equivalence Class Behave Equivalently 同态？

If we have involved computations with a fixed modulus — which is usually the case in cryptography — we are free to choose the class element that results in the easiest computation.

The core operation in many practical public-key schemes is an exponentiation of the form x<sup>e</sup> mod m, where x,e,m are very large integers, say, 2048 bits each. Using a toy-size example, we can demonstrate two ways of doing modular exponentiation.
We want to compute 3<sup>8</sup> mod 7. The first method is the straightforward approach, and for the second one we switch between equivalent classes.
 3<sup>8</sup> = 6561 ≡ 2 mod 7, since 6561 = 937 · 7+2
Note that we obtain the fairly large intermediate result 6561 even though we know that our final result cannot be larger than 6.
 Here is a much smarter method: First we perform two partial exponentiations:
3<sup>8</sup> = 3<sup>4</sup> · 3<sup>4</sup> = 81 · 81

We can now replace the intermediate results 81 by another member of the same equivalence class. The smallest positive member modulo 7 in the class is 4 (since 81 = 11 · 7+4). Hence:
3<sup>8</sup> = 81 · 81 ≡ 4 · 4 = 16 mod 7 ≡ 2 mod 7.



### 模的逆

⅓ mod 28 = 19 (3*19 mod 28 =1)

如何计算参见后面的 Euclidean algorithm

**证明x对n模运算的逆存在的前提是公约数gcd(x,n)=1 Proving that modular inverse only exists when gcd(n,x)=1**

https://math.stackexchange.com/questions/2101189/proving-that-modular-inverse-only-exists-when-gcdn-x-1

```
If there is an inverse of x mod n, that gives us a number y so that xy≡1 mod n. That means that xy=kn+1, or (rearranging) that xy−kn=1.
Now for any common divisor, c, of x and n we will have that c∣(xy−kn) which gives c∣1, that is, c=1. So that is an outcome - and therefore a requirement - of finding the inverse of xmodn
```

另一种证明没有看懂，在：https://baike.baidu.com/item/%E6%AC%A7%E5%87%A0%E9%87%8C%E5%BE%97%E7%AE%97%E6%B3%95



### 负数的模：

mod(a, n) = a - n * floor(a / n)



-104 mod 28

= -104 - 28*floor(-104/28)

=-104 - 28*(-3.7) 不同程序结果不同，比如-3.7向下取整 -4 ，结果为8，向上取整或向零取整结果为-20



### Ord的意思

https://math.stackexchange.com/questions/638597/what-does-ord-mean/638604

Ord29(x)=7 	====		x<sup>7</sup> ≡ 1mod29

## 2. Euclidean algorithms (Basic and Extended)

refer: 

https://www.geeksforgeeks.org/euclidean-algorithms-basic-and-extended/

http://www-math.ucdenver.edu/~wcherowi/courses/m5410/exeucalg.html

### 引入

**The greatest common divisor** of integers a and b, denoted by gcd(a,b), is the largest integer that divides (without remainder) both a and b

For small numbers, the gcd is easy to calculate by factoring both numbers and finding the highest common factor.

For the large numbers which occur in public-key schemes, however, factoring often is not possible, and amore efficient algorithm is used for gcd computations, the Euclidean algorithm.

### Basic:

```
Euclidean Algorithm
Input: positive integers r0 and r1 with r0 > r1
Output: gcd(r0, r1)
Initialization: i = 1
Algorithm:
1 	DO
1.1 	i = i+1
1.2 	ri = ri−2 mod ri−1
	WHILE ri = 0
2 	RETURN
		gcd(r0, r1) = ri−1
```

两步说明：

The algorithm is based on the below facts:

1. 第一步：减法，If we subtract a smaller number from a larger (we reduce a larger number), GCD doesn’t change. So if we keep subtracting repeatedly the larger of two, we end up with GCD.

   Prove:

   gcd(a, b) = gcd(a,b-a), where we assume that b > a, and that both numbers are positive integers. This property can easily be proven: Let gcd(a, b) = g. Since g divides both a and b, we can write a = g · x and b = g · y, where x < y, and x and y are coprime integers,
   i.e., they do not have common factors. Moreover, it is easy to show that (y-x) and x are also coprime. It follows from here that:
   gcd(a,b-a) = gcd(gx,g(y-x)) = g.
   
   另一种直觉证明：assume a<b, gcd(a,b)=gcd(a,b-a)  分数的基本运算规则:  c|b-a = c|b - c|a 所以如果c是最大公约数，那么c就能同时整除a和b，自然也能整除b-a，所以c也是a和b-a的最大公约数
   
   第一种应用：直接求gcd，不断repeat减法
   
   a0=a,b0=b, a<b, gcd(a,b)=gcd(a,b-a) 
   
   if b-a<a,  a1=b-a, b1=a, gcd(b-a,a)=gcd(b-a,a-(b-a)) 
   
   .....
   
   直到 an=bn
   
   gcd(a,b)=an=bn
   
   e.g:
   
   gcd(5,13) = gcd(5,13-5)=gcd(5,8)=gcd(5,8-5)=gcd(5,3)=gcd(3,5-3)=gcd(3,2)=gcd(2,3-2)=gcd(2,1)=gcd(1,2-1)=gcd(1,1)
   
   
   
   第二种应用：引出第二步
   
   gcd(r0, r1) = gcd(r0−r1, r1), where we assume that r0 > r1, and that both numbers are positive integers
   
   It also follows immediately that we can apply the process iteratively:
   gcd(r0, r1) = gcd(r0−r1, r1) = gcd(r0−2r1, r1) = · · · = gcd(r0−mr1, r1)
   as long as (r0 −mr1) > 0. 
   The algorithm uses the fewest number of steps if we choose the maximum value for m. This is the case if we compute:
   gcd(r0, r1) = gcd(r0 mod r1, r1). 因为  `r0 mod r1 => r0 ≡ r mod r1 => r0=mr1+r,0 ≤ r < r1 => r=r0-mr1 `
   
   gcd(13,5)=gcd(13-5,5)=gcd(8,5)=gcd(8-5,5)=gcd(3,5)  r0 mod r1=3, r0-2*r1=3modr1
   
   Since the first term (r0 mod r1) is smaller than the second term r1, we usually swap them:
   gcd(r0, r1) = gcd(r1, r0 mod r1).
   
   gcd(13,5) = gcd(5,3)
   
   The core observation from this process is that we can reduce the problem of finding the gcd of two given numbers to that of the gcd of two smaller numbers.
   This process can be applied recursively until we obtain finally gcd(rl ,0) = rl . Since each iteration preserves the gcd of the previous iteration step, it turns out that this final gcd is the gcd of the original problem, i.e.,
   gcd(r0, r1) = · · · = gcd(rl ,0) = rl .
   
   gcd(13,5) = gcd(5, 13mod5)=gcd(5,3)=gcd(3,5mod3)=gcd(3,2)=gcd(2,3mod2)=gcd(2,1)=gcd(1,2mod1)=gcd(1,0)



2. 第二步：除法/取模，

   前面已经一步的第二种应用已经证明了，这里再用一种方式引入

   Now instead of subtraction, if we divide the smaller number, the algorithm stops when we find remainder 0, The gcd of two integers can be found by repeated application of the division algorithm, this is known as the Euclidean Algorithm. You repeatedly divide the divisor by the remainder until the remainder is 0. The gcd is the last non-zero remainder in this algorithm.

   assume a<b, 

   r=b%a=b mod a => b = qa+r

   gcd(a,b)=gcd(a,b%a) = gcd(a, r)

   显然如果c是a和b的最大公约数，c可以整除a和b，c|b=c|(qa+r)，所以c必然也能整除r，所以c也是a和r的最大公约数
   
   
   
   The following example shows the algorithm
   
   ```
   # Function to return gcd of a and b
   def gcd(a, b):
       if a == 0 :
           return b
        
       return gcd(b%a, a)
    
   Finding the gcd of 81 and 57 by the Euclidean Algorithm:
   b=81
   a=57
   
   method1: substract
   GCD(a, b) = GCD(b-a, a) = GCD(81-57, 57) = GCD(24, 57) = GCD(57-24, 24)=GCD(33, 24)=GCD(33-24, 24)=GCD(9,24)=GCD(24-9, 9)=GCD(15,9)=GCD(15-9,9)=GCD(6,9)=GCD(9-6,6)=GCD(3,6)=GCD(6-3,3)=GCD(3,3)=GCD(3-3,3)=GCD(0,3)
   =>GCD=3
   
   method2: divide
   GCD(a, b) = GCD(b%a, a) = GCD(81%57,57)=GCD(24,57)=GCD(57%24,24)=GCD(9,24)=GCD(24%9,9)=GCD(6,9)=GCD(9%6,6)=GCD(3,6)=GCD(6%3,3)=GCD(0,3)
   =>GCD=3
   另一种表示方法：
81 = 1(57) + 24
   57 = 2(24) + 9
   24 = 2(9) + 6
   9 = 1(6) + 3
   6 = 2(3) + 0
   ```
   
   

### Extended

#### Intro

So far, we have seen that finding the gcd of two integers r0 and r1 can be done by recursively reducing the operands. However, it turns out that finding the gcd is not the main application of the Euclidean algorithm. An extension of the algorithm allows us to compute modular inverses, which is of major importance in public-key cryptography.



Extended Euclidean algorithm also finds integer coefficients x and y such that: 
gcd(a, b) =  ax + by 

It is well known that if the gcd(a, b) = r then there exist integers x and y so that:

gcd(a, b) = x(a) + y(b) = r

By reversing the steps in the Euclidean Algorithm, it is possible to find these integers x and y. 





Example 6.5. We consider the extended Euclidean algorithm with r0 = 973 and r1 = 301. On the left-hand side, we compute the standard Euclidean algorithm, i.e., we compute new remainders r2, r3, . . .. Also, we have to compute the integer quotient qi−1 in every iteration. On the right-hand side we compute the coefficients si and ti such that ri = sir0 +tir1. The coefficients are always shown in brackets.

| i    | r<sub>i−2</sub> = q<sub>i−1</sub> · r<sub>i−1</sub>+ri | ri = [si]r0 +[ti]r1                                          |
| ---- | ------------------------------------------------------ | ------------------------------------------------------------ |
| 2    | r2=r0modr1=>r0=q1r1+r2<br/><br/>973 = 3 · 301+70       | r2=s2r0+t2r1<br/><br/>70 = [1]r0 +[−3]r1                     |
| 3    | r3=r1modr2=>r1=q2r2+r3<br/><br/>301 = 4 · 70+21        | r3=s3r0+t3r1<br/><br/>21 = 301−4 · 70<br/>= r1−4(1r0−3 r1)<br/>= [−4]r0 +[13]r1 |
| 4    | r4=r2modr3=>r2=q3r3+r4<br/><br/>70 = 3 · 21+7          | r4=s4r0+t4r1<br/><br/>7 =70−3 · 21<br/>= (1r0−3r1)−3(−4r0+13r1)<br/>= [13]r0 +[−42]r1 |
| 5    | r3=q4r4+r5<br/><br/>1 = 3 · 7+0<br/>r5==0 return       |                                                              |

The algorithm computed the three parameters gcd(973,301) = 7, s = 13 and t = −42. The correctness can be verified by:
gcd(973,301) = 7 = [13]973+[−42]301 = 12649−12642.



You should carefully watch the algebraic steps taking place in the right column of the example above. In particular, observe that the linear combination on the righthand side is always constructed with the help of the previous linear combinations. We will now derive recursive formulae for computing si and ri in every iteration. Assume we are in iteration with index i. In the two previous iterations we computed the values:
r<sub>i−2</sub> = [s<sub>i−2</sub>]r0 +[t<sub>i−2</sub>]r1 
r<sub>i−1</sub> = [s<sub>i−1</sub>]r0 +[t<sub>i−1</sub>]r1 
In the current iteration i we first compute the quotient q<sub>i−1</sub> and the new remainder
ri from r<sub>i−1</sub> and r<sub>i−2</sub>:
r<sub>i−2</sub> = q<sub>i−1</sub> · r<sub>i−1</sub>+ri.
This equation can be rewritten as:
ri = r<sub>i−2</sub>−q<sub>i−1</sub> · r<sub>i−1</sub>
Recall that our goal is to represent the new remainder ri as a linear combination of r0 and r1. The core step for achieving this happens now:

 we simply substitute r<sub>i−2</sub> and r<sub>i−1</sub>:
ri = (s<sub>i−2</sub>r0+t<sub>i−2</sub>r1)−q<sub>i−1</sub>(s<sub>i−1</sub>r0+t<sub>i−1</sub>r1)

If we rearrange the terms we obtain the desired result:
ri = [s<sub>i−2</sub>−q<sub>i−1</sub>s<sub>i−1</sub>]r0 +[t<sub>i−2</sub>−q<sub>i−1</sub>t<sub>i−1</sub>]r1 
ri = [si]r0 +[ti]r1

si=s<sub>i−2</sub>−q<sub>i−1</sub>s<sub>i−1</sub>, ti=t<sub>i−2</sub>−q<sub>i−1</sub>t<sub>i−1</sub>

上面的例子是从i=2开始的，因为r<sub>i−2</sub> = q<sub>i−1</sub> · r<sub>i−1</sub>+ri，肯定需要从i-2=0开始即

r0=q1r1+r2开始，所以套用前面推导的公式

si=s<sub>i−2</sub>−q<sub>i−1</sub>s<sub>i−1</sub>, ti=t<sub>i−2</sub>−q<sub>i−1</sub>t<sub>i−1</sub>

当i=2时，

s2=s0-q1s1, t2=t0-q1t1

同时根据 r2=r0-q1r1知道

s2=1, t2=-q1

系数对比得出

=>s0-q1s1=1，t0-q1t1=-q1

q1是第一次模的系数是变量，所以得出s1=0，s0=1，t0=0，t1=1，从而得出下面EEA的算法：



Extended Euclidean Algorithm (EEA)
Input: positive integers r0 and r1 with r0 > r1
Output: gcd(r0, r1), as well as s and t such that gcd(r0, r1) = s · r0+t · r1.
Initialization:
s0 = 1 t0 = 0
s1 = 0 t1 = 1
i = 1
Algorithm:
1 	DO
1.1 	i = i+1
1.2 	ri = r<sub>i−2</sub> mod r<sub>i−1</sub>
1.3 	q<sub>i−1</sub> = (r<sub>i−2</sub>−ri)/r<sub>i−1</sub>
1.4 	si = s<sub>i−2</sub>−q<sub>i−1</sub> · s<sub>i−1</sub>
1.5 	ti = t<sub>i−2</sub>−q<sub>i−1</sub> · t<sub>i−1</sub>
		WHILE ri <> 0
2 	 RETURN
			gcd(r0, r1) = r<sub>i−1</sub>
			s = s<sub>i−1</sub>
			t = t<sub>i−1</sub>



We shall do this with the above example:

```
r0 = 973 and r1 = 301
Initialization:
s0 = 1 t0 = 0
s1 = 0 t1 = 1
i = 1
> round 1: i=2,
    r2=r0 mod r1=70
    q1=(r0-r2)/r1=(973-70)/301=3
    s2=s0-q1s1=1-3*0=1
    t2=t0-q1t1=0-3*1=-3
> round 2: i=3,
    r3=r1 mod r2=21
    q2=(r1-r3)/r2=(301-21)/70=4
    s3=s1-q2s2=0-4*1=-4
    t3=t1-q2t2=1-4*(-3)=13
> round 3: i=4,
	r4=r2 mod r3=7
	q3=(r2-r4)/r3=(70-7)/21=3
	s4=s2-q3s3=1-3*(-4)=13
	t4=t2-q3t3=-3-3*13=-42
> round 4: i=5,
	r5=r3 mod r4=21 mod 7 =0
	RETURN:
		gcd(r0,r1)=r<sub>i-1</sub>=r4=7
		s=si-1=s4=13
		t=ti-1=t4=-42
		

另一种思路
As seen above, x and y are results for inputs a and b,
   a.x + b.y = gcd                      ----(1)  

And x1 and y1 are results for inputs b%a and a
   (b%a).x1 + a.y1 = gcd   
                    
When we put b%a = (b - (⌊b/a⌋).a) in above, we get following. Note that ⌊b/a⌋ is floor(b/a)

   (b - (⌊b/a⌋).a).x1 + a.y1  = gcd

Above equation can also be written as below
   b.x1 + a.(y1 - (⌊b/a⌋).x1) = gcd      ---(2)

After comparing coefficients of 'a' and 'b' in (1) and (2), we get following
   x = y1 - ⌊b/a⌋ * x1
   y = x1
   
def gcdExtended(a, b):
    # Base Case
    if a == 0 : 
        return b, 0, 1
            
    gcd, x1, y1 = gcdExtended(b%a, a)
    
    # Update x and y using results of recursive
    # call
    x = y1 - (b//a) * x1
    y = x1
    
    return gcd, x, y

gcdExtended(57,81) |返回 gcd,x1,y1=(3,-7,3) , x=3-(81//57)*-7=3+floor(1.4)*7=10 y=-7 对应 3=10(57) -7(81)
=>
gcdExtended(81%57,57)=gcdExtended(24,57) |返回 gcd,x1,y1=(3,3,-1) , x=-1-(57//24)*3=-1-floor(2.3)*3=-7 y=3 对应 3=3(57) - 7(24)
=>
gcdExtended(57%24,24)=gcdExtended(9,24) |返回 gcd,x1,y1=(3,-1,1) , x=1-(24//9)*-1=1+floor(2.6)=3 y=-1 对应 3=3*9+-1*24
=>
gcdExtended(24%9,9)=gcdExtended(6,9) |返回 gcd,x1,y1=(3,1,0) , x=0-(9//6)*1=-1 y=1 对应 3=-1*6+1*9
=>
gcdExtended(9%6,6)=gcdExtended(3,6) |返回 gcd,x1,y1=(3,0,1) , x=1-(6//3)*0=1 y=0  对应 3=1*3+0*6
=>
gcdExtended(6%3,3)=gcdExtended(0,3) a==0, return 3,0,1 开始返回   
```

#### Calculate Multiplicative Inverse

**How is Extended Algorithm Useful? **

The extended Euclidean algorithm is particularly useful when a and b are coprime (or gcd is 1). 

The inverse of a exists if and only if gcd(a, b) = 1,

based on  Extended Algorithm We now know that if this is true, there exist integers x and y so that xa + yb = 1.

=>

xa = 1 + (-y)b, or in other words, xa≡1 (mod b). So, x (reduced mod b if need be) is the inverse of a mod b. The extended Euclidean algorithm will give us a method for calculating x efficiently (note that in this application we do not care about the value for y, so we will simply ignore it.)

=>

**x is the modular multiplicative inverse of “a modulo b”, and y is the modular multiplicative inverse of “b modulo a”. **

**In particular, the computation of the modular multiplicative inverse is an essential step in RSA public-key encryption method.**



延续前面的r0，r1的写法：

s·r0+t ·r1 =1=gcd(r0, r1)

即 s · r0+t · r1 = 1 两边mod r0

s · r0 mod r0+t · r1 mod r0 = 1 mod r0

=>  s · 0+t · r1 mod r0 ≡ 1 mod r0

=> t · r1 ≡ 1 mod r0
=> r1 · t ≡ 1 mod r0  means, that t itself is the inverse of r1(mod r0):
t = r<sub>1</sub><sup>−1</sup> mod r0

同理可知

s=r<sub>0</sub><sup>−1</sup> mod r1

Find the inverse of 15 mod 26.

```
r0 = 26 and r1 = 15
Initialization:
s0 = 1 t0 = 0
s1 = 0 t1 = 1
i = 1
> round 1: i=2,
    r2=r0 mod r1=26mod15=11
    q1=(r0-r2)/r1=(26-11)/15=1
    s2=s0-q1s1=1-1*0=1
    t2=t0-q1t1=0-1*1=-1
> round 2: i=3,
    r3=r1 mod r2=15mod11=4
    q2=(r1-r3)/r2=(15-4)/11=1
    s3=s1-q2s2=0-1*1=-1
    t3=t1-q2t2=1-1*(-1)=2
> round 3: i=4,
	r4=r2 mod r3=11mod4=3
	q3=(r2-r4)/r3=(11-3)/4=2
	s4=s2-q3s3=1-2*(-1)=3
	t4=t2-q3t3=-1-2*2=-5
> round 4: i=5,
	r5=r3 mod r4=4 mod 3 =1
	q4=(r3-r5)/r4=(4-1)/3=1
	s5=s3-q4s4=-1-1*3=-4
	t5=t3-q4t4=2-1*(-5)=7
> round 5: i=6,
	r6=r4 mod r5=3mod1=0
	RETURN:
		gcd(r0,r1)=ri-1=r5=1
		s=si-1=s5=-4
		t=ti-1=t5=7
		
gcd(r0,r1)=sr0+tr1=-4*26+7*15=1
=>
7*15=1+4*26≡ 1 (mod 26).	
所以the inverse of 15 mod 26 is 7
 
另一种思路：
The Extended Euclidean Algorithm for finding the inverse of a number mod n.
We will number the steps of the Euclidean algorithm starting with step 0. The quotient obtained at step i will be denoted by qi. As we carry out each step of the Euclidean algorithm, we will also calculate an auxillary number, pi. For the first two steps, the value of this number is given: p0 = 0 and p1 = 1. For the remainder of the steps, we recursively calculate pi = p<sub>i-2</sub> - p<sub>i-1</sub> q<sub>i-2</sub> (mod n). Continue this calculation for one step beyond the last step of the Euclidean algorithm.
The algorithm starts by "dividing" n by x. If the last non-zero remainder occurs at step k, then if this remainder is 1, x has an inverse and it is p<sub>k+2</sub>. (If the remainder is not 1, then x does not have an inverse.) :
Step 0:	26 = 1(15) + 11	p0 = 0, q0=1
Step 1:	15 = 1(11) + 4	p1 = 1, q1=1
Step 2:	11 = 2(4) + 3	p2 = 0 - 1( 1) mod 26 = 25 [ -1 mod 26 =  -1 - 26 * floor(-1/26) = -1 +26 = 25]
Step 3:	4 = 1(3) + 1	p3 = 1 - 25( 1) mod 26 = -24 mod 26 = 2
Step 4:	3 = 3(1) + 0	p4 = 25 - 2( 2) mod 26 = 21

last non-zeor remainder happens at step 3, and it's 1, x has inverse and it's p<sub>3+2</sub>=p5 = 2 - 21( 1) mod 26 = -19 mod 26 = 7
Notice that 15(7) = 105 = 1 + 4(26) ≡ 1 (mod 26).
```

#### Multiplicative inverses in Galois fields

For completeness, we show how the EEA can also be used for computing multiplicative inverses in Galois fields. In modern cryptography this is mainly relevant for the derivation of the AES S-Boxes and for elliptic curve public-key algorithms. The EEA can be used completely analogously with polynomials instead of integers. If we want to compute an inverse in a finite field GF(2<sup>m</sup>), the inputs to the algorithm are the field element A(x) and the irreducible polynomial P(x). The EEA computes the auxiliary polynomials s(x) and t(x), as well as the greatest common divisor gcd(P(x),A(x)) such that:
s(x)P(x)+t(x)A(x) = gcd(P(x),A(x)) = 1
Note that since P(x) is irreducible, the gcd is always equal to 1. If we take the equation above and reduce both sides modulo P(x), it is straightforward to see that the auxiliary polynomial t(x) is equal to the inverse of A(x):

=> s(x)0+t(x)A(x) ≡ 1 mod P(x)
=> t(x) ≡ A(x)<sup>-1</sup> mod P(x)
We give at this point an example of the algorithm for the small field GF(2<sup>3</sup>).

Example 6.7. We are looking for the inverse of A(x) = x<sup>2</sup> in the finite field GF(2<sup>3</sup>) with P(x) = x<sup>3</sup> +x+1. The initial values for the t(x) polynomial are: t<sub>0</sub>(x) = 0, t<sub>1</sub>(x) = 1

r0=P(x) = x<sup>3</sup> +x+1

r1=A(x) = x<sup>2</sup>

| Iteration | r<sub>i−2</sub>(x) =[q<sub>i−1</sub>(x)] r<sub>i−1</sub>(x)+[ri(x)] | t<sub>i</sub>(x)  [ri = [si]r0 +[ti]r1]                      |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 2         | r2=r0modr1=>r0=q1r1+r2<br/><br/>x<sup>3</sup> +x+1 = [x]x<sup>2</sup> +(x+1) | r2=s2r0+t2r1<br/>x+1 = (x<sup>3</sup> +x+1)+\[-x\](x<sup>2</sup>)<br/>t2 = t0−q1t1 = 0−x1 ≡ x |
| 3         | x<sup>2</sup> = \[x\](x+1)+[x]                               | t3 = t1−q2t2 = 1−x (x) ≡ 1+x<sup>2</sup>                     |
| 4         | x+1 = [1]x+[1]                                               | t4 = t2−q3t3 = x−1(1+x<sup>2</sup>)<br/>t4 ≡ 1+x+x<sup>2</sup> |
| 5         | x = [x]1+[0]                                                 | Termination since r5 = 0                                     |

Note that polynomial coefficients are computed in GF(2), and since addition and multiplication are the same operations, we can always replace a negative coefficient (such as −x) by a positive one. The new quotient and the new remainder that are computed in every iteration are shown in brackets above. The polynomials ti(x) are computed according to the recursive formula that was used for computing the integers ti earlier in this section. The EEA terminates if the remainder is 0, which is the case in the iteration with index 5. The inverse is now given as the last ti(x) value that was computed, i.e., t4(x):
A(x)<sup>−1</sup> =t(x) =t<sub>4</sub>(x) = x<sup>2</sup>+x+1.
Here is the check that t(x) is in fact the inverse of x<sup>2</sup>, where we use the properties that x<sup>3</sup> ≡ x+1 mod P(x) and x<sup>4</sup> ≡ x<sup>2</sup>+x mod P(x):
t<sub>4</sub>(x) · x<sup>2</sup> = x<sup>4</sup>+x<sup>3</sup>+x<sup>2</sup>
≡ (x<sup>2</sup>+x)+(x+1)+x<sup>2</sup> mod P(x)
≡ 1 mod P(x)