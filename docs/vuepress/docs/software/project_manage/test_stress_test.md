## loadrunner

### Controller

#### Create/Edit Scripts

可以录制

或编写

```
trade()
{

    //开始事务
    lr_start_transaction("00006");

    lr_think_time(0.1);

	web_custom_request("test", 
					   "Url=http://127.0.0.1/testController/doSth",
					   "Method=POST",
                       "RecContentType=application/json",
					   "Mode=http",
                       "EncType=application/json",
                       "Body={\"id\":\"{id}\",\"quantity\":{quantity},\"price\":1.00}",
					   LAST);
    
	if (atoi(lr_eval_string("{ErrorCode}")) == 0) {
		lr_end_transaction("00006", LR_PASS);					 
		return 0;
	}
	else
	{
		lr_end_transaction("00006", LR_FAIL);
		return -1;
	}

}
```



右键 {id} {quantity} 可以编辑 parameter properties

#### Run Load Tests

选择添加 LoadGenerator/压力机，类型如果是unix注意选择：don't use rsh

右键点击压力机，选择Run-time Settings，若使用本机ip作为压力机，关闭log；若使用unix远程压力机，需要开启log，否则会报错

设置用户思考时间

### Generator

可以是windows或linux，可以是本机单机或集群

linux: 

https://community.microfocus.com/t5/LoadRunner-Professional-User/LoadRunner-Load-Generator-for-Linux/td-p/557373

https://hub.docker.com/r/hpsoftware/load_generator/