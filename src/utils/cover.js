function resetObj(obj){
    for(var k in obj){
    	obj[k] ='';
    }
    return obj;
}

var cloneObj=function cloneObject(obj){
    var result;
    var oClass=isClass(obj);
    if(oClass==="Object"){
        result={};
    }else if(oClass==="Array"){
        result=[];
    }else{
        return obj;
    }
    for(var key in obj){
       var copy=obj[key];
       if(isClass(copy)=="Object"){
           result[key]=cloneObject(copy);//递归调用
        }else if(isClass(copy)=="Array"){
           result[key]=cloneObject(copy);
        }else{
            result[key]=obj[key];
        }
    }
 return result;
}


export {resetObj,cloneObj }
//判断对象的数据类型
function isClass(o){
    if(o===null) return "Null";
    if(o===undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}
