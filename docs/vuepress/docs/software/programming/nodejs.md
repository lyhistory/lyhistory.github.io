



event loop

```
console.log('script start')

const interval = setInterval(() => {	1-TASK
  console.log('setInterval')
}, 0)

setTimeout(() => {						1-TASK
  console.log('setTimeout 1')
  Promise.resolve().then(() => {
    console.log('promise 3')
  }).then(() => {
    console.log('promise 4')
  }).then(() => {
    setTimeout(() => {
      console.log('setTimeout 2')
      Promise.resolve().then(() => {
        console.log('promise 5')
      }).then(() => {
        console.log('promise 6')
      }).then(() => {
        clearInterval(interval)
      })
    }, 0)
  })
}, 0)

Promise.resolve().then(() => {			1-MICROTASK
  console.log('promise 1')
}).then(() => {
  console.log('promise 2')
})

stack:
	script start
	<STACK empty>
	<run 1-MICROTASK>
	promise 1
	promise 2
	<MICROTASK empty>
	<STACK empty>
	<run 1-TASK>
	setInterval [ and schedule a new interval after timeout in 2-TASK queue]
	<MICROTASK empty>
	<run 1-TASK>
	setTimeout 1 [ and schedule promise 3, promise 4 as micro task, and schedule timeout2 as 2-TASK after previous interval]
	promise 3
	promise 4
	<MICROTASK empty>
	<run 2-TASK>
	setInterval [ and schedule a new interval after timeout in 3-TASK queue]
	setTimeout 2
	promise 5
	promise 6
	clearInterval
	
```



https://www.quora.com/What-is-the-difference-between-Node-js-front-end-and-Node-js-server-side

https://stackoverflow.com/questions/41247687/how-to-deploy-separated-frontend-and-backend

 

REACTJS

https://pro.ant.design/

 

Redux 

Sass

Jsx

 

npm install geoip-lite

npm install smoothie

 

 

nodejs部署

process.env.PORT

https://github.com/tjanczuk/iisnode/issues/282

 

http://cnodejs.org/topic/5775d5af0b982e0450b74649

 

https://github.com/sheila1227/FE-blog/issues/1

 

https://yq.aliyun.com/articles/80217

 

https://segmentfault.com/a/1190000009368204