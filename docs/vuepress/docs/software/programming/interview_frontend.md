前端必读：浏览器内部工作原理 https://kb.cnblogs.com/page/129756/



## 背景探测

线框 Wireframe ，低保真（草稿） 到 高保真（原型图）

### CSS

css position


1. Center 居中问题

a.div里面的内容居中，如果里面是inline，需要display block，然后margin left right auto

b.图片与文字并排居中

1、单独文字垂直居中我们只需要设置CSS样式line-height属性即可。

2、文字与图片同排，在设置div高度同时再对此css样式的图片“img”样式设置vertical-align:middle垂直居中属性

2. Render 

a.float要设置width，如果float元素是无法撑开parent高度的，所以parent需要设置height

b.relative里面的absolute，float的元素只能撑开float类型的parent

c.a这样的inline elements如果加上background img，如果内部没有内容text，给宽度都是没用的，不会显示出来，应该加上padding，内容才会出来

3.Font


why? 我们经常会在比如bootstrap中用到伪元素::before :: after{content:'\ff01';}，伪元素不会改变document，只是通过更换样式改变最终的呈现效果，这种理念很好，也减轻了页面load的负担


 4.Events Receiver

CSS pointer-Events To Allow Clicks On Underlying Elements

https://robertnyman.com/2010/03/22/css-pointer-events-to-allow-clicks-on-underlying-elements/

### js

#### 闭包：

In computer science, a closure is a function that has an environment of its own and at least one variable within that environment.

A function exists in and has access to the global scope. Anything declared within that function also has access to the global scope, even though it exists inside its own *function scope*.

Within a written program, the scope of each variable is linked together through what is referred to as the *scope chain*, with global scope always sitting at the top of the chain.

The JavaScript compiler traverses this chain. However, the compiler is like a car that only runs in reverse, never forward.

When a variable is used, the compiler travels back up the scope chain until it finds an entry for that variable.

Closure only provides access from inner to outer scope, not from outer to inner scope.

```
function encourage() {
 const positivity = 'You got this!';
}
// positivity has function scope
{
 const negativity = 'I don't got this.';
}
// negativity has block scope
```



```
function a(){
    var i=0;
    function b(){
    	alert(++i);
	}
	return b;
}
var c=a();
c();

这段代码有两个特点：
1、函数b嵌套在函数a内部；
2、函数a返回函数b。
这样在执行完var c=a( )后，变量c实际上是指向了函数b，再执行c( )后就会弹出一个窗口显示i的值（第一次为1）。这段代码其实就创建了一个闭包，这是因为函数a外的变量c引用了函数a内的函数b。也就是说，当函数a的内部函数b被函数a外的一个变量引用的时候，就创建了一个闭包。
简而言之，闭包的作用就是在a执行完并返回后，闭包使得Javascript的垃圾回收机制不会收回a所占用的资源，因为a的内部函数b的执行需要依赖a中的变量。
在上面的例子中，由于闭包的存在使得函数a返回后，a中的i始终存在，这样每次执行c()，i都是自加1后alert出i的值。
那 么我们来想象另一种情况，如果a返回的不是函数b，情况就完全不同了。因为a执行完后，b没有被返回给a的外界，只是被a所引用，而此时a也只会被b引 用，因此函数a和b互相引用但又不被外界打扰（被外界引用），函数a和b就会被回收。
```

```
var a = 1;

function test(){
	var a = 2;
	console.log("test a="+a);
}

test();

console.log("global a="+a);
```



```
for (var i = 0; i < 5; ++i) {
  setTimeout(function() {
    console.log(i + " ");
  }, 100);
}
输出结果为 5 5 5 5 5

for (var i = 0; i < 5; ++i) {
  (function(i) {
    setTimeout(function() {
      console.log(i + " ");
    }, 100);
  })(i);
}
输出结果为： 0 1 2 3 4
```



#### 元素事件

table right click



