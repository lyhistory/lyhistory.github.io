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

### RSA

refer to draw.io <<cryptography-encryption>> https://app.diagrams.net/#G1l7hGpTWy3dLPROAwXYOAuClDMiugzqNL

Mathematical Attacks
The best mathematical cryptanalytical method we know is factoring the modulus. An attacker, Oscar, knows the modulus n, the public key e and the ciphertext y. His goal is to compute the private key d which has the property that e · d ≡ modΦ(n).
**It seems that he could simply apply the extended Euclidean algorithm and compute d. However, he does not know the value of Φ(n). At this point factoring comes in: the best way to obtain this value is to decompose n into its primes p and q.** If Oscar can do this, the attack succeeds in three steps:
Φ(n) = (p−1)(q−1)
d<sup>−1</sup> ≡ e mod Φ(n)
x ≡ y<sup>d</sup> mod n.
In order to prevent this attack, the modulus must be sufficiently large. This is the sole reason why moduli of 1024 or more bit are needed for a RSA.

### Public-Key Cryptosystems Based on the Discrete Logarithm Problem

In the previous chapter we learned about the RSA public-key scheme. As we have seen, RSA is based on the hardness of factoring large integers. The integer factorization problem is said to be the one-way function of RSA. As we saw earlier, roughly speaking a function is one-way if it is computationally easy to compute the function f (x) = y, but computationally infeasible to invert the function: f <sup>−1</sup>(y) = x. The question is whether we can find other one-way functions for building asymmetric crypto schemes. It turns out that most non-RSA public-key algorithms with practical relevance are based on another one-way function, the discrete logarithm problem.

The discrete logarithm problem is defined in what are called **cyclic groups**.

#### Diffie–Hellman Key Exchange

This fundamental key agreement technique is implemented in many open and commercial cryptographic protocols like
Secure Shell (SSH), Transport Layer Security (TLS), and Internet Protocol Security (IPSec).The basic idea behind the DHKE is that exponentiation in Z<sup>∗</sup><sub>p</sub>, p prime, is aone-way function and that exponentiation is commutative, i.e.,
k = (α<sup>x</sup>)<sup>y</sup> ≡ (α<sup>y</sup>)<sup>x</sup> mod p
The value k ≡ (α<sup>x</sup>)<sup>y</sup> ≡ (α<sup>y</sup>)<sup>x</sup> mod p is the joint secret which can be used as the session key between the two parties.

classic Diffie–Hellman key exchange protocol is in the group Z<sup>∗</sup><sub>p</sub>, where p is a prime. The protocol can be generalized, in particular to groups of elliptic curves. This gives rise to elliptic curve cryptography, which has become a very popular asymmetric scheme in practice. In order to better understand elliptic curves and schemes such as Elgamal encryption, which are also closely related
to the DHKE, we introduce the discrete logarithm problem in the following sections.

#### The Discrete Logarithm Problem in Prime Fields

Definition 8.3.1 Discrete Logarithm Problem (DLP) in Z<sub>p</sub><sup>*</sup>

Given is the finite cyclic group  Z<sub>p</sub><sup>*</sup> of order p−1 and a primitive element 

α ∈  Z<sub>p</sub><sup>*</sup> 

and another element β ∈  Z<sub>p</sub><sup>*</sup>. 

The DLP is the problem of determining the integer 1 ≤ x ≤ p−1 such that: α<sup>x</sup> ≡β mod p

such an integer x must exist since α is a primitive element and each group element can be expressed as a power of any primitive
element. This integer x is called the discrete logarithm of β to the base α, and we can formally write:
x = log<sub>α</sub><sup>β</sup> mod p.
Computing discrete logarithms modulo a prime is a very hard problem if the parameters are sufficiently large. Since exponentiation α<sup>x</sup> ≡β mod p is computationally easy, this forms a one-way function.



Example 8.11. We consider a discrete logarithm in the group Z<sub>47</sub><sup>*</sup>, in which α = 5 is a primitive element. For β = 41 the discrete logarithm problem is: Find the positive integer x such that 5<sup>x</sup> ≡ 41 mod 47
Even for such small numbers, determining x is not entirely straightforward. By using a brute-force attack, i.e., systematically trying all possible values for x, we obtain the solution x = 15.

In practice, it is often desirable to have a DLP in groups with prime cardinality in order to prevent the Pohlig–Hellman attack Since groups  Z<sub>p</sub><sup>*</sup> have cardinality p−1, which is obviously not prime, 

one often uses DLPs in subgroups of  Z<sub>p</sub><sup>*</sup> with prime order, 

rather than using the group  Z<sub>p</sub><sup>*</sup> itself. We illustrate this with an example.

Example 8.12. We consider the group Z<sub>47</sub><sup>*</sup>  which has order 46. The subgroups in

Z<sub>47</sub><sup>*</sup> have thus a cardinality of 23, 2 and 1. α = 2 is an element in the subgroup with 23 elements, and since 23 is a prime, α is a primitive element in the subgroup. A possible discrete logarithm problem is given for β = 36 (which is also in the subgroup): Find the positive integer x, 1 ≤ x ≤ 23, such that 2<sup>x</sup> ≡ 36 mod 47 By using a brute-force attack, we obtain a solution for x = 17.

#### The Generalized Discrete Logarithm Problem

The feature that makes the DLP particularly useful in cryptography is that it is not restricted to the multiplicative group Z<sub>p</sub><sup>*</sup>, p prime, but can be defined over any cyclic groups. This is called the generalized discrete logarithm problem (GDLP) and can be stated as follows.

Definition 8.3.2 Generalized Discrete Logarithm Problem 

Given is a finite cyclic group G with the group operation ◦ and cardinality n. We consider a primitive element α ∈ G and another
element β ∈ G. The discrete logarithm problem is finding the integer x, where 1 ≤ x ≤ n, such that:
β =α◦α ◦. . . ◦α (x times)=α<sup>x</sup>

