## Shift Cipher (or Caesar Cipher)

英文26个字母的位置从0到25构造成Z26

Definition 1.4.3 Shift Cipher
Let x,y,k ∈ Z26.
Encryption: ek(x) ≡ x+k mod 26.
Decryption: dk(y) ≡ y−k mod 26.

## Affine Cipher

Now, we try to improve the shift cipher by generalizing the encryption function.
Recall that the actual encryption of the shift cipher was the addition of the key
yi = xi +k mod 26. The affine cipher encrypts by multiplying the plaintext by one
part of the key followed by addition of another part of the key.



Definition 1.4.4 Affine Cipher
Let x,y,a,b ∈ Z26
Encryption: ek(x) = y ≡ a · x+b mod 26.
Decryption: dk(y) = x ≡ a−1 · (y−b) mod 26.
with the key: k = (a,b), which has the restriction: gcd(a,26) = 1.

## Stream Ciphers

Definition 2.1.1 Stream Cipher Encryption and Decryption
The plaintext, the ciphertext and the key stream consist of individual
bits,
i.e., xi,yi, si ∈ {0,1}.
Encryption: yi = esi (xi) ≡ xi+si mod 2.
Decryption: xi = dsi (yi) ≡ yi+si mod 2.

Why Are Encryption and Decryption the Same Function?

The reason for the similarity of the encryption and decryption function can easily
be shown. We must prove that the decryption function actually produces the plaintext
bit xi again. We know that ciphertext bit yi was computed using the encryption
function yi ≡ xi +si mod 2. We insert this encryption expression in the decryption
function:
dsi (yi) ≡ yi+si mod 2
≡ (xi+si)+si mod 2
≡ xi+si+si mod 2
≡ xi+2si mod 2
≡ xi+0 mod 2
≡ xi mod 2 Q.E.D.
The trick here is that the expression (2 si mod 2) has always the value zero since
2 ≡ 0 mod 2. Another way of understanding this is as follows: If si has either the
value 0, in which case 2si = 2 · 0 ≡ 0 mod 2. If si = 1, we have 2si = 2 · 1 = 2 ≡
0 mod 2.

As we saw in the previous section, the actual encryption and decryption of stream
ciphers is extremely simple. The security of stream ciphers hinges entirely on a
“suitable” key stream s0, s1, s2, . . .. Since randomness plays a major role, we will first
learn about the three types of random number generators (RNG) that are important
for us.

True Random Number Generators (TRNG)
True random number generators (TRNGs) are characterized by the fact that their
output cannot be reproduced. For instance, if we flip a coin 100 times and record the
resulting sequence of 100 bits, it will be virtually impossible for anyone on Earth
to generate the same 100 bit sequence. The chance of success is 1/2100, which is
an extremely small probability. TRNGs are based on physical processes. Examples
include coin flipping, rolling of dice, semiconductor noise, clock jitter in digital
circuits and radioactive decay. In cryptography, TRNGs are often needed for generating
session keys, which are then distributed between Alice and Bob, and for other
purposes.

(General) Pseudorandom Number Generators (PRNG)
Pseudorandom number generators (PRNGs) generate sequences which are computed
from an initial seed value. Often they are computed recursively in the following
way:
s0 = seed
si+1 = f (si), i = 0,1, . . .
A generalization of this are generators of the form si+1 = f (si, si−1, . . . , si−t ), where
t is a fixed integer. A popular example is the linear congruential generator:
s0 = seed
si+1 ≡ asi+b mod m, i = 0,1, . . .
where a, b, m are integer constants. Note that PRNGs are not random in a true sense
because they can be computed and are thus completely deterministic. A widely used
example is the rand() function used in ANSI C. It has the parameters:
s0 = 12345
si+1 ≡ 1103515245si+12345 mod 231, i = 0,1, . . .
A common requirement of PRNGs is that they possess good statistical properties,
meaning their output approximates a sequence of true random numbers. There
are many mathematical tests, e.g., the chi-square test, which can verify the statistical
behavior of PRNG sequences. Note that there are many, many applications for pseudorandom
numbers outside cryptography. For instance, many types of simulations
or testing, e.g., of software or of VLSI chips, need random data as input. That is the
reason why a PRNG is included in the ANSI C specification.

