const express=require("express");
const static=require("express-static");
const multer=require("multer");
const cookieParser=require("cookie-parser");
const cookieSession=require("cookie-session");
const bodyParser=require("body-parser");
const path=require("path");
const routers=require("./controllers");

var app=express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(bodyParser.urlencoded());
app.use(multer({dest:path.join(__dirname,"www/uploads")}).any());
app.use(cookieParser());
app.use(cookieSession({
    secret:"helloworld",
    cookie:{
        maxAge:1000*60*10
    }
}));
app.use("/admin",routers.adminRouter);
app.use("/static",static(path.join(__dirname,"www")));
app.use("/",routers.webRouter);
app.use(function(req,res){
    if(req.session.user){
        req.session.maxAge=req.session.maxAge+1000*60;
    }
})
app.listen(8080,function(){
    console.log("Server started at 8080...");
});