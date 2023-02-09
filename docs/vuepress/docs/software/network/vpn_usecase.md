https://github.com/githubvpn007/v2rayNvpn

```

var request = require('request')

 request({
  url: 'https://www.google.com',
  proxy: 'http://IP:PORT', //ss代理地址
}, function(err, resp, body) {
  console.log(body)
})
```