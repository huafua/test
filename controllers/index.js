var adminRouter=require("./admin.router");
var webRouter=require("./web.router");
var DataProvider =require("./data-provider");
module.exports={
    adminRouter:adminRouter(),
    webRouter:webRouter(),
    provider:new DataProvider()
}