---
sidebar: auto
sidebarDepth: 3
footer: MIT Licensed | Copyright © 2018-LIU YUE
---

[回目录](/docs/software)  《mongodb》

## 1.Install

**use install file**

Windows:
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
Use Command Interpreter, 不要用 Powershell

**manually install**

STEP 1:
download zip from mongodb ,suggest you use latest version, extract to maybe 'd:\mongodb'

STEP 2:
set System variables Path add 'd:\mong\bin'

STEP 3:
create folder for dbpath d:\mongodb\data
```
mongdb --dbpath "d:\mongodb\data"
```
in the case you come accross 'the program can't start because ssleay32.dll is missing from your computer',
you can fix it or using install files instead of manually install.

type http://localhost:27017/ in browser, will show "It looks like you are trying to access MongoDB over HTTP on the native driver port."
代表安装成功.
(tips:
if later you encounter "Unable to connect to server localhost:27017: Invalid credential for ..:
please check whether port 27017 is blocked by firewall,can run cmd:
netsh advfirewall firewall add rule name="MongoDB 27017" dir=in action=allow protocol=TCP localport=27017
)

STEP 4:
further step, if you want to make it a service, prepare mongd.cfg files:
```
logpath = c:\mongodb\log\log.txt
dbpath = c:\mongodb\data
directoryperdb = true
logappend = true
auth = false
setParameter = enableLocalhostAuthBypass=0
master = true
oplogSize = 500
```

then run
```
mongod --config c:\mongodb\mongd.cfg --install
```
to set up service ( to remove: replace 'install' with 'remove')

IMPORTANT
If you are running any edition of Windows Server 2008 R2 or Windows 7, please install a hotfix to resolve an issue with memory mapped files on Windows.

STEP 5:connect mongodb

a. directly connect: mongo localhost/dbname -u*** -p***
b.use mongo cmd, will connect to 'test' automatically, db cmd will show current database, show dbs will show all dbs, if got 'listDatabases failed:{ "ok" : 0, "errmsg" : "unauthorized" } at src/mongo/shell/mongo.js:46', according to the documentation, the user must be granted the clusterAdmin role for the listDatabases privilege

STEP 6:auth

prepare admin.js:
```
db = db.getSiblingDB("admin");
db.createUser({user:"test", pwd:"123456",roles:[{"role":"ｒｏｏｔ","db":"ａｄｍｉｎ"}]});//old version: db.addUser("sa", "123456");
db.auth("sa", "123456");
```

execute 
```mongo localhost/admin c:\mongodb\admin.js (before doing this, make sure mongodb is running)```

IMPORTANT:

a. You may encounter "I CONTROL Hotfix KB2731284 or later update is not installed, will zero-out data files"
then stop mongodb service, and modify mongod.cfg set auth=true, it will work
next time if you wanna run js,must do like this:
```
mongo -usa -p123456 localhost/admin c:\mongodb\mongo-newdb.js:
print("===== newdb =====");
db = db.getSiblingDB("dbname");
db.createUser({user:"ｄｅｖ", pwd:"123456",roles:[{"role":"dbOwner","db":"ｄｂｎａｍｅ"}]});//old version: db.addUser("dev", "123456");
db.auth("dev", "123456");
print("--- insert data ---");
db.Client.insert({ "_id" : "123", "Name" : "lyhistory", "Secret" : "lyhistory", "Callback" : "https://lyhistory.com", "ClientType" : 1 });
```

b. Version Issues
The schema of db.system.users in mongodb 2.4 and 2.6 are different which caused you fail to create new user.
http://stackoverflow.com/questions/23468137/how-to-add-authentication-to-mongodb-2-6
更改认证模式 MONGODB-CR / SCRAM-SHAR-1
http://www.xlgps.com/article/441478.html

## Cmds

```
c:\mongodb\bin>mongo localhost/mydb -udev -p123456
MongoDB shell version: 2.6.8
connecting to: localhost/mydb
> show tables
Friend
Message
system.indexes
> db.Friend.find({"_id":1}).pretty();
{
"_id" : 1,
"Friends" : [
{
{
"UserId" : 2,
"Name" : "Test 1",
"Avatar" : null,
"IsOnline" : false,
"State" : 1,
"NameType" : "3"
},
{
"UserId" : 3,
"Name" : "Test 2",
"Avatar" : null,
"IsOnline" : false,
"State" : 1,
"NameType" : "3"
}
]
}
>
Describe Schema
> var schema=db.ChatUser.findOne();
> for(var key in schema){print(key);}
_id
UserName
Gender
db.TableName.drop()
remove a deprecated filed('column')
db.collection.update(
{ '<field>': { '$exists': true } },  // Query
{ '$unset': { '<field>': true  } },  // Update
false, true                      	// Upsert, Multi
)
Update for MongoDB 2.2+:
You can now provide a JSON object instead of positional arguments for upsert and multi.
db.collection.update(
{ '<field>': { '$exists': true } },  // Query
{ '$unset': { '<field>': true  } },  // Update
{ 'multi': true }                	// Options
)
> db.ChatUser.update({'IsFriend':{'$exists':true}},{'$unset':{'IsFriend':true}},false,true);
WriteResult({ "nMatched" : 5, "nUpserted" : 0, "nModified" : 5 })
Add new fields:
db.your_collection.update({},{$set : {"new_field":1}},false,true)  --> 1 here represents double type,if you want to use as string, replace it with "1"

```

