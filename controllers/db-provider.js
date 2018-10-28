const fs=require("fs");
const path=require("path");
const mysql=require("mysql");
db=mysql.createPool({host:"localhost",user:"root",password:"huaufa",database:"demo"});
function provider(){
    // this.currentIndex=-1;
    // this.maxid=-1;
    
}
// provider.prototype.datafile=path.join(__dirname,"data/data.json");
// provider.prototype.saveToFile=function(){
    // for(var i=0;i<this.data.length;i++){
    //     this.data[i].username=encodeURIComponent(this.data[i].username);
    //     this.data[i].desc=encodeURIComponent(this.data[i].desc);
    // }
    fs.writeFileSync(this.datafile,JSON.stringify(this.data));
// };
provider.prototype.queryByKeyword=function(keyword){
    var result=[];
    var a=this.data.info.filter(function(x){
        return x.isAdmin=="0";
    });
    var reg=new RegExp(keyword,"gi");
    for(var i=0;i<a.length;i++){
       for(var key in a[i]){
            if(reg.test(a[i][key])){
                result.push(a[i]);
                break;
            }
       }
    }
    console.log(result);
    return result;
}
provider.prototype.getFromFile=function(){
    var a=[];
    return a;
}
provider.prototype.validateAdmin=function(username,password){
    db.query(`select * from info where username='${username}' and password='${password}' and isAdmin=1`,function(){

    })
    return false;
}

provider.prototype.getById=function(id){
    
    return false;
}
provider.prototype.removeById=function(id){
    for(var i=0;i<this.data.info.length;i++){
        if(this.data.info[i].id==id){
            this.data.info.splice(i,1);
        }
    }
    this.saveToFile();
};
provider.prototype.add=function(item){
    item.id=this.newId();
    this.data.info.push(item);
    this.saveToFile();
};

provider.prototype.update=function(item){
    for(var i=0;i<this.data.info.length;i++){
        var x=this.data.info[i];
        if(x.id==item.id){
           for(var key in item){
               if(key.toLocaleLowerCase()!='id'){
                   x[key]=item[key];
               }
           }
        }
    };
    this.saveToFile();
};
module.exports=(function(){
    if(!provider.prototype.data){
        provider.prototype.data=provider.prototype.getFromFile();
    }
    return provider;
})();