Cryptographically Secure Pseudorandom Number Generators (CSPRNG)
Cryptographically secure pseudorandom number generators (CSPRNGs) are a special
type of PRNG which possess the following additional property: A CSPRNG is
PRNG which is unpredictable. Informally, this means that given n output bits of the
key stream si, si+1, . . . , si+n−1, where n is some integer, it is computationally infeasible
to compute the subsequent bits si+n, si+n+1, . . .. A more exact definition is that
given n consecutive bits of the key stream, there is no polynomial time algorithm
that can predict the next bit sn+1 with better than 50% chance of success. Another
property of CSPRNG is that given the above sequence, it should be computationally
infeasible to compute any preceding bits si−1, si−2, . . ..
Note that the need for unpredictability of CSPRNGs is unique to cryptography.
In virtually all other situations where pseudorandom numbers are needed in computer
science or engineering, unpredictability is not needed. As a consequence, the
distinction between PRNG and CSPRN and their relevance for stream ciphers is often
not clear to non-cryptographers. Almost all PRNG that were designed without
the clear purpose of being stream ciphers are not CSPRNGs.

## DES The Data Encryption Standard (DES) and

Alternatives

1. Confusion is an encryption operation where the relationship between key and
   ciphertext is obscured. Today, a common element for achieving confusion is substitution,
   which is found in both DES and AES.
2. Diffusion is an encryption operation where the influence of one plaintext symbol
   is spread over many ciphertext symbols with the goal of hiding statistical properties
   of the plaintext. A simple diffusion element is the bit permutation, which is
   used frequently within DES. AES uses the more advanced Mixcolumn operation.

DES is a cipher which encrypts blocks of length of 64 bits with a key of size of 56
bits

Alternatives：

AES, 

Triple DES (3DES) and DESX,

Lightweight Cipher PRESENT

## The Advanced Encryption Standard (AES)

The Advanced Encryption Standard (AES) is the most widely used symmetric cipher
today. Even though the term “Standard” in its name only refers to US government
applications, the AES block cipher is also mandatory in several industry standards
and is used in many commercial systems. Among the commercial standards that
include AES are the Internet security standard IPsec, TLS, the Wi-Fi encryption
standard IEEE 802.11i, the secure shell network protocol SSH (Secure Shell), the
Internet phone Skype and numerous security products around the world. To date,
there are no attacks better than brute-force known against AES.

The AES cipher is almost identical to the block cipher Rijndael. The Rijndael block
and key size vary between 128, 192 and 256 bits. However, the AES standard only
calls for a block size of 128 bits. Hence, only Rijndael with a block length of 128
bits is known as the AES algorithm.

In contrast to DES, AES does not have a Feistel structure. Feistel networks do
not encrypt an entire block per iteration, e.g., in DES, 64/2 = 32 bits are encrypted

in one round. AES, on the other hand, encrypts all 128 bits in one iteration. This is
one reason why it has a comparably small number of rounds.

AES consists of so-called layers. Each layer manipulates all 128 bits of the data
path. The data path is also referred to as the state of the algorithm. There are only
three different types of layers. Each round, with the exception of the first, consists
of all three layers, Moreover, the last round nr does not make
use of the MixColumn transformation, which makes the encryption and decryption
scheme symmetric.

Key Addition layer A 128-bit round key, or subkey, which has been derived from
the main key in the key schedule, is XORed to the state.
Byte Substitution layer (S-Box) Each element of the state is nonlinearly transformed
using lookup tables with special mathematical properties. This introduces
confusion to the data, i.e., it assures that changes in individual state bits propagate
quickly across the data path.
Diffusion layer It provides diffusion over all state bits. It consists of two sublayers,
both of which perform linear operations:
 The ShiftRows layer permutes the data on a byte level.
 The MixColumn layer is a matrix operation which combines (mixes) blocks of
four bytes.

**Galois field computations are needed for all operations within the AES layers.**

### Extension Fields GF(2<sup>m</sup>)

GF(2) addition, i.e., modulo 2 addition,
is equivalent to an XOR gate. What we learn from the example above is that GF(2)
multiplication is equivalent to the logical AND gate. The field GF(2) is important
for AES.

