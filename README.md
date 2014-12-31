Microblog
=========

1.Node.js开发指南中Microblog代码，node-v0.10.33 express-v4.9.0

2.《Node.js开发指南》是学习Nodej入门的一本不错的书，但是由于书出版时间较早，
Node这几年变化略大，所以书上的有些代码不适合最新版本node和express
笔者在原来的代码上做了一些修改，以适应最新的版本。<br>

3.本实例的HTML模采用的是ejs<br>

4.关于版本的不同主要体现在app.js里相关require以及代码顺序<br>

5.本例连接的是远程服务器上的mongodb数据库，所以在连接数据的配置上和
本地连接会有些不同，单独在settings.js 里host配置地址不知道为什么不起作用，
还是连接127.0.0.1，于是，笔者修改了node_modules/connect-mongo/lib/connect-mongo.js
第20行的defaultOptions里的配置,修改host为服务器地址，这样就ok啦，不知道还有没有好的方法，
就是不必去修改connect-mongo模块里的默认配置，直接在外围配置中修改就可以。