As in the case of the DLP in Z<sub>p</sub><sup>*</sup>, such an integer x must exist since α is a primitive element, and thus each element of the group G can be generated by repeated application of the group operation on α.
It is important to realize that there are cyclic groups in which the DLP is not difficult. Such groups cannot be used for a public-key cryptosystem since the DLP is not a one-way function. Consider the following example.
Example 8.13. This time we consider the additive group of integers modulo a prime. For instance, if we choose the prime p = 11, G = (Z11,+) is a finite cyclic group with the primitive element α = 2. Here is how α generates the group:

| i    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   | 11   |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| iα   | 2    | 4    | 6    | 8    | 10   | 1    | 3    | 5    | 7    | 9    | 0    |

We try now to solve the DLP for the element β = 3, i.e., we have to compute the integer 1 ≤ x ≤ 11 such that

x · 2 = 2+2+. . .+2 x times ≡ 3 mod 11

Here is how an “attack” against this DLP works. Even though the group operation is addition, we can express the relationship between α, β and the discrete logarithm x in terms of multiplication:
x · 2 ≡ 3 mod 11.
In order to solve for x, we simply have to invert the primitive element α:
x ≡ 2<sup>−1</sup> · 3 mod 11

Using, e.g., the extended Euclidean algorithm, we can compute 2<sup>−1</sup> ≡ 6 mod 11 from which the discrete logarithm follows as:
x ≡ 2<sup>−1</sup> · 3 ≡ 7 mod 11

The discrete logarithm can be verified by looking at the small table provided above.
We can generalize the above trick to any group (Zn,+) for arbitrary n and elements α,β ∈ Zn. Hence, we conclude that the generalized DLP is computationally easy over Zn. The reason why the DLP can be solved here easily is that we have mathematical operations which are not in the additive group, namely multiplication and inversion

After this counterexample we now list discrete logarithm problems that have been proposed for use in cryptography:
1. The multiplicative group of the prime field Zp or a subgroup of it. For instance, the classical DHKE uses this group, but also Elgamal encryption or the Digital Signature Algorithm (DSA). These are the oldest and most widely used types of discrete logarithm systems.
2. The cyclic group formed by an elliptic curve. They have become popular in practice over the last decade.
3. The multiplicative group of a Galois field GF(2<sup>m</sup>) or a subgroup of it. These groups can be used completely analogous to multiplicative groups of prime fields, and schemes such as the DHKE can be realized with them. They are not as popular
in practice because the attacks against them are somewhat more powerful than those against the DLP in Zp. Hence DLPs over GF(2<sup>m</sup>) require somewhat higher bit lengths for providing the same level of security than those over Zp.
4. Hyperelliptic curves or algebraic varieties, which can be viewed as generalization as elliptic curves. They are currently rarely used in practice, but in particular hyperelliptic curves have some advantages such as short operand lengths

#### Security of the Diffie–Hellman Key Exchange

Let’s now consider the possibilities of a passive adversary, i.e., Oscar can only listen but not alter messages. His goal is to compute the session key kAB shared by Alice and Bob. Which information does Oscar get from observing the protocol?
Certainly, Oscar knows α and p because these are public parameters chosen during the set-up protocol. In addition, Oscar can obtain the values A = kpub,A and B=kpub,B by eavesdropping on the channel during an execution of the key-exchange protocol. Thus, the question is whether he is capable of computing k = α<sup>ab</sup> from α, p,A ≡α<sup>a</sup> mod p and B ≡α<sup>b</sup> mod p. This problem is called the Diffie–Hellman problem (DHP). Like the discrete logarithm problem it can be generalized to arbitrary finite cyclic groups. Here is a more formal statement of the DHP:

Definition 8.4.1 Generalized Diffie–Hellman Problem (DHP)
Given is a finite cyclic group G of order n, a primitive element α ∈ G and two elements A = α<sup>a</sup> and B = α<sup>b</sup> in G. The Diffie–Hellman problem is to find the group element α<sup>ab</sup>.

#### The Elgamal Encryption Scheme

The protocol consists of two phases, the classical DHKE which is followed by the message encryption and decryption.
Bob computes his private key d and public key β . This key pair does not change, i.e., it can be used for encrypting many messages. Alice, however, has to generate a new public–private key pair for the encryption of every message. Her private key
is denoted by i and her public key by kE. The latter is an ephemeral (existing only temporarily) key, hence the index “E”. The joint key is denoted by kM because it is used for masking the plaintext. For the actual encryption, Alice simply multiplies the plaintext message x by the masking key kM in Z<sub>p</sub><sup>*</sup>. On the receiving side, Bob reverses the encryption by multipliying with the inverse mask. Note that one property of cyclic groups is that,

given any key kM ∈ Z<sub>p</sub><sup>*</sup>, every messages x maps to another ciphertext if the two values are multiplied. 

Moreover, if the key kM is randomly drawn from Z<sub>p</sub><sup>*</sup>, every ciphertext y ∈ {1,2, . . . , p−1} is equally likely.

##### Computational Aspects

+ Key Generation 

+ During the key generation by the receiver (Bob in our example), a prime p must be generated, and the public and private have to be computed. Since the security of Elgamal also depends on the discrete logarithm problem, p should have a
  length of at least 1024 bits. To generate such a prime, the prime-finding algorithms can be used. The private key should be generated by a true random number generater. The public key requires one exponentiation for which the square-and-multiply algorithm is used.

+ Encryption

  Within the encryption procedure, two modular exponentiations and one modular multiplication are required for computing the ephemeral and the masking key, as well as for the message encryption. All operands involved have a bit length of log<sub>2</sub><sup>p</sup>. For efficient exponentiation, one should apply the square-and-multiply algorithm, It is important to note that the two exponentiations, which constitute almost all computations necessary, are independent of the plaintext. Hence, in some applications they can be precomputed at times of low computational load, stored and used when the actual encryption is needed. This can be a major advantage in practice.