In AES the finite field contains 256 elements and is denoted as GF(2<sup>8</sup>). This field
was chosen because each of the field elements can be represented by one byte. For
the S-Box and MixColumn transforms, AES treats every byte of the internal data

path as an element of the field GF(2<sup>8</sup>) and manipulates the data by performing
arithmetic in this finite field.
However, if the order of a finite field is not prime, and 28 is clearly not a prime,
the addition and multiplication operation cannot be represented by addition and multiplication of integers modulo 2<sup>8</sup>(解释：从fields一章的结论 **Characteristic of a Field Ch(F) can only be zero or prime, ch(F)= 0 or prime(2,3,5....)**，所以order为256明显不是finite fields ). Such fields with m > 1 are called extension fields.
In order to deal with extension fields we need (1) a different notation for field elements
and (2) different rules for performing arithmetic with the elements. We will
see in the following that elements of extension fields can be represented as polynomials,
and that computation in the extension field is achieved by performing a
certain type of polynomial arithmetic.
In extension fields GF(2<sup>m</sup>) elements are not represented as integers but as polynomials
with coefficients in GF(2). The polynomials have a maximum degree of
m−1, so that there are m coefficients in total for every element. In the field GF(2<sup>8</sup>),
which is used in AES, each element A ∈ GF(2<sup>8</sup>) is thus represented as:
A(x) = a7x<sup>7</sup>+· · ·+a1x+a0, ai ∈ GF(2) = {0,1}.
Note that there are exactly 256 = 28 such polynomials. The set of these 256 polynomials
is the finite field GF(28). It is also important to observe that every polynomial
can simply be stored in digital form as an 8-bit vector
A = (a7,a6,a5,a4,a3,a2,a1,a0).
In particular, we do not have to store the factors x<sup>7</sup>, x<sup>6</sup>, etc. It is clear from the bit
positions to which power xi each coefficient belongs.



#### Addition and Subtraction in GF(2<sup>m</sup>):

Let’s now look at addition and subtraction in extension fields. The key addition layer
of AES uses addition. It turns out that these operations are straightforward. They are
simply achieved by performing standard polynomial addition and subtraction: We
merely add or subtract coefficients with equal powers of x. The coefficient additions
or subtractions are done in the underlying field GF(2).

Definition 4.3.3 Extension field addition and subtraction
Let A(x),B(x) ∈ GF(2m). The sum of the two elements is then computed
according to:
C(x) = A(x)+B(x) =
$$
\sum_{i=0}^{m-1} c_ix^j \quad
$$

, ci ≡ ai+bi mod 2
and the difference is computed according to:
C(x) = A(x)−B(x) =
$$
\sum_{i=0}^{m-1} c_ix^j \quad
$$

, ci ≡ ai−bi ≡ ai+bi mod 2.

Example 4.5. Here is how the sumC(x)=A(x)+B(x) of two elements from GF(28)
is computed:
A(x) =x7+ x6+ x4+ 1
B(x) = x4+ x2+ 1
C(x) = x7+ x6+ x2

#### Multiplication in GF(2<sup>m</sup>)

Multiplication in GF(2<sup>8</sup>) is the core operation of the MixColumn transformation of
AES. In a first step, two elements (represented by their polynomials) of a finite field
GF(2<sup>m</sup>) are multiplied using the standard polynomial multiplication rule:
$$
A(x) ·B(x) = (a_{m−1}x^{m−1}+· · ·+a_0) · (b_{m−1}x^{m−1}+· · ·+b_0)
$$

$$
C'(x) = c'_{2m−2}x^{2m−2}+· · ·+c'_0,
$$


where:
c'<sub>0</sub> = a<sub>0</sub>b<sub>0</sub> mod 2
c'<sub>1</sub> = a<sub>0</sub>b<sub>1</sub>+a<sub>1</sub>b<sub>0</sub> mod 2
...
c'<sub>2m−2</sub> = a<sub>m−1</sub>b<sub>m−1</sub> mod 2.



