---
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
title: '"Download" registration location list'
---

Target:http://reg.***.com/

Crack Process demonstrated by GIF:
![](/content/images/post/20190101/qq_reg.gif)
crack ** site reg location by LIU YUE
![](/content/images/post/20190101/qq_reg.png)

```
document.domain = "**.com";
var imwebReg = {ver: 10016,inited: !1,isSeaPhone: $("imweb_phoneArea") ? !0 : !1,switchToSeaPhone: !1,cellphone: "",checkPhoneMap: {},phoneCheck_clock: 0,defaultValue: {countryId: "1",provinceId: "11",cityId: "1",country: "China",province: "Beijing",city: "Dongcheng",yearType: "0",year: "0",month: "0",day: "0"},key:
********************************************************
********************************************************
setTimeout(function() {
	$.http.loadScript(imwebReg.url.ver + "?v=" + Math.random())
	}, 1E3);
	document.body.onmouseover = function() {
	imwebReg.init();
	document.body.onmouseover = null
};
function initLocation(a) {
	imwebReg.loadLocation(a)
}
```

http://*****/iframe/0/en/js/location_en.js

```
initLocation({AFG:{n:"Afghanistan","0":{n:"",HEA:{n:"Herat"},KBL:{n:"Kabul"},KDH:{n:"Kandahar"},MZR:{n:"Mazar-iSharif"}}},ALA:{n:"Alandlslands","0":{n:"","0":{n:""}}},ALB:{n:"Albania","0":{n:"",BR:{n:"Berat"},DI:{n:"Diber"},DR:{n:"Durres"},EL:{n:"Elbasan"},FR:{n:"Fier"},GJ:{n:"Gjirokaster"},KO:{n:"Korce"},KU:{n:"Kukes"},LE:{n:"Lezhe"},SH:{n:"Shkoder"},TR:{n:"Tirane"},VL:{n:"Vlore"}}},DZA:{n:"Algeria","0":{n:"",ADR:{n:"Adrar"},ADE:{n:"AinDefla"},ATE:{n:"AinTemouchent"},ALG:{n:"Alger"},AAE:{n:"Annaba"},
BAT:{n:"Batna"},BEC:{n:"Bechar"},
********************************************************************************
*********************************************************************************
,MV:{n:"Masvingo"},MN:{n:"Matabeleland North"},MS:{n:"Matabeleland South"},MD:{n:"Midlands"}}}});
```

$.http.loadScript(imwebReg.url.location);

I decide to export all location data as sql script

first, get json data:
![](/content/images/post/20190101/qq_reg1.png)
![](/content/images/post/20190101/qq_reg2.png)

TIPS：
convert string and json format might be tricky, remember replace double quotes with \" before conversion.

by digging into data structure,
Here is my code snippets to generate sql script from the data
```
$.each(countryList, function(key, country) {
	if (country.hasOwnProperty('n')&&country['n']!=null&&country['n']!=undefined&&country['n']!='') {
		var countryCode='NULL';
		var provinceCode='NULL';
		var cityCode='NULL';
		var countryName='NULL';
		var provinceName='NULL';
		var cityName='NULL';

		countryCode=key;
		countryName=country['n'];
		$.each(country,function(key,province){
			if(province.hasOwnProperty('n')&&province['n']!=null&&province['n']!=undefined&&province['n']!=''){
				provinceCode=key;
				provinceName=province['n'];
				$.each(province,function(key,city){
					if(city.hasOwnProperty('n')&&city['n']!=null&&city['n']!=undefined&&city['n']!=''){
						cityCode=key;
						cityName=city['n'];
					}
					if(key!='n'){
						console.log("insert into locationEN(countryCode,provinceCode,cityCode,country,province,city) values("+countryCode+","+provinceCode+","+cityCode+","+countryName+","+provinceName+","+cityName+")");
					}
				});
			}else{
				if(key!='n'){
					console.log("insert into locationEN(countryCode,provinceCode,cityCode,country,province,city) values("+countryCode+","+provinceCode+","+cityCode+","+countryName+","+provinceName+","+cityName+")");
				}
			}
		});
	}
});
```