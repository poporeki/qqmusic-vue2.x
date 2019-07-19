# qqmusic-vue2.x
基于vue2.x  实现的一个仿QQ音乐安卓端的音乐播放器，接口抓取自QQ音乐网页，安卓端，使用Node做了转发接口
付费歌曲无法播放

在线地址： [music.yansk.cn](http://music.yansk.cn)

## 实现内容
- [x] 首页 -- 完成
- [x] 分类歌单 -- 完成
- [x] 电台 -- 完成
- [X] 歌手信息 -- 完成
- [X] 歌手列表 -- 完成
- [x] 歌曲排行 -- 完成
- [x] 歌曲列表 -- 完成
- [x] 热门推荐 -- 完成
- [x] 歌曲搜索 -- 完成
- [x] 歌曲播放 -- 完成
- [x] MV搜索 -- 完成
- [x] MV播放 -- 完成
- [x] 音乐播放模式切换(单曲、顺序、列表、循环) -- 完成
- [x] 底部固定歌曲播放条 -- 完成

## 技术栈
- Vue
- Vue-Cli3
- Vuex
- Vue-Awesome-Swiper
- Better-Scroll
- Express
Vue Vue-Cli3 Vuex Axios  vue-awesome-swiper vue-lazyload



最开始用的浏览器自带滚动，做好后发现除了chrome以外，其它浏览器滚动效果都是稀烂，后面全部改用better-scroll，目前有很多代码冗余，有时间会重构一下

ps.最开始只是想做一个音乐播放器，后来看到qq音乐9.0内测版外观不错，然后就越做越多了，前期没有规划，代码有些乱

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