Note that all coefficients ai, bi and ci are elements of GF(2), and that coefficient
arithmetic is performed in GF(2). In general, the product polynomial C(x)
will have a degree higher than m−1 and has to be reduced. The basic idea is an approach
similar to the case of multiplication in prime fields: in GF(p), we multiply
the two integers, divide the result by a prime, and consider only the remainder. Here
is what we are doing in extension fields: The product of the multiplication is divided
by a certain polynomial, and we consider only the remainder after the polynomial
division.We need irreducible polynomials for the module reduction.

Definition 4.3.4 Extension field multiplication
Let A(x),B(x) ∈ GF(2<sup>m</sup>) and let
P(x) ≡
$$
\sum_{i=0}^m p_ix^i \quad
$$

, pi ∈ GF(2)
be an irreducible polynomial. Multiplication of the two elements A(x),B(x) is performed as C(x) ≡ A(x) ·B(x) mod P(x).



Thus, every field GF(2<sup>m</sup>) requires an irreducible polynomial P(x) of degree m with coefficients from GF(2). Note that not all polynomials are irreducible. For example, the polynomial x<sup>4</sup>+x<sup>3</sup>+x+1 is reducible since
x<sup>4</sup>+x<sup>3</sup>+x+1 = (x<sup>2</sup>+x+1)(x<sup>2</sup>+1)

and hence cannot be used to construct the extension field GF(2<sup>4</sup>). Since primitive
polynomials are a special type of irreducible polynomial. For AES, the irreducible polynomial
P(x) = x<sup>8</sup>+x<sup>4</sup>+x<sup>3</sup>+x+1
is used. It is part of the AES specification.

Example 4.6. We want to multiply the two polynomials A(x) = x<sup>3</sup> + x<sup>2</sup> + 1 and
B(x) = x<sup>2</sup>+x in the field GF(24). The irreducible polynomial of this Galois field is
given as
P(x) = x<sup>4</sup>+x+1.
The plain polynomial product is computed as:
C(x) = A(x) ·B(x) = x<sup>5</sup>+x<sup>3</sup>+x<sup>2</sup>+x.
We can now reduce C(x) using the polynomial division method we learned in
school. However, sometimes it is easier to reduce each of the leading terms x<sup>4</sup> and

x<sup>5</sup> individually:
x<sup>4</sup> = 1 ·P(x)+(x+1)
x<sup>4</sup> ≡ x+1 mod P(x)
x<sup>5</sup> ≡ x<sup>2</sup>+x mod P(x).
Now, we only have to insert the reduced expression for x<sup>5</sup> into the intermediate
result C(x):
C(x) ≡ x<sup>5</sup>+x<sup>3</sup>+x<sup>2</sup>+x mod P(x)
C(x) ≡ (x<sup>2</sup>+x)+(x<sup>3</sup>+x<sup>2</sup>+x) = x<sup>3</sup>
A(x) ·B(x) ≡ x<sup>3</sup>.

It is important not to confuse multiplication in GF(2<sup>m</sup>) with integer multiplication,
especially if we are concerned with software implementations of Galois fields.
Recall that the polynomials, i.e., the field elements, are normally stored as bit vectors
in the computers. If we look at the multiplication from the previous example,
the following very atypical operation is being performed on the bit level:
A 				  · 		B 			= C
(x<sup>3</sup>+x<sup>2</sup>+1) 	· 		(x<sup>2</sup>+x) 	= x<sup>3</sup>
(1 1 0 1) 	  · 		(0 1 1 0) = (1 0 0 0).
This computation is not identical to integer arithmetic. If the polynomials are interpreted
as integers, i.e., (1101)<sub>2</sub> = 13<sub>10</sub> and (0110)<sub>2</sub> = 6<sub>10</sub>, the result would have
been (1001110)<sub>2</sub> = 78<sub>10</sub>, which is clearly not the same as the Galois field multiplication
product. Hence, even though we can represent field elements as integers data
types, we cannot make use of the integer arithmetic provided

#### Inversion in GF(2<sup>m</sup>)

Inversion in GF(2<sup>8</sup>) is the core operation of the Byte Substitution transformation,
which contains the AES S-Boxes. For a given finite field GF(2<sup>m</sup>) and the corresponding
irreducible reduction polynomial P(x), the inverse A<sup>−1</sup> of a nonzero element
A ∈ GF(2<sup>m</sup>) is defined as:
A<sup>−1</sup>(x) ·A(x) =1 mod P(x).
For small fields — in practice this often means fields with 2<sup>16</sup> or fewer elements
— lookup tables which contain the precomputed inverses of all field elements are
often used.

