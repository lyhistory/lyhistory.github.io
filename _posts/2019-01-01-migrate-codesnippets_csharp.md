---
title: Code Snippets Series – C#
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
---

## 1.Test Task Async DeadLocks

[Demo Code](https://drive.google.com/folderview?id=0B5PbpyozmqqnfnQ3MTRHMktPWXlCb2J6VHFHT1Q5ZTFUMTJ5UkhMZ1Y2TUdnRkZKWDlPVEk&usp=sharing)  (I am using winform app to demonstrate deadlocks which also happens on asp.net, but Console app don't have such problem, even without calling Task.ConfigureAwait(false),codes that being 'await' will executed in new thread)

different between Task and Thread:

a.Task has return value (**Task.Result / **Task.GetAwaiter().GetResult())

b.Task run on created (Run/StartNew), Thread need Start after New

c.Task accept delegate/lamda, Thread accept object

d.Task can catch exception(after call ***Task.Wait() / ***Task.Result), Thread can not

[Task.Run vs Task.Factory.StartNew](http://blogs.msdn.com/b/pfxteam/archive/2011/10/24/10229468.aspx)

[Task.Run Etiquette Examples: Don't Use Task.Run in the Implementation](http://blog.stephencleary.com/2013/11/taskrun-etiquette-examples-dont-use.html)

## 2.async await

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
## 3.Threading.Timer run Async Task
Sometimes you may encounter such a requirement that you have a timer, and you have to do a async operation inside timer's callback which is a sync method.

(in Java they have TimerTask, but seems in C# we don't have the equivalent class)

a.try Nito.AsyncEx - https://github.com/StephenCleary/AsyncEx

[How to call asynchronous method from synchronous method in C#?](http://stackoverflow.com/questions/9343594/how-to-call-asynchronous-method-from-synchronous-method-in-c)

[Explicitly use a Func for asynchronous lambda function when Action overload is available](http://stackoverflow.com/questions/20395826/explicitly-use-a-functask-for-asynchronous-lambda-function-when-action-overloa)
b.Task based timer implement:

[Is there a Task based replacement for System.Threading.Timer?](http://stackoverflow.com/questions/4890915/is-there-a-task-based-replacement-for-system-threading-timer)

[How to implement Task Async for a timer in C#?](http://stackoverflow.com/questions/18646650/how-to-implement-task-async-for-a-timer-in-c)
c.I found this alternative 'solution', but this approach is proved not reliable.
```
var t = new System.Threading.Timer(async (object state) =>
{
await aysncOperation();
Console.WriteLine("Tmr Callback on: " + Thread.CurrentThread.ManagedThreadId);
});
```
here is why this approach can not work as we expect: [Potential pitfalls to avoid when passing around async lambdas](http://blogs.msdn.com/b/pfxteam/archive/2012/02/08/10265476.aspx)

references:

[All about .NET Timers - A Comparison](http://www.abhisheksur.com/2011/03/all-about-net-timers-comparison.html)

[MSDN:Asynchronous Programming with Async and Await (C# and Visual Basic)](https://msdn.microsoft.com/en-us/library/hh191443.aspx)

[Best Practices in Asynchronous Programming](https://msdn.microsoft.com/en-us/magazine/jj991977.aspx)

[Task-based Asynchronous Pattern](https://www.microsoft.com/en-us/download/details.aspx?id=19957)

[async & await 的前世今生](http://developer.51cto.com/art/201407/445556_all.htm)

[走进异步世界-犯傻也值得分享：ConfigureAwait(false)使用经验分享](http://www.cnblogs.com/cmt/p/configure_await_false.html)

[C#中async编程完全代替了Task了吗](http://zhidao.baidu.com/question/1574266920443995780.html)

System.Timers.Timer "single-threaded" usage
```
System.Timers.Timer t;
 
void StartTimer()  {
  t = new System.Timers.Timer();
  t.Interval = 500;
  t.AutoReset = false;
  t.Elapsed += TimerProc;
  t.Enabled = true;
}
 
void TimerProc(object sender, System.Timers.ElapsedEventArgs e) {
  Task();
  t.Enabled = true;
}
 
void Task() {
}
https://www.codeproject.com/Questions/405564/Syste-Timers-Timer-single-threaded-usage
```

## 4. k__backingfield
Use DataContract DataMember, add reference System.Runtime.Serialization

## 5.there is already datareader associated with this command
http://devproconnections.com/development/solving-net-scalability-problem

## 6. Iterate Datetime beware of your datetime string, especially when the source is from excel
```
string dateStr="2016-01-01 11:59:59";

DateTime.ParseExtrat(dateStr,"yyyy-MM-dd",null)  ,  result is 2016-01-01 00:00:00 (12:00：00 am)

string dateStr="27/1/2011  11:27:19 AM";

DateTime.TryParseExact(***, "d/M/yyyy h:m:s tt", CultureInfo.InvariantCulture, DateTimeStyles.None, out dt)

string myValue = "12:00:00.000";

DateTime myDate = DateTime.ParseExact(myValue, "HH:mm:ss:fff");

C# DateTime Format: A Concise Explanation for Beginners

https://blog.udemy.com/c-sharp-datetime-format/
```

## 7.network folder
Unhandled Exception: System.ArgumentException: The UNC path should be of the form \server\share.

http://stackoverflow.com/questions/3567063/get-a-list-of-all-unc-shared-folders-on-a-local-network-server

```
//
// Enumerate shares on local computer
//
Console.WriteLine("\nShares on local computer:");
ShareCollection shi = ShareCollection.LocalShares;
if (shi != null)
{
foreach(Share si in shi)
{
Console.WriteLine("{0}: {1} [{2}]",
si.ShareType, si, si.Path);

// If this is a file-system share, try to
// list the first five subfolders.
// NB: If the share is on a removable device,
// you could get "Not ready" or "Access denied"
// exceptions.
if (si.IsFileSystem)
{
try
{
System.IO.DirectoryInfo d = si.Root;
System.IO.DirectoryInfo[] Flds = d.GetDirectories();
for (int i=0; i < Flds.Length && i < 5; i++) Console.WriteLine("\t{0} - {1}", i, Flds[i].FullName); Console.WriteLine(); } catch (Exception ex) { Console.WriteLine("\tError listing {0}:\n\t{1}\n", si, ex.Message); } } } } else Console.WriteLine("Unable to enumerate the local shares."); // // Resolve local paths to UNC paths. // Console.WriteLine("{0} = {1}", fileName, ShareCollection.PathToUnc(fileName));
```
## 8.Serialize De-serialize dynamic objects
Deserialize JSON into C# dynamic object?

http://stackoverflow.com/questions/3142495/deserialize-json-into-c-sharp-dynamic-object

Quick JSON Serialization/Deserialization in C#


## 9.Email attachment
https://gist.github.com/mvark/8c523eb47670c2fc8da4

## 10.OpenXML for excel
https://msdn.microsoft.com/en-us/library/bb448854.aspx

Stylizing https://blogs.msdn.microsoft.com/chrisquon/2009/11/30/stylizing-your-excel-worksheets-with-open-xml-2-0/

Set Column Width https://social.msdn.microsoft.com/Forums/en-US/37419b3b-fc97-47a4-a52f-fba62a9dcabf/how-to-open-an-existing-excel-worksheet-and-set-column-width-to-best-fit-using-openxml-sax-in-c-?forum=oxmlsdk

Open XML SDK: get “Unreadable content” error when trying to populate more than 25 columns

http://stackoverflow.com/questions/14525573/open-xml-sdk-get-unreadable-content-error-when-trying-to-populate-more-than-2

## 11.Unable to find manifest signing certificate in the certificate store
http://stackoverflow.com/questions/11957295/unable-to-find-manifest-signing-certificate-in-the-certificate-store-even-wh


## 12. Reflection
```
public class ObjectB
{
public int Id { get; set; }
public string Name { get; set; }
}

public class ObjectA
{
public int Id { get; set; }
public string Name { get; set; }
public ObjectB Child { get; set; }
}
```

a. Grap a property of ObjectB obj.GetType().GetProperty("Name").GetValue(obj, null);

b. Sum Of a column of generic list by passing column name anonymously List list:list.Sum(x => x.GetType().GetProperty(columnName).GetValue(x, null)).ToString();

c. Get Property Value of Nested Classes

```
public static class ReflectionHelper
{
public static Object GetPropValue(this Object obj, String propName)
{
string[] nameParts = propName.Split('.');
if (nameParts.Length == 1)
{
return obj.GetType().GetProperty(propName).GetValue(obj, null);
}
foreach (String part in nameParts)
{
if (obj == null) { return null; }

Type type = obj.GetType();
PropertyInfo info = type.GetProperty(part);
if (info == null) { return null; }

obj = info.GetValue(obj, null);
}
return obj;
}
}
```

## 13. SMTP
Gmail

pro#1: unable to read data from the transport connection net_io_connectionclosed

change port 465 to 587, EnableSsl = true, The .NET SmtpClient only supports encryption via STARTTLS. If the EnableSsl flag is set, the server must respond to EHLO with a STARTTLS, otherwise it will throw an exception.

pro#2: he SMTP server requires a secure connection or the client was not authenticated. The server response was: 5.5.1 Authentication Required.

it may not be your code issue but high possibility is that your gmail account may encounter security blocking, simpliest way is to check whether you have rececived an email like this:
![](/content/images/post/20190101/gmail_smtp_blocked_signin.png)
then click 'allowing access to less secure apps'

if still cannot , try this https://accounts.google.com/DisplayUnlockCaptcha, unlock it

see more at http://stackoverflow.com/questions/20906077/gmail-error-the-smtp-server-requires-a-secure-connection-or-the-client-was-not

## 14.Compile error
1.for xml/ config file, some times got "Severity Code Description Project File Line Suppression State Error Invalid token 'Text' at root level of document"

right click- properties - Build Action - choose None.

2.Parser Error Message: Only one \<configSections\> element allowed per config file and if present must be the first child of the root

## 15.Quartz.Net
TimeZone problem https://forums.asp.net/t/2001087.aspx?Quartz+NET+scheduling+jobs+in+mvc+on+windows+azure
http://mattrandle.me/azure-worker-role-and-quartz-net/
http://knightcodes.com/.net/2016/08/15/xml-configuration-for-quartz-net.html

## 16. RUN PYTHON IN .NET
Running Python script from C# and working with the results https://medium.com/@dpursanov/running-python-script-from-c-and-working-with-the-results-843e68d230e5

http://devcenter.wintellect.com/jrobbins/pdb-files-what-every-developer-must-know

WorkingDirectory
```
processStartInfo start = new ProcessStartInfo();
processStartInfo start = new ProcessStartInfo();
start.FileName = "C:\\Python27\\python.exe";
Console.Write(args.Length);
// arg[0] = Path to your python script (example : "C:\\add_them.py")
// arg[1] = first arguement taken from  C#'s main method's args variable (here i'm passing a number : 5)
// arg[2] = second arguement taken from  C#'s main method's args variable ( here i'm passing a number : 6)
// pass these to your Arguements property of your ProcessStartInfo instance
start.Arguments = string.Format("{0} {1} {2}",args[0],args[1],args[2]);
start.UseShellExecute = false;
start.RedirectStandardOutput = true;
using (Process process = Process.Start(start)){ 
				using (StreamReader reader = process.StandardOutput) { 
							string result = reader.ReadToEnd(); // this prints 11 
							Console.Write(result);
				}
}
```


### issues:mvc ajax get empty data:
By default, the asp.net mvc does not allow an HTTP GET request with a JSON payload. You need to explicitly allow the behavior by using JsonRequestBehavior.AllowGet as the second parameter to the Json method like following.

return Json(returnObj, JsonRequestBehavior.AllowGet);
### issues:JSON decoding: Unexpected token: StartArray

the value starts from the exception position should be deserialized as an object, not a string

### issues: An asynchronous module or handler completed while an asynchronous operation was still pending

https://stackoverflow.com/questions/28805796/asp-net-controller-an-asynchronous-module-or-handler-completed-while-an-asynchr/28806198

That's because Task.Factory.StartNew does something dangerous in ASP.NET. It doesn't register the tasks execution with ASP.NET. This can lead to edge cases where a pool recycle executes, ignoring your background task completely, causing an abnormal abort. That is why you have to use a mechanism which registers the task, such as HostingEnvironment.QueueBackgroundWorkItem.