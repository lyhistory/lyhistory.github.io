(window.webpackJsonp=window.webpackJsonp||[]).push([[105],{307:function(t,a,s){"use strict";s.r(a);var r=s(0),e=Object(r.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"basic"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#basic"}},[t._v("#")]),t._v(" Basic")]),t._v(" "),s("p",[t._v("查看命令类型:\ttype 'cmd'")]),t._v(" "),s("p",[t._v("查看系统：\tcat /etc/os-release")]),t._v(" "),s("p",[t._v("man")]),t._v(" "),s("p",[t._v("tldr:\thttps://tldr.sh/")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("npm install -g tldr \n或者\npip install tldr\n\nsudo ln -s /home/lyhistory/.local/bin/tldr tldr\n或者修改.bashrc\nexport PATH=$PATH:$HOME/.local/bin\n")])])]),s("h2",{attrs:{id:"find"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#find"}},[t._v("#")]),t._v(" FIND")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v('find . -size +1G -ls | sort -k7n\n\nfind / -type f -name "mysql-connector-java-5.1.24.jar" -print\n\nfind / -type f -name "Locations.xml" -print\n')])])]),s("h2",{attrs:{id:"grep"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#grep"}},[t._v("#")]),t._v(" GREP")]),t._v(" "),s("p",[t._v("https://www.cyberciti.biz/faq/howto-use-grep-command-in-linux-unix/")]),t._v(" "),s("p",[t._v('grep -H -r "syscript" ~ | cut -d: -f1 | sort -u')]),t._v(" "),s("p",[t._v('grep -H -r "create_db.sh" ~ | cut -d: -f1 | sort -u')]),t._v(" "),s("p",[t._v('grep -H -r "/apps/lib" ~ | cut -d: -f1 | sort -u')]),t._v(" "),s("h2",{attrs:{id:"du-df"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#du-df"}},[t._v("#")]),t._v(" du/df")]),t._v(" "),s("p",[t._v("由一次磁盘告警引发的血案 | 你知道 du 和 ls 区别吗？")]),t._v(" "),s("p",[t._v("https://mp.weixin.qq.com/s/BMeSEcQbhC4dcH-oYEtE-g")]),t._v(" "),s("h2",{attrs:{id:"crontab"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#crontab"}},[t._v("#")]),t._v(" crontab")]),t._v(" "),s("p",[s("code",[t._v("/etc/crontab")]),t._v("是系统级别的crontab，系统的设置\n"),s("code",[t._v("crontab -e")]),t._v("是用户级的crontab\nlinux下实际保存在"),s("code",[t._v("/var/spool/cron/username")]),t._v("中")])])}),[],!1,null,null,null);a.default=e.exports}}]);