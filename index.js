const express=require("express");
const static=require("express-static");
const mysql=require("mysql");
const path=require("path");
const bodyParser=require("body-parser");

var db=mysql.createPool({host:"localhost",user:"root",password:"huafua",database:"demo"});
var app=express();
app.use(bodyParser.urlencoded());
app.use("/weibo",function(req,res){
   if(req.query.action=="add"){
        var username=req.query.username;
        var gender=req.query.gender;
        var age=req.query.age;
        var height=req.query.height;
        db.query(`insert into person values(0,'${username}',${gender},${height},${age})`,function(err){
            if(err){
                console.log(err);
            }else{
                db.query("select id,username,gender,age,height from person",function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                       
                        res.send(data);
                    }
                    res.end();
                })
            }
        })
   }else if(req.query.action=="delete"){
      db.query(`delete from person where id=${req.query.id}`,function(err){
          if(err){
              console.log(err);
          }else{
            db.query("select id,username,gender,age,height from person",function(err,data){
                if(err){
                    console.log(err);
                }else{
                    res.send(data);
                }
                res.end();
            })
          }
          
      })
      
   }else{
        db.query("select id,username,gender,age,height from person",function(err,data){
            if(err){
                res.send("错误");
            }else{
                res.send(data);                
            }
            res.end();
        })
   }
});
app.use("/favicon.ico",function(req,res){
    res.send();
});
app.get("/test",function(req,res){
    res.send([{username:"Alice",gender:"female"},{username:"Bruce",gender:"female"},{username:"Chris",gender:"male"}]);
    res.end();  
})
app.use(static("./www"));

app.listen(8080,function(){
    console.log("server started at 8080...");
});