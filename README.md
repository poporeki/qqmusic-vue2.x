# qqmusic-vue2.x
基于vue2.x  实现的一个音乐播放器，接口抓取自QQ音乐网页，安卓端
在线地址： music.yansk.cn
使用Express做了转发接口

前端主要使用了Vue Vue-Cli3 Vuex Axios  vue-awesome-swiper vue-lazyload
最开始用的浏览器自带滚动，做好后发现除了chrome以外，其它浏览器效果都是稀烂，后面全部改用better-scroll。

ps.最开始只是想做一个音乐播放器，后来看到qq音乐9.0内测版外观不错，然后就越做越多了。目前有很多冗余代码，有时间会重构一下，希望包涵。

QQ音乐的API可能会有变动，可能会出现无法正常使用的情况

# 如何运行
```javascript
git clone https://github.com/poporeki/qqmusic-vue2.x.git
cd qqmusic-vue2.x
npm install
npm run build
```

启动Koa服务
```javascript
node server.js

```


# 部分演示

首页
![image](http://image.yansk.cn/home.gif)

搜索页
![image](http://image.yansk.cn/search.gif)

歌手列表
![image](http://image.yansk.cn/singer_list.gif)

歌手详情
![image](http://image.yansk.cn/singer_detail.gif)

播放器
![image](http://image.yansk.cn/player.gif)

![image](http://image.yansk.cn/mv.gif)
