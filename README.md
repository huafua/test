# 1 创建项目
## 1.1 初始化项目
```shell
  npm init -y
```
## 1.2 安装依赖
```shell
  npm install express express-static ejs cookie-parser cookie-session body-parser supervisor multer
```
## 1.3 修改 package.json文件
```javascript
   "scripts": {
    "test": "supervisor app.js" 
  }
```
## 1.4 创建入口文件并编写基础代码
```javascript
  const express=require("express");
  const static=require("express-static");
  const multer=require("multer");
  const cookieParser=require("cookie-parser");
  const cookieSesson=require("cookie-session");
  const bodyParser=require("body-parser");
  const path=require("path");
  
  var app=express();
  app.use(multer().any());
  app.use(bodyParser.urlencoded());
  app.use("/static",static(path.join(__dirname,"public"));
  app.use(cookieParser());
  app.use(cookieSession({
    security:"helloworld",
    cookie:{
      maxAge:10*60*1000
    }
  }));
  app.set("engine","ejs");
  app.set("views",path.join(__dirname,"views"));
  app.use("/",function(req,res){
    res.end("start");
  });
  app.listen(8080,function(){
    console.log("Server started at 8080...");
  })
```
## 1.5 执行看看是否能够正常跑起来
```shell
  npm test
```
不用多说，肯定没问题的啊