+ Decryption The main steps of the decryption are first an exponentiation k<sub>M</sub> = k<sup>d</sup> mod p, using the square-and-multiply algorithm, followed by an inversion of k<sub>M</sub>,that is performed with the extended Euclidean algorithm. However, there is a shortcut based on Fermat’s Little Theorem that combines these two steps in a single one. from Fermat’s Little Theorem :

  k<sub>E</sub><sup>p-1</sup>≡1 mod p

  for all kE ∈ Z<sub>p</sub><sup>*</sup>. We can now merge Step 1 and 2 of the decryption as follows:

  k<sub>M</sub><sup>-1</sup>≡ (k<sub>E</sub><sup>d</sup>)<sup>−1</sup> mod p
  ≡ (k<sub>E</sub><sup>d</sup>)<sup>−1</sup>k<sub>E</sub><sup>p−1</sup> mod p
  ≡ k<sub>E</sub><sup>p−d−1</sup> mod p

  The equivalence relation allows us to compute the inverse of the masking key using a single exponentiation with the exponent (p−d −1). After that, one modular multiplication is required to recover x ≡ y · k<sub>M</sub><sup>-1</sup> mod p. As a consequence, decryption essentially requires one execution of the square-and-multiply algorithm followed by a single modular multiplication for recovering the plaintext.



### Elliptic Curve Cryptosystems

ECC is based on the generalized discrete logarithm problem, and thus DL-protocols such as the Diffie–Hellman key exchange can also be realized using elliptic curves.

We start by giving a short introduction to the mathematical concept of elliptic curves, independent of their cryptographic applications. ECC is based on the generalized discrete logarithm problem. Hence, what we try to do first is to find a cyclic group on which we can build our cryptosystem. Of course, the mere existence of a cyclic group is not sufficient. The DL problem in this group must also be computationally hard, which means that it must have good one-way properties.
We start by considering certain polynomials (e.g., functions with sums of exponents of x and y), and we plot them over the real numbers.
Example 9.1. Let’s look at the polynomial equation x<sup>2</sup>+y<sup>2</sup> = r<sup>2</sup> over the real numbers R. If we plot all the pairs (x,y) which fulfill this equation in a coordinate system, we obtain a circle.
Example 9.2. A slight generalization of the circle equation is to introduce coefficients to the two terms x<sup>2</sup> and y<sup>2</sup>, i.e., we look at the set of solutions to the equation a · x<sup>2</sup> +b · y<sup>2</sup> = c over the real numbers. It turns out that we obtain an ellipse.

#### Definition of Elliptic Curves

From the two examples above, we conclude that we can form certain types of curves from polynomial equations. By “curves”, we mean the set of points (x,y) which are solutions of the equations. For example, the point (x = r,y = 0) fulfills the equation of a circle and is, thus, in the set. The point (x = r/2,y = r/2) is not a solution to the polynomial x<sup>2</sup>+y<sup>2</sup> = r<sup>2</sup> and is, thus, not a set member. An elliptic curve is a special type of polynomial equation. For cryptographic use, we need to consider the curve not over the real numbers but over a finite field. The most popular choice is prime fields GF(p) , where all arithmetic is performed modulo a prime p.

Definition 9.1.1 Elliptic Curve
The elliptic curve over Zp, p > 3, is the set of all pairs (x,y) ∈ Zp which fulfill y<sup>2</sup> ≡ x<sup>3</sup>+a · x+b mod p 
together with an imaginary point of infinity O, where a,b ∈ Zp
and the condition 4 · a<sup>3</sup>+27 · b<sup>2</sup> <> 0 mod p.

The definition of elliptic curve requires that the curve is nonsingular. Geometrically speaking, this means that the plot has no self-intersections or vertices, which is achieved if the discriminant of the curve −16(4a<sup>3</sup>+27b<sup>2</sup>) is nonzero.

For cryptographic use we are interested in studying the curve over a prime field as in the definition. However, if we plot such an elliptic curve over Zp, we do not get anything remotely resembling a curve. However, nothing prevents us from taking an elliptic curve equation and plotting it over the set of real numbers.

Example: y2 = x3 −3x+3 over R

https://www.desmos.com/calculator/ialhd71we3

We notice several things from this elliptic curve plot.First, the elliptic curve
is symmetric with respect to the x-axis. This follows directly from the fact that for
all values xi which are on the elliptic curve, both yi =根号下的(x<sub>i</sub><sup>3</sup> +a · x<sub>i</sub>+b) and yi =负根号下的(x<sub>i</sub><sup>3</sup> +a · x<sub>i</sub>+b) are solutions.

Second, there is one intersection with the x-axis. This follows from the fact that it is a cubic equation if we solve for y = 0 which has one real solution (the intersection with the x-axis) and two complex solutions (which do not show up in the plot). There are also elliptic curves with three intersections with the x-axis(e.g, b=3,a=-5).

We now return to our original goal of finding a curve with a large cyclic group, which is needed for constructing a discrete logarithm problem. The first task for finding a group is done, namely identifying a set of elements. In the elliptic curve case, the group elements are the points that fulfill y<sup>2</sup> ≡ x<sup>3</sup>+a · x+b mod p . The next question at hand is: How do we define a group operation with those points? Of course, we have to make sure that the group laws hold for the operation. 简言之，如何定义满足 y<sup>2</sup> ≡ x<sup>3</sup>+a · x+b mod p 的points的composition law，从而让其构成group

#### Group Operations on Elliptic Curves

Let’s denote the group operation with the addition symbol “+”. “Addition” means that given two points and their coordinates, say P = (x1,y1) and Q = (x2,y2), we have to compute the coordinates of a third point R such that:
P+Q = R
(x1,y1)+(x2,y2) = (x3,y3)

As we will see below, it turns out that this addition operation looks quite arbitrary. Luckily, there is a nice geometric interpretation of the addition operation if we consider a curve defined over the real numbers. For this geometric interpretation, we have to distinguish two cases: the addition of two distinct points (named point addition) and the addition of one point to itself (named point doubling).

+ Point Addition P+Q 

  This is the case where we compute R = P+Q and P <> Q. The construction works as follows: Draw a line through P and Q and obtain a third point of intersection between the elliptic curve and the line. Mirror this third intersection point along the x-axis. This mirrored point is, by definition, the point R. 

+ Point Doubling 

  P+P This is the case where we compute P+Q but P=Q. Hence, we can write R = P+P = 2P. We need a slightly different construction here. We draw the tangent line through P and obtain a second point of intersection between this line and the elliptic curve. We mirror the point of the second intersection along the x-axis. This mirrored point is the result R of the doubling.