P(x) = x<sup>8</sup> +x<sup>4</sup> +x<sup>3</sup> +x+1

(x<sup>7</sup>+x<sup>6</sup>+x) · (x<sup>5</sup>+x<sup>3</sup>+x<sup>2</sup>+x+1) ≡1 mod P(x).

## public-key cryptography==asymmetric cryptography

### Intro

Modern symmetric algorithms such as AES or 3DES are very secure, fast and
are in widespread use. However, there are several shortcomings associated with
symmetric-key schemes, as discussed below:

+ Key Distribution Problem 

  The key must be established between Alice and Bob
  using a secure channel. Remember that the communication link for the message is
  not secure, so sending the key over the channel directly—which would be the most
  convenient way of transporting it— can’t be done.

+ Number of Keys 

  Even if we solve the key distribution problem, we must potentially
  deal with a very large number of keys. If each pair of users needs a separate
  pair of keys in a network with n users, there are n(n−1)/2 key pairs, and every user has to store n−1 keys securely. Even for mid-size networks,
  say, a corporation with 2000 people, this requires more than 4 million key
  pairs that must be generated and transported via secure channels.

+ nonrepudiation/No Protection Against Cheating by Alice or Bob

  Alice and Bob have the same
  capabilities, since they possess the same key. As a consequence, symmetric cryptography
  cannot be used for applications where we would like to prevent cheating by
  either Alice or Bob as opposed to cheating by an outsider like Oscar. For instance,
  in e-commerce applications it is often important to prove that Alice actually sent a
  certain message, say, an online order for a flat screen TV. If we only use symmetric
  cryptography and Alice changes her mind later, she can always claim that Bob,
  the vendor, has falsely generated the electronic purchase order. Preventing this is
  called nonrepudiation and can be achieved with asymmetric cryptography

In order to overcome these drawbacks, Diffie, Hellman and Merkle had a revolutionary
proposal based on the following idea: It is not necessary that the key possessed
by the person who encrypts the message (that’s Alice in our example) is secret. The
crucial part is that Bob, the receiver, can only decrypt using a secret key. In order
to realize such a system, Bob publishes a public encryption key which is known to
everyone. Bob also has a matching secret key, which is used for decryption. Thus,
Bob’s key k consists of two parts, a public part, kpub, and a private one, kpr.



Definition 6.1.1 One-way function
A function f () is a one-way function if:
1. y = f (x) is computationally easy, and
2. x = f −1(y) is computationally infeasible.

Main Security Mechanisms of Public-Key Algorithms:

+ Key Establishment 

  There are protocols for establishing secret keys over
  an insecure channel. Examples for such protocols include the Diffie–
  Hellman key exchange (DHKE) or RSA key transport protocols.

+ Nonrepudiation 

  Providing nonrepudiation and message integrity can be
  realized with digital signature algorithms, e.g., RSA, DSA or ECDSA.

+ Identification 

  We can identify entities using challenge-and-response protocols
  together with digital signatures, e.g., in applications such as smart
  cards for banking or for mobile phones.

+ Encryption 

  We can encrypt messages using algorithms such as RSA or
  Elgamal.

We note that identification and encryption can also be achieved with symmetric
ciphers, but they typically require much more effort with key management. It looks
as though public-key schemes can provide all functions required by modern security
protocols. Even though this is true, the major drawback in practice is that encryption
of data is very computationally intensive—or more colloquially: extremely slow—
with public-key algorithms. Many block and stream ciphers can encrypt about one
hundred to one thousand times faster than public-key algorithms. Thus, somewhat
ironically, public-key cryptography is rarely used for the actual encryption of data.
On the other hand, symmetric algorithms are poor at providing nonrepudiation and
key establishment functionality. In order to use the best of both worlds, most practical
protocols are hybrid protocols which incorporate both symmetric and public-key
algorithms. Examples include the SSL/TLS potocol that is commonly used for secure
Web connections, or IPsec, the security part of the Internet communication
protocol.



