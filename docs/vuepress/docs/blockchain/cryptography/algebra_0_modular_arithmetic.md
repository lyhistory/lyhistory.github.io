

## 1. Modular Arithmetic

### 1.1 Definition 1.4.1 Modulo Operation
Let a, r,m ∈ Z (where Z is a set of all integers) and m > 0. We write
	a ≡ r mod m
if m divides a−r.
m is called the modulus and r is called the remainder.

=>

It is always possible to write a ∈ Z, such that
a = q ·m+r for 0 ≤ r < m

Since a−r = q ·m (m divides a−r) we can now write: a ≡ r mod m. Note that r ∈ {0,1,2, . . . ,m−1}.

#### The Remainder Is Not Unique

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

#### All Members of a Given Equivalence Class Behave Equivalently 同态？

If we have involved computations with a fixed modulus — which is usually the case in cryptography — we are free to choose the class element that results in the easiest computation.

The core operation in many practical public-key schemes is an exponentiation of the form x<sup>e</sup> mod m, where x,e,m are very large integers, say, 2048 bits each. Using a toy-size example, we can demonstrate two ways of doing modular exponentiation.
We want to compute 3<sup>8</sup> mod 7. The first method is the straightforward approach, and for the second one we switch between equivalent classes.
 3<sup>8</sup> = 6561 ≡ 2 mod 7, since 6561 = 937 · 7+2
Note that we obtain the fairly large intermediate result 6561 even though we know that our final result cannot be larger than 6.
 Here is a much smarter method: First we perform two partial exponentiations:
3<sup>8</sup> = 3<sup>4</sup> · 3<sup>4</sup> = 81 · 81

We can now replace the intermediate results 81 by another member of the same equivalence class. The smallest positive member modulo 7 in the class is 4 (since 81 = 11 · 7+4). Hence:
3<sup>8</sup> = 81 · 81 ≡ 4 · 4 = 16 mod 7 ≡ 2 mod 7.



### 1.4 Euclidean algorithms (Basic and Extended)

https://www.geeksforgeeks.org/euclidean-algorithms-basic-and-extended/

http://www-math.ucdenver.edu/~wcherowi/courses/m5410/exeucalg.html

13/5 = 2 ("the quotient") + 3/5 ("the remainder").
13 = 2(5) + 3.
If a and b are positive integers, there exist integers unique non-negative integers q and r so that
a = qb + r , where 0 =< r < b.
q is called the quotient and r the remainder.
The greatest common divisor of integers a and b, denoted by gcd(a,b), is the largest integer that divides (without remainder) both a and b

#### Basic:

The algorithm is based on the below facts:

1. If we subtract a smaller number from a larger (we reduce a larger number), GCD doesn’t change. So if we keep subtracting repeatedly the larger of two, we end up with GCD.

   assume a<b, gcd(a,b)=gcd(a,b-a)  分数的基本运算规则:  c|b-a = c|b - c|a 所以如果c是最大公约数，那么c就能同时整除a和b，自然也能整除b-a，所以c也是a和b-a的最大公约数

   gcd(5,13) = gcd(5,13-5)=gcd(5,8)=gcd(5,8-5)=gcd(5,3)=gcd(3,5-3)=gcd(3,2)=gcd(2,3-2)=gcd(2,1)=gcd(1,2-1)=gcd(1,1)



2. Now instead of subtraction, if we divide the smaller number, the algorithm stops when we find remainder 0, The gcd of two integers can be found by repeated application of the division algorithm, this is known as the Euclidean Algorithm. You repeatedly divide the divisor by the remainder until the remainder is 0. The gcd is the last non-zero remainder in this algorithm.

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

   

#### Extended

##### Intro

Extended Euclidean algorithm also finds integer coefficients x and y such that: 
  ax + by = gcd(a, b) 

It is well known that if the gcd(a, b) = r then there exist integers p and s so that:

gcd(a, b) = x(a) + y(b) = r

By reversing the steps in the Euclidean Algorithm, it is possible to find these integers x and y. We shall do this with the above example:

