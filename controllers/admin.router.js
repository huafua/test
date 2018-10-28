const express=require("express");
const DataProvider=require("./data-provider");
const path=require("path");
const fs=require("fs");

var provider=new DataProvider();
var router=express.Router();

router.use(function(req,res,next){
    // console.log(req.url);
    if(!req.session.user&&req.url!='/login'&&req.url!="/questions"&&req.url!="/retrievePwd"&&req.url!="/verify"&&req.url!="/resetPwd"){
        res.redirect("/admin/login");
    }else{
        next();
    }
});


router.get("/login",function(req,res){
    res.render("admin/login",{});
    res.end();
});

router.post("/login",function(req,res){
    var {username,password}=req.body;
    if(provider.validateAdmin(username,password)){
        req.session.user={username,password};
        res.redirect("/admin/home");
    }else{
        res.redirect("/admin/login");
    }
});
router.get("/logout",function(req,res){
    req.session.user=null;
    res.redirect("/admin/login");
})
router.get("/home",function(req,res){
    res.render("admin/home",{user:req.session.user,data:provider.data.info.filter(x=>x.isAdmin=="0"),keyword:""});
    res.end();
})
router.get("/retrievePwd",function(req,res){
    res.render("admin/retrievePwd",{});
    res.end();
});
router.post("/questions",function(req,res){
    var result=provider.getQuestionByUsername(req.body.username);
    if(result){
        res.send({status:"ok",id:result.id,question:result.question});
    }else{
        res.send({status:"err"});
    }
    res.end();
})
router.post("/verify",function(req,res){
    var verifiedResult=provider.verifyQuestion(req.body.username,req.body.answer);
    if(verifiedResult){
        req.session.retrieveUser=verifiedResult.user;
        res.redirect("/admin/resetPwd");
    }else{
        res.redirect("/admin/retrievePwd");
    }
    // res.end();
});
router.get("/resetPwd",function(req,res){
    if(req.session.retrieveUser){
        var retrieveUser=req.session.retrieveUser;
        req.session.retrieveUser=null;
        res.render("admin/resetPwd",{retrieveUser});
        res.end();
    }else{
        res.redirect("/admin/retrievePwd");
    }
});
router.post("/resetPwd",function(req,res){
    console.log(req.body);
    provider.update(req.body);
    res.redirect("/admin/home");
})

router.get("/remove/:id",function(req,res){
    provider.removeById(req.params.id);
    // console.log(req.params);
    res.redirect("/admin/home");
});
router.get("/update/:id",function(req,res){
    var usertoupdate=provider.getById(req.params.id);
    if(usertoupdate){       
        res.render("admin/update",{usertoupdate,user:req.session.user});
        res.end();
    }else{
        res.status(500).send("execuse me?");
        res.end();
    }

});
router.post("/update",function(req,res){
    console.log(req.body);
    var a=req.body;

    if(req.files.length>0){
        var result=processUpload(req.files[0]);
        if(result){
            a.img=result.fileNameInStaticPath;
        }else{
            a.img="/public/admin/images/default.png";
        }
    }else{
        a.img="/public/admin/images/default.png";
    }

    provider.update(a);
    res.redirect("/admin/home");
});
router.get("/add",function(req,res){
    res.render("admin/add",{user:req.session.user});
    res.end();
});
router.use("/search",function(req,res){
    if(req.session.user){
        res.render("admin/home",{data:provider.queryByKeyword(req.query.keyword),keyword:req.query.keyword,user:req.session.user});
        res.end();
    }else{
        res.redirect("/admin/home");
    }
});
function processUpload(file){
    var oldFileName=file.path;
    var fileNameWithExtension=file.filename+path.extname(file.originalname);
    var fileNameInStaticPath=path.join("public/admin/images",fileNameWithExtension);
    var newFileName=path.join(path.parse(file.destination).dir,fileNameInStaticPath);
    try{
        var result=fs.renameSync(oldFileName,newFileName)
        return {fileNameInStaticPath};
    }catch(err){
        return false;
    }
}
router.post("/uploadImage",function(req,res){
    var file=req.files[0];
    var oldFileName=file.path;
    var fileNameWithExtension=file.filename+path.extname(file.originalname);
    var fileNameInStaticPath=path.join("public/admin/images",fileNameWithExtension);
    var newFileName=path.join(path.parse(file.destination).dir,fileNameInStaticPath);
    fs.rename(oldFileName,newFileName,function(err){
        if(err){
            console.log(err);
            res.status("500").send("Server Internal Error");
            res.end();
            throw err;
        }else{
            var fileToRemove=path.join(path.parse(file.destination).dir,req.body.toRemove)
            if(fileToRemove.endsWith("default.png")){
                fileToRemove="nothing";
            }
            fs.exists(fileToRemove,function(exists){
                if(exists){
                    fs.unlink(fileToRemove,function(err){
                        if(err){
                            console.log(err);
                            res.status(500).send("Internal Serve Error");
                            res.end();                    
                        }else{
                            res.send({
                                status:"ok",
                                staticFileName:fileNameInStaticPath,
                                filename:fileNameWithExtension
                            });
                            res.end();
                        }
                    })
                }else{
                    res.send({
                        status:"err",
                        staticFileName:fileNameInStaticPath,
                        filename:fileNameWithExtension
                    });
                    res.end();
                }
            });
            
        }
    })
    
});
router.post("/add",function(req,res){
    var a=req.body;
    a.password="password";
    if(req.files.length>0){
        var result=processUpload(req.files[0]);
        if(result){
            a.img=result.fileNameInStaticPath;
        }else{
            a.img="public/admin/images/default.png";
        }
    }else{
        a.img="public/admin/images/default.png";
    }
    provider.add(a);
    res.redirect("/admin/home");
});
router.get("/register",function(req,res){
    res.send("用户注册");
    res.end();
});
router.post("/register",function(req,res){

});
router.use("/",function(req,res){
    res.redirect("/admin/home");
});

module.exports=function(){
    return router;
}