### jquery

ready vs onload

The `ready` event occurs after the HTML document has been loaded, while the `onload` event occurs later, when all content (e.g. images) also has been loaded.

The `onload` event is a standard event in the DOM, while the `ready` event is specific to jQuery. The purpose of the `ready` event is that it should occur as early as possible after the document has loaded, so that code that adds functionality to the elements in the page doesn't have to wait for all content to load.



### Framework:

jquery template

Bootstrap

antd

## reactjs+mobx

virtual dom：https://zhenyong.github.io/react/docs/glossary.html



如何操作比如 （各种reactdom api）

创建element

获取element，getElementById？

法一：

`<input refs value={this.state.input} onchange={setState}/>`

法二：

```
<input type="submit" className="nameInput" id="name" value="cp-dev1" onClick={this.writeData} ref = "cpDev1"/>

  componentDidMount: function(){
    var name = React.findDOMNode(this.refs.cpDev1).value;
    this.someOtherFunction(name);
  }
```



```
 <button className="square" onClick={() => alert('click')}>
       {this.props.value}
     </button>
 VS:  
  <button className="square" onClick={alert('click')}>
       {this.props.value}
     </button>
```



```
普通模式：
export defalt <classname>;
单例模式
const store = new BirdStore();
export default store;
```



mobx作用

```
+ Use the @observable decorator or observable(object or array) functions to make objects trackable for MobX.
+ The @computed decorator can be used to create functions that can automatically derive their value from the state.
+ Use autorun to automatically run functions that depend on some observable state. This is useful for logging, making network requests, etc.
+ reactions
  will not fire initially, only on change
+ transactions
+ actions
  strict mode: only allow data modified in actions
```





## 前端性能优化

页面重绘；

静态页面 cache；

压缩css js

图片：icon：image sprite，大图 压缩+lazy load

```
20 种提升网页速度的技巧 https://www.ibm.com/developerworks/cn/web/wa-speedweb/

AMP，来自 Google 的移动页面优化方案 https://imququ.com/post/amp-project.html

web 页面加载速度优化实战-100% 的飞跃提升 http://blog.csdn.net/hj7jay/article/details/52770285


虽然是静态页面，也需要好好打磨一下，你用谷歌浏览器或者其他测速的工具，观察每个resource下载的速度

css js 图片 整个页面

首先几点基本要求：

1.css放到顶部，js放到底部，减少页面重绘，因为页面先加载css 浏览器就知道根据css去绘制html而不是先绘制 然后发现css后重绘

2.html页面标签启用cache(加metatag）http://www.i18nguy.com/markup/metatags.html

尤其静态页面 明确让浏览器使用cache

3.压缩css和js，很多工具，自己查下，设置很多在线工具可以用

4.图片问题，这里强调的是大图背景的使用策略

a.首先是优化，用这个在线工具做优化 https://kraken.io/web-interface


b.在避免不了的情况下，我们这个是pc版的还好，如果需要支持手机版，就不能再加载大图了，可以这样玩

body {

background: #ABCDEF url(largeBackground.jpg);

}

@media screen and (max-width: 640px){

body {

/* option 1: remove background altogether */

background: #fff;

/* option 2: serve a much smaller background */

background: #ABCDEF url(muchSmallerBackground.jpg);

}


c.理想的情况下，所有的大图应该使用lazy load，很多插件可以考虑

d.对于琐碎的小图（工具图，比如关闭叉，提示icon等），应该做成一张大图，然后再页面上采用位移的方式显示

image sprite https://li-xinyang.gitbooks.io/frontend-notebook/content/chapter1/01_05_image_optimisation.html

上面说的是一些基本考虑，你根据需要相应采用，目的就是提高加载速度，减少资源请求次数（请求两次css就要建立两个http链接，不如两个css文件压缩到一个文件，压缩可以去掉空行，空格，降低文件的大小）
```

<disqus/>