Public-Key Algorithm Families of Practical Relevance

+ Integer-Factorization Schemes 

  Several public-key schemes are based on
  the fact that it is difficult to factor large integers. The most prominent representative
  of this algorithm family is RSA.

+ Discrete Logarithm Schemes 

  There are several algorithms which are
  based on what is known as the discrete logarithm problem in finite fields.
  The most prominent examples include the Diffie–Hellman key exchange,
  Elgamal encryption or the Digital Signature Algorithm (DSA).

+ Elliptic Curve (EC) Schemes 

  A generalization of the discrete logarithm
  algorithm are elliptic curve public-key schemes. The most popular examples
  include Elliptic Curve Diffie–Hellman key exchange (ECDH) and the
  Elliptic Curve Digital Signature Algorithm (ECDSA).



important mathematics theorem for asymmetric algorithms, especially for understanding the RSA crypto scheme:

the Euclidean algorithm, Euler’s phi function as well as Fermat’s Little Theorem and Euler’s theorem. 

### Euclidean algorithm

refer to <<algebra_0_modular_arithmetic.md>>

### Euler’s Phi Function

We now look at another tool that is useful for public-key cryptosystems, especially for RSA. We consider the ring Zm, i.e., the set of integers {0,1, . . . ,m−1}. We are interested in the (at the moment seemingly odd) problem of knowing how many numbers in this set are relatively prime to m. This quantity is given by Euler’s phi function, which is defined as follows:

Definition 6.3.1 Euler’s Phi Function
The number of integers in Zm relatively prime to m is denoted by Φ(m).

Example 6.8. Let m = 6. The associated set is Z6 = {0,1,2,3,4,5}.
gcd(0,6) = 6
gcd(1,6) = 1 *
gcd(2,6) = 2
gcd(3,6) = 3
gcd(4,6) = 2
gcd(5,6) = 1 *
Since there are two numbers in the set which are relatively prime to 6, namely 1 and
5, the phi function takes the value 2, i.e., Φ(6) = 2.

Here is another example:
Example 6.9. Let m = 5. The associated set is Z5 = {0,1,2,3,4}.
gcd(0,5) = 5
gcd(1,5) = 1 *
gcd(2,5) = 1 *
gcd(3,5) = 1 *
gcd(4,5) = 1 *
This time we have four numbers which are relatively prime to 5, hence, Φ(5) = 4.

From the examples above we can guess that calculating Euler’s phi function by
running through all elements and computing the gcd is extremely slow if the numbers
are large. In fact, computing Euler’s phi function in this na¨ıve way is completely
out of reach for the large numbers occurring in public-key cryptography.
Fortunately, there exists a relation to calculate it much more easily if we know the
factorization of m, which is given in following theorem



Theorem 6.3.1 Let m have the following canonical factorization

m = p<sub>1</sub><sup>e1</sup>·  p<sub>2</sub><sup>e2</sup>· . . . ·  p<sub>n</sub><sup>en</sup> ,
where the pi are distinct prime numbers and ei are positive integers, then

$$
 Φ(m) =\prod_{i=1}^n {(p_i^{e_i}-p_i^{e_i-1})} 
$$

Since the value of n, i.e., the number of distinct prime factors, is always quite small
even for large numbers m, evaluating the product symbol Π is computationally easy.
Let’s look at an example where we calculate Euler’s phi function using the relation:

Example 6.10. Let m = 240. The factorization of 240 in the canonical factorization form is
m = 240 = 16 · 15 = 2<sup>4</sup> · 3 · 5 = p<sub>1</sub><sup>e1</sup>· p<sub>2</sub><sup>e2</sup>· p<sub>3</sub><sup>e3</sup>
There are three distinct prime factors, i.e., n = 3. The value for Euler’s phi functions follows then as:
Φ(m) = (2<sup>4</sup>−2<sup>3</sup>)(3<sup>1</sup>−3<sup>0</sup>)(5<sup>1</sup>−5<sup>0</sup>) = 8 · 2 · 4 = 64.
That means that 64 integers in the range {0,1, . . . ,239} are coprime to m = 240.
The alternative method, which would have required to evaluate the gcd 240 times,
would have been much slower even for this small number.