```

3 = 1(9) -1(6) 
=> (a,b,x,y)=(6,9,-1,1)

From the line before that, we see that 6 = 1(24) - 2(9), so:
3 = 1(9) - 1(24 - 2(9)) = 3(9) - 1(24). 
=> (a,b,x,y)=(9,24,3,-1)

From the line before that, we have 9 = 57 - 2(24), so:
3 = 3( 57 - 2(24)) - 1(24) = 3(57) - 7(24). 
=> (a,b,x,y)=(24,57,-7,3)

And, from the line before that 24 = 81 - 1(57), giving us:
3 = 3(57) - 7( 81 - 1(57)) = 10(57) -7(81). 
=> (a,b,x,y)=(57,81,10,-7)

So we have found x = -7 and y = 10.

这里是从 a=6，b=9开始推算的， 而a=3，b=6对应下面退出程序的第一个回溯
3=1*3+0*6 =>  (a,b,x,y)=(3,6,1,0)
然后退出条件是
(a,b,x,y)=(0,3,0,1)
可以这么理解，根据前面basic的第二种方法，一直是找到r=0，也就是最终a可以整除b，所以a可以表示为 a=1*a+0*b 作为回溯的第一次
```

The procedure we have followed above is a bit messy because of all the back substitutions we have to make. It is possible to reduce the amount of computation involved in finding p and s by doing some auxillary computations as we go forward in the Euclidean algorithm (and no back substitutions will be necessary). This is known as the extended Euclidean Algorithm.

##### Prove

How does Extended Algorithm Work?

```
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
   
   
```



=> 程序：

```


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
gcdExtended(81%57,81)=gcdExtended(24,57) |返回 gcd,x1,y1=(3,3,-1) , x=-1-(57//24)*3=-1-floor(2.3)*3=-7 y=3 对应 3=3(57) - 7(24)
=>
gcdExtended(57%24,57)=gcdExtended(9,24) |返回 gcd,x1,y1=(3,-1,1) , x=1-(24//9)*-1=1+floor(2.6)=3 y=-1 对应 3=3*9+-1*24
=>
gcdExtended(24%9,9)=gcdExtended(6,9) |返回 gcd,x1,y1=(3,1,0) , x=0-(9//6)*1=-1 y=1 对应 3=-1*6+1*9
=>
gcdExtended(9%6,6)=gcdExtended(3,6) |返回 gcd,x1,y1=(3,0,1) , x=1-(6//3)*0=1 y=0  对应 3=1*3+0*6
=>
gcdExtended(6%3,3)=gcdExtended(0,3) a==0, return 3,0,1 开始返回

```

##### Calculate Multiplicative Inverse

**How is Extended Algorithm Useful? **

The extended Euclidean algorithm is particularly useful when a and b are coprime (or gcd is 1). 

The inverse of a exists if and only if gcd(a, b) = 1,

based on  Extended Algorithm We now know that if this is true, there exist integers x and y so that xa + yb = 1.

=>

xa = 1 + (-y)b, or in other words, xa=1 (mod n). So, x (reduced mod n if need be) is the inverse of a mod b. The extended Euclidean algorithm will give us a method for calculating p efficiently (note that in this application we do not care about the value for y, so we will simply ignore it.)

=>

 x is the modular multiplicative inverse of “a modulo b”, and y is the modular multiplicative inverse of “b modulo a”. 

**In particular, the computation of the modular multiplicative inverse is an essential step in RSA public-key encryption method.**

example: 跟前面的例子一样，只是gcd=1而已：

The Extended Euclidean Algorithm for finding the inverse of a number mod n.
We will number the steps of the Euclidean algorithm starting with step 0. The quotient obtained at step i will be denoted by qi. As we carry out each step of the Euclidean algorithm, we will also calculate an auxillary number, pi. For the first two steps, the value of this number is given: p0 = 0 and p1 = 1. For the remainder of the steps, we recursively calculate pi = p<sub>i-2</sub> - p<sub>i-1</sub> q<sub>i-2</sub> (mod n). Continue this calculation for one step beyond the last step of the Euclidean algorithm.
The algorithm starts by "dividing" n by x. If the last non-zero remainder occurs at step k, then if this remainder is 1, x has an inverse and it is p<sub>k+2</sub>. (If the remainder is not 1, then x does not have an inverse.) Here is an example:

Find the inverse of 15 mod 26.
Step 0:	26 = 1(15) + 11	p0 = 0, q0=1
Step 1:	15 = 1(11) + 4	p1 = 1, q1=1
Step 2:	11 = 2(4) + 3	p2 = 0 - 1( 1) mod 26 = 25 [ -1 mod 26 =  -1 - 26 * floor(-1/26) = -1 +26 = 25]
Step 3:	4 = 1(3) + 1	p3 = 1 - 25( 1) mod 26 = -24 mod 26 = 2
Step 4:	3 = 3(1) + 0	p4 = 25 - 2( 2) mod 26 = 21

last non-zeor remainder happens at step 3, and it's 1, x has inverse and it's p<sub>3+2</sub>=p5 = 2 - 21( 1) mod 26 = -19 mod 26 = 7
Notice that 15(7) = 105 = 1 + 4(26) ≡ 1 (mod 26).