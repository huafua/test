const express=require("express");
const DataProvider=require("./data-provider");
var router=express.Router();

var provider=new DataProvider();
router.use("/list",function(req,res){
    res.render("web/index",{data:provider.data.info.filter(x=>x.isAdmin=="0"),keyword:""});
    res.end();
});
router.use("/search",function(req,res){
    res.render("web/index",{data:provider.queryByKeyword(req.query.keyword),keyword:req.query.keyword});
    res.end();
});

router.use("/",function(req,res){
    res.redirect("/list");
    res.end();
});

module.exports=function(){
    return router;
}