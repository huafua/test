var fs=require("fs");
var path=require("path");
filepath="../../../../controllers/data";
var datafile=fs.readdirSync(filepath)[0];

var data=fs.readFileSync(path.join(filepath,datafile));
data=JSON.parse(data.toString()).info;
console.log(data);
usefulFiles=[];
data.forEach(function(x){
	// fs.unlink()
	if(x.img){
		usefulFiles.push(path.basename(x.img));
	}
});
var existedFiles=fs.readdirSync(".");
existedFiles=existedFiles.filter(function(x){
	return path.extname(x)!='.js';
})
existedFiles.forEach(function(filename){
	if(!(function(filename){
		for(var i=0;i<usefulFiles.length;i++){
			if(usefulFiles[i]==filename){
				return true;
			}
		}
		return false;
	})(filename)){
		try{
			fs.unlink(filename,function(err){
				if(err){
					throw err;
				}else{
					console.log(`文件${filename}已删除...`);
				}
			})
		}catch(err){
			console.log(err);
		}
	}
})
