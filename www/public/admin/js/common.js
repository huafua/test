function uploadFile(element,parentid){
    var frm=document.getElementById(parentid);
    if(frm.fileComponent){
        frm.removeChild(frm.fileComponent);
        frm.fileComponent=null;
    };

    var fileInput=document.createElement("input");
    fileInput.type="file";
    fileInput.name="personImage";
    fileInput.onchange=function(){
        var http=new XMLHttpRequest();
        http.onreadystatechange=function(){
            if(this.readyState==4){
                if(this.status==200){
                    var result=JSON.parse(this.responseText);
                    console.log(result);
                    element.src="/static/"+result.staticFileName;
                    element.setAttribute("toRemove",result.staticFileName);
                    if(frm.hiddenComponent){
                        frm.hiddenComponent.value=element.getAttribute("toRemove");
                    }else{
                        var hiddenElement=document.createElement("input");
                        hiddenElement.type="hidden";
                        hiddenElement.name="img";
                        hiddenElement.value=element.getAttribute("toRemove");
                        frm.appendChild(hiddenElement);
                        frm.hiddenComponent=hiddenElement;
                    }
                    frm.removeChild(frm.fileComponent);
                    frm.fileComponent=null;
                }
            }
        };
        var formdata=new FormData();
        formdata.append("personImage",fileInput.files[0]);
        formdata.append("toRemove",element.getAttribute("toRemove")||"initializedValue")
        http.open("post","/admin/uploadImage",true);
        http.send(formdata);
    }
    frm.appendChild(fileInput);
    fileInput.style.display="none";
    frm.fileComponent=fileInput;
    fileInput.click();
}