You might wonder why the group operations have such an arbitrary looking form. Historically, this tangent-and-chord method was used to construct a third point if two points were already known, while only using the four standard algebraic operations
add, subtract, multiply and divide. It turns out that if points on the elliptic curve are added in this very way, the set of points also fulfill most conditions necessary for a group, that is, closure, associativity, existence of an identity element and existence of an inverse. 简言之，这种看起来“随意”的构造方式可以让这种composition law满足group定义

Of course, in a cryptosystem we cannot perform geometric constructions. However, by applying simple coordinate geometry, we can express both of the geometric constructions from above through analytic expressions, i.e., formulae. As stated above, these formulae only involve the four basic algebraic operations. These operations can be performed in any field, not only over the field of the real numbers. In particular, we can take the curve equation from above, but we now consider it over prime fields GF(p) rather than over the real numbers. This yields the following analytical expressions for the group operation.

Elliptic Curve Point Addition and Point Doubling
x<sub>3</sub> = s<sup>2</sup>−x<sub>1</sub>−x<sub>2</sub> mod p
y<sub>3</sub> = s(x<sub>1</sub>−x<sub>3</sub>)−y<sub>1</sub> mod p
where

if P <> Q (point addition):	s =(y<sub>2</sub>−y<sub>1</sub>)/(x<sub>2</sub>−x<sub>1</sub>) mod p ; 两点求斜率很简单

if P = Q (point doubling):	 s=(3x<sub>1</sub><sup>2</sup>+a)/2y<sub>1</sub> mod p ; 	y<sup>2</sup> ≡ x<sup>3</sup>+a · x+b两边对x求导，2yy'=3x<sup>2</sup>+a

推导：

y = sx+c. s = (-y<sub>3</sub>-y<sub>1</sub>)/(x<sub>3</sub>-x<sub>1</sub>)	Note:这里是-y<sub>3</sub>，因为根据前面知道我们是取两点连线和椭圆曲线的交点的对称点

代入

y<sup>2</sup> ≡ x<sup>3</sup>+a · x+b mod p 

=》 (sx+c)<sup>2</sup>≡ x<sup>3</sup>+a · x+b mod p 

=》s<sup>2</sup>x<sup>2</sup> + 2scx+ c<sup>2</sup> = x<sup>3</sup>+a · x+b

=》 x<sup>3</sup>- s<sup>2</sup>x<sup>2</sup>  +(a-2sc) · x+b-c<sup>2</sup> = 0

