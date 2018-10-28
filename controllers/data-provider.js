const fs=require("fs");
const path=require("path");
function provider(){
    this.currentIndex=-1;
    this.maxid=-1;
    
}
provider.prototype.datafile=path.join(__dirname,"data/data.json");
provider.prototype.saveToFile=function(){
    // for(var i=0;i<this.data.length;i++){
    //     this.data[i].username=encodeURIComponent(this.data[i].username);
    //     this.data[i].desc=encodeURIComponent(this.data[i].desc);
    // }
    fs.writeFileSync(this.datafile,JSON.stringify(this.data));
};
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
    var a=JSON.parse(fs.readFileSync(this.datafile).toString());
    // for(var i=0;i<a.length;i++){
    //     a[i].username=decodeURIComponent(a[i].username);
    //     a[i].desc=decodeURIComponent(a[i].desc);
    // }
   
    return a;
}
// provider.prototype.data=[
//     {id:1,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:2,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:3,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:4,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:5,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:6,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:7,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:8,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:9,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:10,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:11,username:"Alice",gender:"female",img:"public/admin/images/default.png"},
//     {id:12,username:"Alice",gender:"female",img:"public/admin/images/default.png"}
// ];
provider.prototype.validateAdmin=function(username,password){
    for(var i=0;i<this.data.info.length;i++){
        if(this.data.info[i].username==username&&this.data.info[i].password==password&&this.data.info[i].isAdmin==1){
            return true;
        }
    }
    return false;
}
provider.prototype.newId=function(){
    for(var i=0;i<this.data.info.length;i++){
        var item=this.data.info[i];
        if(item.id>this.maxid){
            this.maxid=item.id;
        }
    };
    if(this.maxid<this.currentIndex){
        this.maxid=this.currentIndex;
    }
    this.currentIndex=++this.maxid;
    return this.currentIndex;
}

provider.prototype.getById=function(id){
    for(var i=0;i<this.data.info.length;i++){
        if(this.data.info[i].id==id){
            return this.data.info[i];
        }
    }
    return null;
};
provider.prototype.verifyQuestion=function(username,answer){
    
    for(var i=0;i<this.data.info.length;i++){
        console.log("req-username:"+username+",db-username:"+this.data.info[i].username+","+this.data.info[i].id);
        if(this.data.info[i].username==username&&this.data.info[i].isAdmin=="1"){
            for(var j=0;j<this.data.aa.length;j++){
                if(this.data.aa[j].id==this.data.info[i].id){
                    if(this.data.aa[j].answer==answer.toLocaleLowerCase()){
                        return {status:"ok",user:this.data.info[i]};
                    }
                }
            }
        }
    }
    return false;
};

provider.prototype.getQuestionByUsername=function(username){
    for(var i=0;i<this.data.info.length;i++){
        if(this.data.info[i].username==username&&this.data.info[i].isAdmin=="1"){
            for(var j=0;j<this.data.aa.length;j++){
                if(this.data.aa[j].id==this.data.info[i].id){
                    return {id:this.data.info[i].id,question:this.data.aa[j].question};
                }
            }
        }
    }
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