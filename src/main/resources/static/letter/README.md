# ToGrilfriendLetters
作为程序员，给你喜欢的她的一封信，魔改了https://github.com/Rychou/two_years 这位大佬的资源，因为之前魔改的时候没有看到GITHUB上有开源，自己直接扒的静态页面修改的

# 写在前面
首先感谢Rychou的开源
本代码同样开源，提供使用
这个一开始是因为疫情见不到女朋友，情人节不知道送什么，然后看到了大佬的页面，就想着自己也仿一个。而最近一个朋友要追女生，所以我修改了一下，然后就在这边开源了，希望对广大的有喜欢的女孩子的程序员有所帮助。
由于这些代码一开始是从网页上扒下来的，并且我其实是一个学习后端的(前端稀烂)，所以想看代码学习的千万慎重，代码如同屎山。

# 魔改内容
1 添加了文字播放结束后的相册轮播

2 添加了新的字体（翩翩体），字体适配大多数浏览器，已配置otf格式与eot格式

3 魔改的时候出现了一点问题，导致信封背景也变成了气球，不过好像效果更好了。如果想要修复背景的话修改main的Js文件的4848行即可

# 如何使用并修改（傻瓜式操作）

## 1 关于使用
我是租了腾讯云与阿里云服务器的学生版，因为是静态页面所以直接安装了tomcat然后放到webapp下面就能访问了。如果没有自己的服务器，可以放在Github上面，有提供静态页面的功能，具体可以参照大佬的README

## 2 修改
a 文字内容 http://tool.chinaz.com/tools/unicode.aspx 网站进行内容转码Unicode转中文，及中文转Unicode
用记事本打开main.8f1b9eec.js文件，在第4858行至第4867行，可以直接搜索  'u.a.createElement("h1", {style: {fontWeight: 900}}'  来定位，把想说的话的Unicode码替换上去就行了，一个creteElement后面的是一段

b 相册轮播 搜索'bgImgArr.push(bgImgUrl.replace('{num}', i));'定位，把修改上一行 var i=200 i<209 i++,顺便改一下图片名字就行了，另外图片最好是1200px*800px，不然会在信框里平铺

c 相册开始轮播时间在4837行修改，单位ms，这个根据自己的文字数量进行修改

d 背景音乐，下载mp3格式把dongxi.mp3替换并且修改名字就好

# 关于缺点
1 由于字体文件过大，加载很慢，好像Vue有个功能可以提取字体特征,以较小代价修改字体，可惜我不会。如果有前端大佬愿意帮忙修改以下的话就太棒了，另外如果以后我后端水平可以一看，并且想来研究一下前端了，可能会来更新一下。

2 该网页在手机屏幕的适配性较差，这也是Rychou大佬之前就存在的问题，如果有人愿意修改一下，非常欢迎。