根据韦达定理(https://zh.wikipedia.org/wiki/%E9%9F%A6%E8%BE%BE%E5%AE%9A%E7%90%86)

x<sub>1</sub>+x<sub>2</sub>+x<sub>3</sub>=s<sup>2</sup>

=> x<sub>3</sub> = s<sup>2</sup>−x<sub>1</sub>−x<sub>2</sub> mod p

 s = (-y<sub>3</sub>-y<sub>1</sub>)/(x<sub>3</sub>-x<sub>1</sub>) 

=> y<sub>3</sub>+y<sub>1</sub> =  s(x<sub>1</sub>-x<sub>3</sub>) 

=> y<sub>3</sub>=  s(x<sub>1</sub>-x<sub>3</sub>)- y<sub>1</sub>

Note that the parameter s is the slope of the line through P and Q in the case of point addition, or the slope of the tangent through P in the case of point doubling.

Even though we made major headway towards the establishment of a finite group, we are not there yet. One thing that is still missing is an identity (or neutral) element O such that: P+O = P

for all points P on the elliptic curve. It turns out that there isn’t any point (x,y) that fulfills the condition. Instead we define an abstract point at infinity as the neutral element O. This point at infinity can be visualized as a point that is located towards
“plus” infinity along the y-axis or towards “minus” infinity along the y-axis.

According the group definition, we can now also define the inverse −P of any group element P as:

P+(−P) = O.

The question is how do we find −P? If we apply the tangent-and-chord method from above, it turns out that the inverse of the point P = (x<sub>p</sub>,y<sub>p</sub>) is the point −P = (x<sub>p</sub>,−y<sub>p</sub>), i.e., the point that is reflected along the x-axis.

Note that finding the inverse of a point P = (x<sub>p</sub>,y<sub>p</sub>) is now trivial. We simply take the negative of its y coordinate. In the case of elliptic curves over a prime field GF(p) (the most interesting case in cryptography), this is easily achieved since −y<sub>p</sub> ≡ p−y<sub>p</sub> mod p, hence−P = (x<sub>p</sub>, p−y<sub>p</sub>).

Example. We consider a curve over the small field Z<sub>17</sub>:

E : y<sup>2</sup> ≡ x<sup>3</sup>+2x+2 mod 17.

We want to double the point P = (5,1).
2P= P+P = (5,1)+(5,1) = (x<sub>3</sub>,y<sub>3</sub>)

s =(3x<sub>1</sub><sup>2</sup>+a)/2y<sub>1</sub> = (2 · 1)<sup>−1</sup>(3 · 5<sup>2</sup>+2) = 2<sup>−1</sup> · 9 ≡ 9 · 9 ≡ 13 mod 17

x<sub>3</sub> = s<sup>2</sup>−x<sub>1</sub>−x<sub>2</sub> = 13<sup>2</sup>−5−5 = 159 ≡ 6 mod 17

y<sub>3</sub> = s(x<sub>1</sub>−x<sub>3</sub>)−y<sub>1</sub> = 13(5−6)−1 = −14 ≡ 3 mod 17

​		mod(a, n) = a - n * floor(a / n)

​		−14 mod 17 = -14 - 17*floor(-14/17) =-14 - 17*floor(-0.8) 不同程序结果不同，比如向下取整 -1 ，结果为3，向上取整或向零取整结果为?

2P = (5,1)+(5,1) = (6,3)

For illustrative purposes we check whether the result 2P = (6,3) is actually a point
on the curve by inserting the coordinates into the curve equation:

y<sup>2</sup> ≡ x<sup>3</sup>+2 · x+2 mod 17

3<sup>2</sup> ≡ 6<sup>3</sup>+2 · 6+2 mod 17
9 = 230 ≡ 9 mod 17

#### Building a Discrete Logarithm Problem with Elliptic Curves

Theorem 9.2.1 The points on an elliptic curve together with O have cyclic subgroups. Under certain conditions all points on an
elliptic curve form a cyclic group.

Please note that we have not proved the theorem. This theorem is extremely useful because we have a good understanding of the properties of cyclic groups. In particular, we know that by definition a primitive element must exist such that its powers generate the entire group. Moreover, we know quite well how to build cryptosystems from cyclic groups. Here is an example for the cyclic group of an elliptic curve.

Example. We want to find all points on the curve:
E : y<sup>2</sup> ≡ x<sup>3</sup>+2 · x+2 mod 17.

It happens that all points on the curve form a cyclic group and that the order is #E = 19. For this specific curve the group order is a prime, so every element is primitive.
As in the previous example we start with the primitive element P = (5,1). We compute now all “powers” of P. More precisely, since the group operation is addition, we compute P,2P, . . . , (#E)P. Here is a list of the elements that we obtain:

1P = (5,1)

2P = (5,1)+(5,1) = (6,3) 			11P = (13,10)
3P = 2P+P = (10,6) 					12P = (0,11)
4P = (3,1) 									13P = (16,4)
5P = (9,16) 									14P = (9,1)
6P = (16,13) 								15P = (3,16)
7P = (0,6) 									16P = (10,11)
8P = (13,7) 									17P = (6,14)
9P = (7,6) 										18P = (5,16)
10P = (7,11) 										19P = O

It is also instructive to look at the last computation above, which yielded:

19P = P + 18P  = (5,1)+(5,16) = O

This means that P = (5,1) is the inverse of 18P = (5,16), and vice versa. This is easy to verify. We have to check whether the two x coordinates are identical and that the two y coordinates are each other’s additive inverse modulo 17. The first condition obviously hold and the second one too, since −1 ≡ 16 mod 17.
另一种理解方式：

s =(y<sub>2</sub>−y<sub>1</sub>)/(x<sub>2</sub>−x<sub>1</sub>) mod p = (16-1)/(5-5)= ∞

x<sub>3</sub> = s<sup>2</sup>−x<sub>1</sub>−x<sub>2</sub> = ∞−5−5 = ∞≡ ∞ mod 17

y<sub>3</sub> = s(x<sub>1</sub>−x<sub>3</sub>)−y<sub>1</sub> = ∞(5−∞)−1 ≡ ∞ mod 17

=> 19P = (∞, ∞)

From now on, the cyclic structure becomes visible since:
20P = 19P+P = O +P = P
21P = 2P

To set up DL cryptosystems it is important to know the order of the group. Even though knowing the exact number of points on a curve is an elaborate task, we know the approximate number due to Hasse’s theorem.

Theorem 9.2.2 Hasse’s theorem
Given an elliptic curve E modulo p, the number of points on the curve is denoted by #E and is bounded by:
p+1−2√p ≤ #E ≤ p+1+2√p.

Hasse’s theorem, which is also known as Hasse’s bound, states that the number of points is roughly in the range of the prime p. This has major practical implications.
For instance, if we need an elliptic curve with 2<sup>160</sup> elements, we have to use a prime of length of about 160 bit.
Let’s now turn our attention to the details of setting up the discrete logarithm problem.

Definition 9.2.1 Elliptic Curved Discrete Logarithm Problem (ECDLP)
Given is an elliptic curve E. We consider a primitive element P and another element T. The DL problem is finding the integer d,
where 1 ≤ d ≤ #E, such that:

P+P+· · · +P (d times) = dP = T.  this operation is called point multiplication, since we can formally write T = dP. This terminology can be misleading, however, since we cannot directly multiply the integer d with a curve point P. Instead, dP is merely a convenient notation for the repeated application of the group operation (point addiction).

In cryptosystems, d is the private key which is an integer, while the public key T is a point on the curve with coordinates T = (xT ,yT ). In contrast, in the case of the DL problem in Z<sub>p</sub><sup>*</sup>, both keys were integers.

Example 9.6. We perform a point multiplication on the curve y2 ≡ x3+2x+2 mod
17 that was also used in the previous example. We want to compute

13P = P+P+. . .+P

where P=(5,1). In this case, we can simply use the table that was compiled earlier:

13P = (16,4).

Point multiplication is analog to exponentiation in multiplicative groups. In order to do it efficiently, we can directly adopt the square-and-multiply algorithm. The only difference is that squaring becomes doubling and multiplication becomes addition of P. Here is the algorithm:

Double-and-Add Algorithm for Point Multiplication
Input: elliptic curve E together with an elliptic curve point P 

a scalar d = Σ<sub>i=0</sub><sup>t</sup> d<sub>i</sub>2<sup>i</sup> with d<sub>i</sub> ∈ 0,1 and d<sub>t</sub> = 1
Output: T = dP
Initialization:
T = P
Algorithm:
1 	FOR i = t −1 DOWNTO 0
1.1  	T = T +T mod n
			IF d<sub>i</sub> = 1
1.2 		T = T +P mod n
2 	RETURN (T)

For a random scalar of length of t +1 bit, the algorithm requires on average 1.5t point doubles and additions. Verbally expressed, the algorithm scans the bit representation of the scalar d from left to right. It performs a doubling in every iteration, and only if the current bit has the value 1 does it perform an addition of P. Let’s look at an example.
Example 9.7. We consider the scalar multiplication 26P, which has the following binary representation:
26P = (11010<sub>2</sub>)P = (d<sub>4</sub>d<sub>3</sub>d<sub>2</sub>d<sub>1</sub>d<sub>0</sub>)<sub>2</sub> P.

The algorithm scans the scalar bits starting on the left with d<sub>4</sub> and ending with the rightmost bit d<sub>0</sub>.

Step:
#0 P = 1<sub>2</sub> P inital setting, bit processed: d<sub>4</sub> = 1
#1a P+P = 2P = 10<sub>2</sub> P DOUBLE, bit processed: d<sub>3</sub>
#1b 2P+P = 3P = 10<sub>2</sub> P+1<sub>2</sub> P = 11<sub>2</sub> P ADD, since d<sub>3</sub> = 1
#2a 3P+3P = 6P = 2(11<sub>2</sub> P) = 110<sub>2</sub> P DOUBLE, bit processed: d<sub>2</sub>
#2b no ADD, since d<sub>2</sub> = 0
#3a 6P+6P = 12P = 2(110<sub>2</sub> P) = 1100<sub>2</sub> P DOUBLE, bit processed: d<sub>1</sub>
#3b 12P+P = 13P = 1100<sub>2</sub> P+1<sub>2</sub> P = 1101<sub>2</sub> P ADD, since d1 = 1
#4a 13P+13P = 26P = 2(1101<sub>2</sub> P) = 11010<sub>2</sub> P DOUBLE, bit processed: d0
#4b no ADD, since d0 = 0

It is instructive to observe how the binary representation of the exponent evolves. We see that doubling results in a left shift of the scalar, with a 0 put in the rightmost position. By performing addition with P, a 1 is inserted into the rightmost position of the scalar. Compare how the highlighted exponents change from iteration to iteration.

If we go back to elliptic curves over the real numbers, there is a nice geometric interpretation for the ECDLP: given a starting point P, we compute 2P, 3P, . . ., dP = T, effectively hopping back and forth on the elliptic curve. We then publish the starting point P (a public parameter) and the final point T (the public key). In order to break the cryptosystem, an attacker has to figure out how often we “jumped” on the elliptic curve. The number of hops is the secret d, the private key.

#### Diffie–Hellman Key Exchange with Elliptic Curves

In complete analogy to the conventional Diffie–Hellman key exchange (DHKE) introduced, we can now realize a key exchange using elliptic curves. This is referred to as elliptic curve Diffie–Hellman key exchange, or ECDH. First we have to agree on domain parameters, that is, a suitable elliptic curve over which we can work and a primitive element on this curve.



In practice, often the x-coordinate is hashed and then used as a symmetric key. Typically,not all bits are needed. For instance, in a 160-bit ECC scheme, hashing the x-coordinate with SHA-1 results in a 160-bit output of which only 128 would be used as an AES key.

Please note that elliptic curves are not restricted to the DHKE. In fact, almost all other discrete logarithm protocols, in particular digital signatures and encryption, e.g., variants of Elgamal, can also be realized and The widely used elliptic curve digital signature algorithms (ECDSA)

#### Security

Note that in practice finding a suitable elliptic curve is a relatively difficult task. The curves have to show certain properties in order to be secure.



The reason we use elliptic curves is that the ECDLP has very good one-way characteristics. If an attacker Oscar wants to break the ECDH, he has the following information: E, p, P, A, and B. He wants to compute the joint secret between Alice and Bob T<sub>AB</sub> = a · b · P. This is called the elliptic curve Diffie–Hellman problem (ECDHP). There appears to be only one way to compute the ECDHP, namely to solve either of the discrete logarithm problems: a = log<sub>P</sub>A or b = log<sub>P</sub>B



If the elliptic curve is chosen with care, the best known attacks against the ECDLP are considerably weaker than the best algorithms for solving the DL problem modulo p, and the best factoring algorithms which are used for RSA attacks. In particular, the index-calculus algorithms, which are powerful attacks against the DLP modulo p, are not applicable against elliptic curves. For carefully selected elliptic curves, the only remaining attacks are generic DL algorithms, that is Shanks’ baby-step giant-step method and Pollard’s rho method. Since the number of steps required for such an attack is roughly equal to the square root of the group cardinality, a group order of at least 2160 should be used. According to Hasse’s theorem, this requires that the prime p used for the elliptic curve must be roughly 160-bit long. If we attack such a group with generic algorithms, we need around √2160 = 280 steps. A security level of 80 bit provides medium-term security. In practice, elliptic curve bit lengths up to 256 bit are commonly used, which provide security levels of up to 128 bit. It should be stressed that this security is only achieved if cryptographically strong elliptic curves are used. There are several families of curves that possess cryptographic weaknesses, e.g., supersingular curves. They are relatively easy to spot, however. In practice, often standardized curves such as ones proposed by the National Institute of Standards and Technology (NIST) are being used.



Before using ECC, a curve with good cryptographic properties needs to be identified. In practice, a core requirement is that the cyclic group (or subgroup) formed by the curve points has prime order(猜测原因应该是，根据之前group的基础知识知道，prime order的group isomorphic to Cyclic group，即group中任意非identity的元素都可以生成整个group，如果选择的不是prime order则没有这个性质，非identity元素可能生成的是sub group，这样就有安全问题了，比如某个元素只能生成order=2的subgroup就很危险了，换句话说，在ECC中，相当于某个点无论选择什么私钥d都只能生成两个元素/公钥，换句话说，知道了公钥，任意选择一个私钥都有很大概率50%？猜中). Moreover, certain mathematical properties that lead to cryptographic weaknesses must be ruled out. Since assuring all these properties is a nontrivial and computationally demanding task, often standardized curves are used in practice.



When implementing elliptic curves it is useful to view an ECC scheme as a structure with four layers. On the **bottom layer modular arithmetic**, i.e., arithmetic in the prime field GF(p), is performed. We need all four field operations: addition, subtraction, multiplication and inversion. On the next layer, the two group operations, point doubling and point addition, are realized. They make use of the arithmetic provided in the bottom layer. On the third layer, scalar multiplication is realized, which uses the group operations of the previous layer. The top layer implements the actual protocol, e.g., ECDH or ECDSA. **It is important to note that two entirely different finite algebraic structures are involved in an elliptic curve cryptosystem. There is a finite field GF(p) over which the curve is defined, and there is the cyclic group which is formed by the points on the curve.**

In software, a highly optimized 256-bit ECC implementation on a 3-GHz, 64-bit CPU can take approximately 2 ms for one point multiplication. Slower throughputs due to smaller microprocessors or less optimized algorithms are common with performances in the range of 10 ms. For high-performance applications, e.g., for Internet servers that have to perform a large number of elliptic curve signatures per second, hardware implementations are desirable. The fastest implementations can compute a point multiplication in the range of 40 μs, while speeds of several 100 μs are more common.

On the other side of the performance spectrum, ECC is the most attractive publickey algorithm for lightweight applications such as RFID tags. Highly compact ECC engines are possible which need as little as 10,000 gate equivalences and run at a speed of several tens of milliseconds. Even though ECC engines are much larger than implementations of symmetric ciphers such as 3DES, they are considerably smaller than RSA implementations.
**The computational complexity of ECC is cubic in the bit length of the prime used. This is due to the fact that modular multiplication, which is the main operation on the bottom layer, is quadratic in the bit length, and scalar multiplication (i.e.,with the Double-and-Add algorithm) contributes another linear dimension, so that we have, in total, a cubic complexity. This implies that doubling the bit length of an ECC implementation results in performance degradation by a factor of roughly 2<sup>3</sup> = 8. **RSA and DL systems show the same cubic runtime behavior. The advantage of ECC over the other two popular public-key families is that the parameters have to be increased much more slowly to enhance the security level. For instance, doubling the effort of an attacker for a given ECC system requires an increase in the length of the parameter by 2 bits, whereas RSA or DL schemes require an increase of 20–30 bits. This behavior is due to the fact that only generic attacks are known ECC cryptosystems, whereas more powerful algorithms are available for attacking RSA and DL schemes.

#### Further Reading

##### History and General Remarks

 ECC was independently invented in 1987 by Neal Koblitz and in 1986 by Victor Miller. During the 1990s there was much speculation about the security and practicality of ECC, especially if compared to RSA. After a period of intensive research, they appear nowadays very secure, just like RSA and DL schemes. An important step for building confidence in ECC was the issuing of two ANSI banking standards for elliptic curve digital signature and key establishment in 1999 and 2001, respectively [6, 7]. Interestingly, in Suite B—a collection of crypto algorithms selected by the NSA for use in US government systems—only ECC schemes are allowed as asymmetric algorithms [130]. Elliptic curves are also widely used in commercial standards such as IPsec or Transport Layer Security (TLS).
At the time of writing, there still exist far more fielded RSA and DL applications than elliptic curve ones. This is mainly due to historical reasons and due to the quite complex patent situation of some ECC variants. Nevertheless, in many new applications
with security needs, especially in embedded systems such as mobile devices, ECC is often the preferred public-key scheme. For instance, ECC is used in the most popular business handheld devices. Most likely, ECC will become more widespread in the years to come. Reference [100] describes the historical development of ECC with respect to scientific and commercial aspects, and makes excellent reading.

For readers interested in a deeper understanding of ECC, the books [25, 24, 90, 44] are recommended. The overview article [103], even though a bit dated now, provides a good state-of-the-art summary as of the year 2000. For more recent developments, the annual Workshop on Elliptic Curve Cryptography (ECC) is recommended as an excellent resource [166]. The workshop includes both theoretical and applied topics related to ECC and related crypto schemes. There is also a rich literature that deals with the mathematics of elliptic curves [154, 101, 155], regardless of their use in cryptography.

##### Implementation and Variants 

In the first few years after the invention of ECC, these algorithms were believed to be computationally more complex than existing public-key schemes, especially RSA. This assumption is somewhat ironic in hindsight, given that ECC tends to be often faster than most other public-key schemes.
During the 1990s, fast implementation techniques for ECC was intensively researched, which resulted in considerable performance improvements.

In this chapter, elliptic curves over prime fields GF(p) were introduced. These are currently in practice somewhat more widely used than over other finite fields, but curves over binary Galois fields GF(2<sup>m</sup>) are also popular. For efficient implementations,
improvements are possible at the finite field arithmetic layer, at the group operation layer and at the point multiplication layer. There is a wealth of techniques and in the following is a summary of the most common acceleration techniques in practice. For curves over GF(p), generalized Mersenne primes are often used at the arithmetic level. These are primes such as p=2<sup>192</sup>−2<sup>64</sup>−1. Their major advantage is that modulo reduction is extremely simple. If general primes are used, methods similar to those described in Sect. 7.10 are applicable. With respect to ECC over fields GF(2<sup>m</sup>), efficient arithmetic algorithms are described in [90]. On the group operation layer, several optimizations are possible. A popular one is to switch from the affine coordinates that were introduced here to projective coordinates, in which each point is represented as a triple (x,y, z). Their advantage is that no inversion is required within the group operation. The number of multiplications increases, however. On the next layer, fast scalar multiplication techniques are applicable. Improved versions of the Double-and-Add algorithm which make use of the fact that
adding or subtracting a point come at almost identical costs are commonly being applied. An excellent compilation of efficient computation techniques for ECC is the book [90].

A special type of elliptic curve that allows for particularly fast point multiplication is the Koblitz curve [158]. These are curves over GF(2<sup>m</sup>) where the coefficients have the values 0 or 1. There have also been numerous other suggestions for elliptic curves with good implementation properties. One such proposal involves elliptic curves over optimum extension fields, i.e., fields of the form GF(p<sup>m</sup>), p > 2 [10].
As mentioned in Sect. 9.5, standardized curves are often being used in practice. A widely used set of curves is provided in the FIPS Standard [126, Appendix D].
Alternatives are curves specified by the ECC Brainpool consortium or the Standards for Efficient Cryptography Group (SECG) [34, 9] .
Elliptic curves also allow for many variants and generalization. They are a special case of hyperelliptic curves, which can also be used to build discrete logarithm cryptosystems [44]. A summary of implementation techniques for hyperelliptic curves is given in [175]. A completely different type of public-key scheme which also makes use of elliptic curves is identity-based cryptosystems [30], which have drawn much attention over the last few years.



#### Test

1. Show that the condition 4a<sup>3</sup>+27b<sup>2</sup> <> 0 mod p is fulfilled for the curve y<sup>2</sup> ≡ x<sup>3</sup>+2x+2 mod 17
   
   y<sup>2</sup> ≡ x<sup>3</sup>+a · x+b mod p 
   
   a=2, b=2
   
   4a<sup>3</sup>+27b<sup>2</sup>  = 4\*2<sup>3</sup>+27\*2<sup>2</sup> =140 mod 17 =4
   
2. Perform the additions

   (2,7)+(5,2)

   (3,6)+(3,6)

   in the group of the curve y<sup>2</sup> ≡ x<sup>3</sup>+2x+2 mod 17. Use only a pocket calculator.

   

   1) (2,7)+(5,2)

   s =(y2−y1)/(x2−x1) mod p 

   x3 = s2−x1−x2 mod p 

   y3=  s(x1-x3)- y1 mod p 

   

   s=(2-7)/(5-2) mod 17 =-5/3 mod 17 = 12*6 mod 17 = 4

   ​		1/3 mod 17 = 6 mod 17 (3*6=18 mod 17 =1 mod 17)

   ​		−5 mod 17 = -5 - 17\*floor(-5/17) =-5 - 17\*floor(-0.29) 不同程序结果不同，比如向下取整 -1 ，结果为12

   x<sub>3</sub> = s<sup>2</sup>−x<sub>1</sub>−x<sub>2</sub> mod p = 4<sup>2</sup>−2−5 mod 17 = 6

   y<sub>3</sub>=  s(x<sub>1</sub>-x<sub>3</sub>)- y<sub>1</sub> mod p  = 4(2-6) - 7 = -23 mod 17 = -23 - 17\*floor(-23/17) = -23 - 17\*floor(-1.35) = -23-17\*-2=11

   2) (3,6)+(3,6)

    s=(3x<sub>1</sub><sup>2</sup>+a)/2y<sub>1</sub> mod p

   x3 = s2−x1−x2 mod p 

   y3=  s(x1-x3)- y1 mod p 

   

