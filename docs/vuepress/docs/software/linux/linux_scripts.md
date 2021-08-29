## bash's operators

https://tldp.org/LDP/abs/html/comparison-ops.html

```bsh
-n
   string is not null.

-z
  string is null, that is, has zero length
  
|| : 
https://superuser.com/questions/1022374/what-does-mean-in-the-context-of-a-shell-script
```

## tips

```
#list folders only
ls -d */

L_FOLER_LIST=( $(ls -d */ 2>/dev/null) )
echo "$folder list count: ${#L_FOLER_LIST[@]}"

```

