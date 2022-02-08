[Dead Ends in Cryptanalysis #1: Length Extension Attacks](https://soatok.blog/2020/10/06/dead-ends-in-cryptanalysis-1-length-extension-attacks/)

This is the first entry in a (potentially infinite) series of dead end roads in the field of cryptanalysis.

Cryptography engineering is one of many specialties within the wider field of security engineering. Security engineering is a discipline that chiefly concerns itself with studying how systems fail in order to build better systems–ones that are resilient to malicious acts or even natural disasters. It sounds much simpler than it is.

If you want to develop and securely implement a cryptography feature in the application you’re developing, it isn’t enough to learn how to implement textbook descriptions of cryptography primitives during your C.S. undergrad studies (or equivalent). An active interest in studying how cryptosystems fail is the prerequisite for being a cryptography engineer.

Thus, cryptography engineering and cryptanalysis research go hand-in-hand.
If you are interested in exploring the field of cryptanalysis–be it to contribute on the attack side of cryptography or to learn better defense mechanisms–you will undoubtedly encounter roads that seem enticing and not well-tread, and it might not be immediately obvious why the road is a dead end. Furthermore, beyond a few comparison tables on Wikipedia or obscure Stack Exchange questions, the cryptology literature is often sparse on details about why these avenues lead nowhere.

So let’s explore where some of these dead-end roads lead, and why they stop where they do.
Length Extension Attacks
It’s difficult to provide a better summary of length extension attacks than what Skull Security wrote in 2012. However, that only addresses “What are they?”, “How do you use them?”, and “Which algorithms and constructions are vulnerable?”, but leaves out a more interesting question: “Why were they even possible to begin with?”

An Extensive Tale
To really understand length extension attacks, you have to understand how cryptographic hash functions used to be designed. This might sound intimidating, but we don’t need to delve too deep into the internals.

A cryptographic hash function is a keyless pseudorandom transformation from a variable length input to a fixed-length output. Hash functions are typically used as building blocks for larger constructions (both reasonable ones like HMAC-SHA-256, and unreasonable ones like my hash-crypt project).

However, hash functions like SHA-256 are designed to operate on sequential blocks of input. This is because sometimes you need to stream data into a hash function rather than load it all into memory at once. (This is why you can sha256sum a file larger than your available RAM without crashing your computer or causing performance headaches.)

A streaming hash function API might look like this:
```
class MyCoolHash(BaseHashClass):
    @staticmethod
    def init():
        """
        Initialize the hash state.
        """

    def update(data):
        """
        Update the hash state with additional data.
        """

    def digest():
        """
        Finalize the hash function.
        """

   def compress():
        """
        (Private method.)
        """ 
```
To use it, you’d call hash = MyCoolHash.init() and then chain together hash.update() calls with data as you load it from disk or the network, until you’ve run out of data. Then you’d call digest() and obtain the hash of the entire message.

There are two things to take away right now:

1.You can call update() multiple times, and that’s valid.
2.Your data might not be an even multiple of the internal block size of the hash function. (More often than not, it won’t be!)
So what happens when you call digest() and the amount of data you’ve passed to update() is not an even multiple of the hash size?

For most hash functions, the answer is simple: Append some ISO/IEC 7816-4 padding until you get a full block, run that through a final iteration of the internal compression function–the same one that gets called on update()–and then output the current internal state.

Let’s take a slightly deeper look at what a typical runtime would look like for the MyCoolHash class I sketched above:

1. hash = MyCoolHash.init()
Initialize some variables to some constants (initialization vectors).
2. hash.update(blockOfData)
+ Start with any buffered data (currently none), count up to 32 bytes. If you’ve reached this amount, invoke compress() on that data and clear the buffer. Otherwise, just append blockOfData to the currently buffered data.
+ For every 32 byte of data not yet touched by compress(), invoke compress() on this block (updating the internal state).
+ If you have any leftover bytes, append to the internal buffer for the next invocation to process.
3. hash.update(moreData)
Same as before, except there might be some buffered data from step 2.
4. output = hash.digest()
+ If you have any data left in the buffer, append a 0x80 byte followed by a bunch of 0x00 bytes of padding until you reach the block size. If you don’t, you have an entire block of padding (0x80 followed by 0x00s).
+ Call compress() one last time.
+ Serialize the internal hash state as a byte array or hexadecimal-encoded string (depending on usage). Return that to the caller.
This is fairly general description that will hold for most older hash functions. Some details might be slightly wrong (subtly different padding scheme, whether or not to include a block of empty padding on digest() invocations, etc.).

The details aren’t super important. Just the rhythm of the design.

+ init()
+ update()
  + load buffer, compress()
  + compress()
  + compress()
  + …
  + buffer remainder
+ …
+ digest()
  + load buffer, pad, compress()
  + serialize internal state
  + return


And thus, without having to know any of the details about what compress() even looks like, the reason why length extension attacks were ever possible should leap out at you!

If it doesn’t, look closely at the difference between update() and digest().

There are only two differences:

1. update() doesn’t pad before calling compress()
2. digest() returns the internal state that compress() always mutates

The reason length-extension attacks are possible is that, for some hash functions, the output of digest() is its full internal state.

This means that you can run take an existing hash function and pretend it’s the internal state after an update() call instead of a digest() call by appending the padding and then, after calling compress(), appending additional data of your choice.

The (F)Utility of Length Extension
Length-Extension Attacks are mostly used for attacking naive message authentication systems where someone attempts to authenticate a message (M) with a secret key (k), but they construct it like so:

```
auth_code = vulnerable_hash(k.append(M))
```

If this sounds like a very narrow use-case, that’s because it is. However, it still broke Flickr’s API once, and it’s a popular challenge for CTF competitions around the world.

Consequently, length-extension attacks are sometimes thought to be vulnerabilities of the construction rather than a vulnerability of the hash function. For a Message Authentication Code construction, these are classified under canonicalization attacks.

After all, even though SHA-256 is vulnerable to length-extension, but you can’t actually exploit it unless someone is using it in a vulnerable fashion.

That being said, it’s often common to say that hash functions like SHA-256 and SHA-512 are prone to length-extension.

Ways to Avoid Length-Extension Attacks
Use HMAC. HMAC was designed to prevent these kinds of attacks.

Alternatively, if you don’t have any cryptographic secrets, you can always do what bitcoin did: Hash your hash again.
```
return sha256(sha256(message))
```
Note: Don’t actually do that, it’s dangerous for other reasons. You also don’t want to take this to an extreme. If you iterate your hash too many times, you’ll reinvent PBKDF1 and its insecurity. Two is plenty.

Or you can do something really trivial (which ultimately became another standard option in the SHA-2 family of hash functions):

Always start with a 512-bit hash and then truncate your output so the attacker never recovers the entire internal state of your hash in order to extend it.

That’s why you’ll sometimes see SHA-512/224 and SHA-512/256 in a list of recommendations. This isn’t saying “use one or the other”, that’s the (rather confusing) notation for a standardized SHA-512 truncation.

Note: This is actually what SHA-384 has done all along, and that’s one of the reasons why you see SHA-384 used more than SHA-512.

If you want to be extra fancy, you can also just use a different hash function that isn’t vulnerable to length extension, such as SHA-3 or BLAKE2.

Questions and Answers
Why isn’t BLAKE2 vulnerable to length extension attacks?
Quite simply: It sets a flag in the internal hash state before compressing the final buffer.

If you try to deserialize this state then invoke update(), you’ll get a different result than BLAKE2’s compress() produced during digest().

For a secure hash function, a single bit of difference in the internal state should result in a wildly different output. (This is called the avalanche effect.)

Why isn’t SHA-3 vulnerable to length extension attacks?
SHA-3 is a sponge construction whose internal state is much larger than the hash function output. This prevents an attacker from recovering the hash function’s internal state from a message digest (similar to the truncated hash function discussed above).

Why don’t length-extension attacks break digital signature algorithms?
Digital signature algorithms–such as RSASSA, ECDSA, and EdDSA–take a cryptographic hash of a message and then perform some asymmetric cryptographic transformation of the hash with the secret key to produce a signature that can be verified with a public key. (The exact details are particular to the signature algorithm in question.)

Length-extension attacks only allow you to take a valid H(k || m) and produce a valid H(k || m || padding || extra) hash that will validate, even if you don’t know k. They don’t magically create collisions out of thin air.

Even if you use a weak hash function like SHA-1, knowing M and H(M) is not sufficient to calculate a valid signature. (You need to be able to know these values in order to verify the signature anyway.)

The security of digital signature algorithms depends entirely on the secrecy of the signing key and the security of the asymmetric cryptographic transformation used to generate a signature. (And its resilience to side-channel attacks.)

However, a more interesting class of attack is possible for systems that expect digital signatures to have similar properties as cryptographic hash functions. This would qualify as a protocol vulnerability, not a length-extension vulnerability.

TL;DR
Length-extension attacks exploit a neat property of a few cryptographic hash functions–most of which you shouldn’t be using in 2020 anyway (SHA-2 is still fine)–but can only be exploited by a narrow set of circumstances.

If you find yourself trying to use length-extension to break anything else, you’ve probably run into a cryptographic dead end and need to backtrack onto more interesting avenues of exploitation–of which there are assuredly many (unless your cryptography is boring).