3. In this chapter the elliptic curve y<sup>2</sup> ≡x<sup>3</sup>+2x+2 mod 17 is given with #E =19.
   Verify Hasse’s theorem for this curve.

   Given an elliptic curve E modulo p, the number of points on the curve is denoted by #E and is bounded by:
   p+1−2√p ≤ #E ≤ p+1+2√p.
   
   p=17, 17+1-2√17 ≤ #E ≤ 17+1+2√17 => 18-2\*4.12 ≤ #E ≤ 18+2\*4.12 => 9.75  ≤ #E ≤ 26.2
   
   
   
4. Let us again consider the elliptic curve y<sup>2</sup> ≡x<sup>3</sup>+2x+2 mod 17. Why are all points primitive elements?
   Note: In general it is not true that all elements of an elliptic curve are primitive.

   order is prime, refer <Group. Lagranges Theorem>

   

5. Let E be an elliptic curve defined over Z<sub>7</sub>:
   E : y<sup>2</sup> =x<sup>3</sup>+3x+2.

   1) Compute all points on E over Z<sub>7</sub>.

   

   2) What is the order of the group? (Hint: Do not miss the neutral element O.)

   3) Given the element α =(0,3), determine the order of α. Is α a primitive element?

   

6. In practice, a and k are both in the range p≈2<sup>150</sup> · · ·2<sup>250</sup>, and computing T =a·P and y<sub>0</sub> = k ·P is done using the Double-and-Add algorithm.

   1) Illustrate how the algorithm works for a = 19 and for a = 160. Do not perform
   elliptic curve operations, but keep P a variable.

   2) How many (i) point additions and (ii) point doublings are required on average for one “multiplication”? Assume that all integers have n = log<sub>2</sub>p bit.

   3) Assume that all integers have n = 160 bit, i.e., p is a 160-bit prime. Assume one group operation (addition or doubling) requires 20 μ sec. What is the time for one double-and-add operation?

