## Web Server & Framework Version Identification

```
<IfModule mod_headers.c>
Header always unset Server
Header always unset X-Powered-By
Header unset X-Powered-By
Header unset X-CF-Powered-By
Header unset X-Mod-Pagespeed
Header unset X-Pingback
Header unset X-Redirect-By
</IfModule>

```

Can't remove Server: Apache header https://stackoverflow.com/questions/35360516/cant-remove-server-apache-header/35363645