## code snippets

c#:

```
#1.MongoDB.Bson.Serialization

BsonClassMap.RegisterClassMap<Friend>(x =>
{
x.AutoMap();
x.SetIdMember(x.GetMemberMap(m => m.UserId));
x.IdMemberMap.SetRepresentation(BsonType.String);
x.GetMemberMap(m => m.UserId).SetIgnoreIfNull(true);
});
BsonClassMap.RegisterClassMap<Message>(x =>
{
x.AutoMap();
x.IdMemberMap.SetRepresentation(BsonType.ObjectId);
x.GetMemberMap(m => m.Id).SetIgnoreIfNull(true);
});
Get _id of an inserted document in MongoDB?
simply add this filed to your own class
[BsonId]
public ObjectId ID{get;set;}

#2.Update Mongodb

var updatebuidler = new List<UpdateBuilder>();
updatebuidler.Add(MongoDB.Driver.Builders.Update.Set("<COLUMN>", new BsonArray(<COLUMN VALUE>)));
this.Update(Query.EQ("_id", ObjectId.Parse(id)),MongoDB.Driver.Builders.Update.Combine(updatebuidler));

#3.UTC Date

list.ToList().ForEach(x =>
{
if (x.UpdateDate != null)
{
x.UpdateDate = x.UpdateDate .ToLocalTime();
}
});

```


```
db.test.insertOne({'code':'111','announced_date':'2018-02-01','report_date':'2018-02-01'})


db.daily.sort({'date':-1}).limit(1)
db.CWBB_ZCFZB.find({report_date:{$lt:'2018-03-31'}}).sort({report_date:-1}).limit(2)

map = function () { 
    emit(this.code, {rec:[this]}); 
}

reduce = function (key, values) {
    result={rec:[]};
    values.forEach( function(v) {
        result.rec = v.rec.concat(result.rec);
    } );
    return result;
}

final = function (key, value) {
      Array.prototype.sortByProp = function(p){
       return this.sort(function(a,b){
		return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
      });
    }
	value.rec.sortByProp('report_date');
    value.rec.sortByProp('announced_date');
    return value.rec.slice(0,1);
}


db.test.mapReduce(map, reduce, {query:{'report_date':{$lt:'2018-03-02'}},finalize:final, out:{inline:1}})

db.daily.find({is_trading:{$exists:false}}).sort({'date':1}).limit(1)
db.daily_qfq.find({index:{$nin:[true,false]}}).sort({'date':-1}).limit(1)
db.daily.find({code:'002688','index':false,date:{$lte:'2018-01-17'}}).sort({'time':-1}).limit(2)
db.daily.find({code:'002707','index':false,au_factor:{$ne:12.07}}).sort({'date':1}).limit(1)
db.daily.find({'index':false,au_factor:{$gte:10}}).sort({'date':1}).limit(1)

```

---

ref:

[Migrate mongodb database from localhost to remote servers](http://stackoverflow.com/questions/21303456/migrate-mongodb-database-from-localhost-to-remote-servers)
[backup and restore](https://docs.mongodb.org/manual/tutorial/backup-and-restore-tools/)
[mongo export import](http://www.mkyong.com/mongodb/mongodb-import-and-export-example/)
mongodump mongorestore

pagination:
http://blog.mongodirector.com/fast-paging-with-mongodb/
http://stackoverflow.com/questions/9703319/mongodb-ranged-pagination
 
MongoDB-CR Authentication failed: http://stackoverflow.com/questions/29006887/mongodb-cr-authentication-failed
想使用 MongoDB ，你应该了解这8个方面！ https://yq.aliyun.com/articles/7245
阿里云MongoDB技术内幕 https://yq.aliyun.com/topic/58?utm_campaign=wenzhang&utm_medium=article&utm_source=QQ-qun&utm_content=m_7769
如何把数据迁移到阿里云云MongoDb www.jianshu.com/p/d8a64bc90605
【Mongodb】用户和认证 权限总结  https://yq.aliyun.com/articles/27952
mongdb3.0用户验证问题  www.bbsmax.com/A/B0zq2eg8Jv/
http://canonind.blog.51cto.com/8239025/1843220
driver: https://pecl.php.net/package/mongodb

GUI
robomongo
http://docs.mongodb.org/getting-started/csharp/

repository:
https://github.com/mongodb


<disqus/>