7. Given an elliptic curve E over Z<sub>29</sub> and the base point P = (8,10):
   E :  y<sup>2</sup> =x<sup>3</sup>+4x+20 mod 29.
   Calculate the following point multiplication k · P using the Double-and-Add algorithm. Provide the intermediate results after each step.

   k = 9

   k = 20

8. Given is the same curve as in 7. The order of this curve is known to be #E = 37. Furthermore, an additional point Q = 15 · P = (14,23) on this curve is given. Determine the result of the following point multiplications by using as few group operations as possible, i.e., make smart use of the known point Q. Specify how you simplified the calculation each time.
   Hint: In addition to using Q, use the fact that it is easy to compute −P.

   16 ·P

   38 ·P

   53 ·P

   14 ·P+4 ·Q

   23 ·P+11 ·Q

   You should be able to perform the scalar multiplications with considerably fewer steps than a straightforward application of the double-and-add algorithm would allow.

9. Your task is to compute a session key in a DHKE protocol based on elliptic curves. Your private key is a = 6. You receive Bob’s public key B = (5,9). The elliptic curve being used is defined by
   y<sup>2</sup> ≡x<sup>3</sup>+x+6 mod 11.

10. An example for an elliptic curve DHKE is given in previous section. Verify the two scalar multiplications that Alice performs. Show the intermediate results within the group operation.

