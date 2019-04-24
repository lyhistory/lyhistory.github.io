---
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
title: Code Snippets Series – C#
---

1.Test Task Async DeadLocks

[Demo Code](https://drive.google.com/folderview?id=0B5PbpyozmqqnfnQ3MTRHMktPWXlCb2J6VHFHT1Q5ZTFUMTJ5UkhMZ1Y2TUdnRkZKWDlPVEk&usp=sharing)  (I am using winform app to demonstrate deadlocks which also happens on asp.net, but Console app don't have such problem, even without calling Task.ConfigureAwait(false),codes that being 'await' will executed in new thread)

different between Task and Thread:

a.Task has return value (**Task.Result / **Task.GetAwaiter().GetResult())

b.Task run on created (Run/StartNew), Thread need Start after New

c.Task accept delegate/lamda, Thread accept object

d.Task can catch exception(after call ***Task.Wait() / ***Task.Result), Thread can not

[Task.Run vs Task.Factory.StartNew](http://blogs.msdn.com/b/pfxteam/archive/2011/10/24/10229468.aspx)

[Task.Run Etiquette Examples: Don't Use Task.Run in the Implementation](http://blog.stephencleary.com/2013/11/taskrun-etiquette-examples-dont-use.html)

2.async await

[Async Return Types](https://msdn.microsoft.com/en-us/library/hh524395.aspx)

.Result and await block main Thread, ContinueWith doesn't

await Task vs (Task\<T\> AsyncMethod).Result

async Task VS async Void  VS async Task\<T\>

[A Tour of Task, Part 6: Results](http://blog.stephencleary.com/2014/12/a-tour-of-task-part-6-results.html)  In short, await should be your go-to option for retrieving task results. The vast majority of the time, await should be used instead of Wait, Result, Exception, or GetAwaiter().GetResult().
[Await on a completed task same as task.Result?](http://stackoverflow.com/questions/24623120/await-on-a-completed-task-same-as-task-result)

warning: warning CS1998: This async method lacks 'await' operators and will run synchronously. Consider using the 'await' operator to await non-blocking API calls, or 'await Task.Run(...)' to do CPU-bound work on a background thread.

http://stackoverflow.com/questions/13243975/suppress-warning-cs1998-this-async-method-lacks-await

Error: An asynchronous operation cannot be started at this time. Asynchronous operations may only be started within an asynchronous handler or module or during certain events in the Page lifecycle. If this exception occurred while executing a Page, ensure that the Page is marked <%@ Page Async="true" %>.

http://stackoverflow.com/questions/13647346/calling-async-method-in-controller

Error: DeadLocks

----------------------------------------------------------------------------------------------------------------------------------------------
Don't Block on Async Code:
from http://blog.stephencleary.com/2012/07/dont-block-on-async-code.html
```
// My "library" method.
public static async Task<JObject> GetJsonAsync(Uri uri)
{
using (var client = new HttpClient())
{
var jsonString = await client.GetStringAsync(uri);
return JObject.Parse(jsonString);
}
}
// My "top-level" method.
public void Button1_Click(...)
{
var jsonTask = GetJsonAsync(...);
textBox1.Text = jsonTask.Result;
}
```
The top-level method calls GetJsonAsync (within the UI/ASP.NET context).
GetJsonAsync starts the REST request by calling HttpClient.GetStringAsync (still within the context).
GetStringAsync returns an uncompleted Task, indicating the REST request is not complete.
GetJsonAsync awaits the Task returned by GetStringAsync. The context is captured and will be used to continue running the GetJsonAsync method later. GetJsonAsync returns an uncompleted Task, indicating that the GetJsonAsync method is not complete.
The top-level method synchronously blocks on the Task returned by GetJsonAsync. This blocks the context thread.
… Eventually, the REST request will complete. This completes the Task that was returned by GetStringAsync.
The continuation for GetJsonAsync is now ready to run, and it waits for the context to be available so it can execute in the context.
Deadlock. The top-level method is blocking the context thread, waiting for GetJsonAsync to complete, and GetJsonAsync is waiting for the context to be free so it can complete.

Preventing the Deadlock

There are two best practices (both covered in my intro post) that avoid this situation:

In your “library” async methods, use ConfigureAwait(false) wherever possible.
Don’t block on Tasks; use async all the way down.

Consider the first best practice. The new “library” method looks like this:
```
public static async Task<JObject> GetJsonAsync(Uri uri)
{
using (var client = new HttpClient())
{
var jsonString = await client.GetStringAsync(uri).ConfigureAwait(false);
return JObject.Parse(jsonString);
}
}
```
This changes the continuation behavior of GetJsonAsync so that it does not resume on the context. Instead, GetJsonAsync will resume on a thread pool thread. This enables GetJsonAsync to complete the Task it returned without having to re-enter the context.

Consider the second best practice. The new “top-level” methods look like this:
```
public async void Button1_Click(...)
{
var json = await GetJsonAsync(...);
textBox1.Text = json;
}

public class MyController : ApiController
{
public async Task<string> Get()
{
var json = await GetJsonAsync(...);
return json.ToString();
}
}
```
This changes the blocking behavior of the top-level methods so that the context is never actually blocked; all “waits” are “asynchronous waits”.

Note: It is best to apply both best practices. Either one will prevent the deadlock, but both must be applied to achieve maximum performance and responsiveness.

----------------------------------------------------------------------------------------------------------------------------------------------

Calling async method synchronously
```
void Func(){

Task<string> sCode = Task.Run(async () =>
{
string msg =await GenerateCodeAsync();
return msg;
});

}
```