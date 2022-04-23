普通登录，SSO，3rd party logon

Central AuthenticationServer，Oauth2

首先要搞明白authentication和authorization的本质，基础知识参考：

oauth2 https://lyhistory.com/docs/software/highlevel/oauth2
shiro https://lyhistory.com/docs/software/buildingblock/shiro



## github 

[Bypassing GitHub's OAuth flow](https://blog.teddykatz.com/2019/11/05/github-oauth-bypass.html)



## 0day sign in with apple

https://bhavukjain.com/blog/2020/05/30/zeroday-signin-with-apple/

All your questions can be answered by reading “Sign in with Apple REST API” [1][2]:

1. User clicks or touches the “Sign in with Apple” button

2. App or website redirects the user to Apple’s authentication service with some information in the URL including the application ID (aka. OAuth Client ID), Redirect URL, scopes (aka. permissions) and an optional state parameter

3. User types their username and password and if correct Apple redirects them back to the “Redirect URL” with an identity token, authorization code, and user identifier to your app

4. The identity token is a JSON Web Token (JWT) and contains the following claims:

   • iss: The issuer-registered claim key, which has the value https://appleid.apple.com.

   • sub: The unique identifier for the user.

   • aud: Your client_id in your Apple Developer account.

   • exp: The expiry time for the token. This value is typically set to five minutes.

   • iat: The time the token was issued.

   • nonce: A String value used to associate a client session and an ID token. This value is used to mitigate replay attacks and is present only if passed during the authorization request.

   • nonce_supported: A Boolean value that indicates whether the transaction is on a nonce-supported platform. If you sent a nonce in the authorization request but do not see the nonce claim in the ID token, check this claim to determine how to proceed. If this claim returns true you should treat nonce as mandatory and fail the transaction; otherwise, you can proceed treating the nonce as optional.

   • email: The user's email address.

   • email_verified: A Boolean value that indicates whether the service has verified the email. The value of this claim is always true because the servers only return verified email addresses.

   • c_hash: Required when using the Hybrid Flow. Code hash value is the base64url encoding of the left-most half of the hash of the octets of the ASCII representation of the code value, where the hash algorithm used is the hash algorithm used in the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is HS512, hash the code value with SHA-512, then take the left-most 256 bits and base64url encode them. The c_hash value is a case sensitive string

Let's start with **the fact that Apple is forcing people to use an E-mail address as a user ID**. That's just straight-up stupid.
https://news.ycombinator.com/item?id=23362149
jwt https://jwt.io/introduction/
	