It is important to stress that we need to know the factorization of m in order to
calculate Euler’s phi function quickly in this manner. As we will see in the next
chapter, this property is at the heart of the RSA public-key scheme: Conversely, if
we know the factorization of a certain number, we can compute Euler’s phi function
and decrypt the ciphertext. If we do not know the factorization, we cannot compute
the phi function and, hence, cannot decrypt.

### Fermat’s Little Theorem and Euler’s Theorem

Fermat’s Little Theorem is helpful for primality testing and in many other aspects of public-key cryptography. The theorem gives a seemingly surprising result if we do exponentiations modulo an integer.

##### Theorem 6.3.2 Fermat’s Little Theorem
Let a be an integer and p be a prime, then:
a<sup>p</sup> ≡ a (mod p).

We note that arithmetic in finite fields GF(p) is done modulo p, and hence, the theorem holds for all integers a which are elements of a finite field GF(p). The theorem can be stated in the form:
a<sup>p-1</sup> ≡ 1 (mod p)

which is often useful in cryptography. One application is the computation of the inverse in a finite field. We can rewrite the equation as a · a<sup>p−2</sup> ≡ 1 (mod p). This is exactly the definition of the multiplicative inverse. Thus, we immediately have a
way for inverting an integer a modulo a prime:
a<sup>−1</sup> ≡ a<sup>p−2</sup> (mod p)

We note that this inversion method holds only if p is a prime. Let’s look at an example:
Example 6.11. Let p = 7 and a = 2. We can compute the inverse of a as:
a<sup>p−2</sup> = 2<sup>5</sup> = 32 ≡4 mod7.
This is easy to verify: 2 · 4 ≡ 1 mod 7.

**Fermat’s Little Theorem vs EEA - extended Euclidean algorithm:**

r0=p, ,r1=a ,gcd(r0,r1)=1

sr0+tr1=1

=> sp+ta = 1 => 两边mod p，s0+ta ≡ 1 (mod p) => ta ≡ 1 (mod p) 根据EEA的算法得出的t肯定是a<sup>p−2</sup>

Performing the exponentiation is usually slower than using the **extended Euclidean algorithm**. However, there are situations where it is advantageous to use Fermat’s Little Theorem, e.g., on smart cards or other devices which have a hardware accelerator for fast exponentiation anyway. This is not uncommon because many public-key algorithms require exponentiation, as we will see in subsequent chapters.
A generalization of Fermat’s Little Theorem to any integer moduli, i.e., moduli that are not necessarily primes, is Euler’s theorem.

##### Theorem 6.3.3 Euler’s Theorem
Let a and m be integers with gcd(a,m) = 1, then:
a<sup>Φ(m)</sup> ≡ 1 (mod m).

Since it works modulo m, it is applicable to integer rings Zm. We show now an example for Euler’s theorem with small values.
Example 6.12. Let m = 12 and a = 5. First, we compute Euler’s phi function of m:

Φ(12) =Φ(2<sup>2</sup> · 3) = (2<sup>2</sup>−2<sup>1</sup>)(3<sup>1</sup>−3<sup>0</sup>) = (4−2)(3−1) = 4.
Now we can verify Euler’s theorem:
5<sup>Φ(12)</sup> = 5<sup>4</sup> = 25<sup>2</sup> = 625 ≡ 1 mod 12.

It is easy to show that Fermat’s Little Theorem is a special case of Euler’s theorem:
If p is a prime, it holds that Φ(p) = (p<sup>1</sup> − p<sup>0</sup>) = p−1. If we use this value for Euler’s theorem, we obtain: 

a<sup>Φ(p)</sup> = a<sup>p−1</sup> ≡ 1 (mod p), which is exactly Fermat’s Little Theorem.

**Euler’s Theorem vs EEA - extended Euclidean algorithm:**

r0=m, ,r1=a ,gcd(r0,r1)=1

sr0+tr1=1

=> sm+ta = 1 => 两边mod m，s0+ta ≡ 1 (mod m) => ta ≡ 1 (mod m) 根据EEA的算法得出的t肯定是a<sup>Φ(m)-1</sup> 