11. After the DHKE, Alice and Bob possess a mutual secret point R = (x,y). The modulus of the used elliptic curve is a 64-bit prime. Now, we want to derive a session key for a 128-bit block cipher. The session key is calculated as follows:

    K<sub>AB</sub> = h(x||y)

    Describe an efficient brute-force attack against the symmetric cipher. How many of the key bits are truly random in this case? (Hint: You do not need to describe the mathematical details. Provide a list of the necessary steps. Assume you have a function that computes square roots modulo p.)

12. Derive the formula for addition on elliptic curves. That is, given the coordinates for P and Q, find the coordinates for R = (x3,y3).

    Hint: First, find the equation of a line through the two points. Insert this equation in the elliptic curve equation. At some point you have to find the roots of a cubic polynomial x<sup>3</sup>+a<sub>2</sub>x<sup>2</sup>+a<sub>1</sub>x+a<sub>0</sub>. If the three roots are denoted by x0,x1,x2, you can
    use the fact that x0+x1+x2 = −a2.

    

https://www.certicom.com/content/certicom/en/21-elliptic-curve-addition-a-geometric-approach.html

https://www.certicom.com/content/certicom/en/212-adding-the-points-P-and-P.html

https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication

https://juejin.cn/post/6844903900961570823

https://www.desmos.com/calculator/ialhd71we3