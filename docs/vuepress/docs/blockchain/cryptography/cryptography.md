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



Addition and Subtraction in GF(2<sup>m</sup>):

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

