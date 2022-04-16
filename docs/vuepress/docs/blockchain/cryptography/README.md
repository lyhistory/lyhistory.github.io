

## Algebra concepts

Classic Algebra: 整数 有理数 实数 复数 加减乘除

Abstract Algebra: 构造新的number system，通常只说 加和乘（减和除用inverse表示），并且加和乘用更通用的 composition来代表，在abstract algebra中，如果不说具体的additive或multiplicative，通常是用 ◦ / + / x 或直接xy不带任何符号来表示一种composition方式，composition可以是加或乘法或模运算甚至是set permutation等

group 闭合，**Single composition law**: 要么加，要么乘(必须存在inverse)

+ abelian group：满足交换律
+ Cyclic Groups
+ subgroup

ring  闭合，**multiple composition law**: 既要加(满足additive composition law)，又要乘(满足multiplicative composition law，环中乘法不一定有单位元也不一定要满足交换律，不一定存在inverse)
+ 只从满足Additive composition law的加法环ring来说 === abelian group
+ communitative ring ==- ring+满足乘法交换律	例子：Integer Z = {0,1, -1, 2, -2, . . .}


field 闭合，既可以加也可以乘（由加群和乘“群”组合而成）
+ 加群 === abelian group
+ 乘“群” === communitative ring+multiplicative inverse(except additive identity 所以不是群，当然也可以说除掉addtive identity构成群)
+ finite field : field with finite number of elements, the number of elements called order，除去additive identity的乘法结构为循环群

例子：prime finite field：Fp , p = 2, 3, 5, 7 ,11, 13, ..... |Fp| = p, Z/(pZ)={ 0¯, 1¯, 2¯,(p-1)¯  } 

### 符号:

= ≠

≤ 

根号 √

∞ 无穷

◦ composition

⊆表示包含于 improper subset，下面有不等号≠的表示真包含于proper subset，但在同济版高等数学中，⊂表示包含于，下面有不等号的表示真包含于。

交集 ∩ 并集 U

∃ 存在

∀ 任意		

∈ 属于 ∉ 
≡ 同余符号

累加累乘


$$
\sum_{i=1}^n \frac{1}{i^2} \quad and \quad \prod_{i=1}^n \frac{1}{i^2} \quad and \quad \bigcup_{i=1}^{2} R
$$

https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference

希腊字母

uppercase *Σ*, lowercase *σ*

https://reference.wolfram.com/language/guide/GreekLetters.html.zh



domain -> codomain	bijective surjective injective

https://www.mathsisfun.com/sets/injective-surjective-bijective.html


## Cryptography

block ciphers VS stream ciphers

3 problems:

+ how to communicate safely => encryption/decryption
+ how to distribute the keys => key management & key exchange
+ how to sign => digital signature

PKI: public key infrastructure (Public-Key Cryptosystems) === Asymmetric Cryptography

DLP: Discrete Logarithm Problem

DHK: Diffie–Hellman key exchange

## Encryption

### Symmetric

Confusions and Diffusions

Theory:  finite field/Galois field/Prime Fields/Extension Fields GF(2<sup>m</sup>)

DES

AES

### Asymmetric

+ based on 大数分解素数

  theory: Euclidean Algorithm / Extended Euclidean Algorithm / Euler's Phi Function / Fermat's Little Theorem and Euler's Theorem

  + RSA

+ based on discrete logarithm
  + DHK
  + Elgamal Encryption
  + ECC


## Signature

Theory: hash function(for signing long message)

RSA 

Elgamal 

DSA

ECDSA



## Key Establishment

就是如何发布和管理相关的密钥

+ Symmetric

+ Asymmetric

  Pub key => CA



