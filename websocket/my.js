//通过id获取元素对象
function getById(id){
	return document.getElementById(id);
}
//通过tagname获取元素对象,obj是父元素
function getByTag(obj,tag){
	return obj.getElementsByTagName(tag);
}	
//获取计算样式
function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

//上下左右移动,宽高缩放函数封装
function doMove(obj,attr,step,target,callback){
	clearInterval(obj.doMove_timer);
	step=target>parseInt(getStyle(obj,attr))?step:-step;
	var nextState=0;
	obj.doMove_timer=setInterval(function(){
		nextState=parseInt(getStyle(obj,attr))+step; 
		if(nextState>target && step>0 || nextState<target && step<0){
			nextState=target;
		}
		obj.style[attr]=nextState+'px';
		if(nextState==target){
			clearInterval(obj.doMove_timer);
			callback && callback();
		}
	},30);
}

//上下或左右抖动函数封装
function doShake(obj,dir,offset){
	var arr=[];	
	if(!obj.oldState){
		obj.oldState=parseInt(getStyle(obj,dir));
	}	
	var idx=0;
	for(var i=offset;i>0;i-=2){
		arr.push(i,-i);
	}
	arr.push(0);
	clearInterval(obj.shake_timer);
	obj.shake_timer=setInterval(function(){
		obj.style[dir]=obj.oldState+arr[idx]+'px';
		idx++;
		if(idx>arr.length-1){
			clearInterval(obj.shake_timer);
		}
	},60);
}

//透明度渐变函数封装
function doOpacity(obj,step,target,callback){
	step=parseInt(getStyle(obj,'opacity')*100)<target?step:-step;
	clearInterval(obj.opacity_timer);
	var nextState=0;
	obj.opacity_timer=setInterval(function(){
		nextState=parseInt(getStyle(obj,'opacity')*100)+step;
		if(nextState>target && step>0 || nextState<target && step<0){
			nextState=target;
		}
		obj.style.opacity=nextState/100;
		if(nextState==target){
			clearInterval(obj.opacity_timer);
			callback && callback();
		}
	},100);
}

//获取元素距离页面左侧顶部距离函数的封装
function getPos(obj){
	var pos={left:0,top:0};
	while(obj){
		pos.left += obj.offsetLeft;
		pos.top += obj.offsetTop;
		obj=obj.offsetParent;
	}
	return pos;
}

//通过class获取元素对象函数的封装
function getByClass(parent,tagName,className){
	var eles=parent.getElementsByTagName(tagName);
	var arr=[];
	var arrClass=[];
	var idx=-1;
	for(var i=0;i<eles.length;i++){
		arrClass=eles[i].className.split(' ');
		idx=searchArr(arrClass,className);
		if(idx!=-1) arr.push(eles[i]);
	}
	return arr;
}

//给元素添加class
function addClass(obj,className){
	if(obj.className==''){
		obj.className=className;
	}else{
		//检查class中是否包含要添加的class,不存在就添加
		var idx=searchArr(obj.className.split(' '),className);
		if(idx==-1) obj.className += ' '+className;
	}
}

//给元素删除class
function removeClass(obj,className){
	if(obj.className){
		var classArr=obj.className.split(' ');
		var idx=searchArr(classArr,className);
		if(idx!=-1){
			classArr.splice(idx,1);
			obj.className=classArr.join(' ');
		}
	}
}
//查找数组中是否存在某个元素，若存在，返回第一个找到的索引值，不存在返回-1;
function searchArr(arr,ele){
	for(var i=0;i<arr.length;i++){
		if(arr[i]===ele){
			return i;
		}
	}
	return -1;
}

//获取页面顶部滚动以及左侧滚动的距离
function getScrollDis(){
	var dis={};
	dis.top=document.documentElement.scrollTop || document.body.scrollTop;
	dis.left=document.documentElement.scrollLeft || document.body.scrollLeft;
	return dis;
}


//绑定事件函数第二种方式的封装,不支持事件捕获
function bind(obj,evtName,fn){
	if(obj.addEventListener){
		obj.addEventListener(evtName,fn,false);
	}else{
		obj.attachEvent('on'+evtName,function(){
			fn.call(obj);//事件函数内部this指向obj;
		});
	}
}
//解绑事件函数的封装,前提是必须以bind绑定事件函数,移除事件函数只能为外部事件函数，匿名事件函数是无法移除的
function unbind(obj,evtName,fn){
	if(obj.addEventListener){
		obj.removeEventListener(evtName,fn,false);
	}else{
		obj.detachEvent('on'+evtName,fn);
	}
}
//获取页面可视区域宽高函数封装
function getClientSize(){
	var size={};
	size.width=document.documentElement.clientWidth;
	size.height=document.documentElement.clientHeight;
	return size;
}

//拖拽元素的封装
function drag(obj){
	obj.onmousedown=function(evt){
		var evt=evt || event;
		var disX=evt.clientX-obj.offsetLeft;
		var disY=evt.clientY-obj.offsetTop;
		if(obj.setCapture){ //非标准ie下设置全局捕获事件，将浏览器默认行为事件拦截过来
			obj.setCapture();
		}
		document.onmousemove=function(evt){
			var evt=evt || event;
			obj.style.left=evt.clientX-disX+'px';
			obj.style.top=evt.clientY-disY+'px';
		}
		document.onmouseup=function(){
			document.onmousemove=null;
			document.onmouseup=null;
			if(obj.releaseCapture){
				obj.releaseCapture();//全局捕获事件释放
			}
		}
		return false;//标准浏览器下阻止文字或图片被选中拖动的默认行为。
	}
}
//设置cookie函数封装
function setCookie(key,val,days){
	var date=new Date();
	date.setDate(date.getDate()+days);
	document.cookie=key+'='+encodeURIComponent(val)+';expires='+date.toUTCString();
}

//获取cookie值函数封装
function getCookie(key){
	var arr1=document.cookie.split('; ');
	for(var i=0;i<arr1.length;i++){
		var arr2=arr1[i].split('=');
		if(arr2[0]==key){
			return decodeURIComponent(arr2[1]);
		}
	}
}
//删除cookie
function removeCookie(key){
	setCookie(key,'',-1);
}

//圆点渐隐Canvas动画函数封装
function cirAnimation(canvasId,initialRadius,cirArrInterval,RadiusDelta,alphaDelta){
	var oCan=document.getElementById(canvasId);
	var oCtx=oCan.getContext('2d');
	var cirArr=[];
	//设置定时器用于生成圆点数组的信息
	setInterval(function(){
		var x=Math.floor(Math.random()*oCan.width);
		var y=Math.floor(Math.random()*oCan.height);
		var R=Math.floor(Math.random()*256);
		var G=Math.floor(Math.random()*256);
		var B=Math.floor(Math.random()*256);
		var A=1;
		cirArr.push({
			x:x,
			y:y,
			r:initialRadius,
			R:R,
			G:G,
			B:B,
			A:A
		});
	},cirArrInterval);
	setInterval(function(){
		oCtx.clearRect(0,0,oCan.width,oCan.height);
		for(var i=0;i<cirArr.length;i++){				
			oCtx.beginPath();
			oCtx.fillStyle='rgba('+cirArr[i].R+','+cirArr[i].G+','+cirArr[i].B+','+cirArr[i].A+')';
			oCtx.moveTo(cirArr[i].x,cirArr[i].y);
			oCtx.arc(cirArr[i].x,cirArr[i].y,cirArr[i].r,0,2*Math.PI,false);
			oCtx.closePath();
			oCtx.fill();				
		}

		for(var i=0;i<cirArr.length;i++){
			cirArr[i].r+=RadiusDelta;
			cirArr[i].A-=alphaDelta;
			if(cirArr[i].A<=0){
				cirArr.splice(i,1);
			}
		}
	},1000/60);
}

//对象浅拷贝函数
function copy(obj){
	var newObj={};
	for(var attr in obj){
		newObj[attr]=obj[attr];
	}
	return newObj;
}

//对象深拷贝函数
function deepCopy(obj){
	if(typeof obj !='object'){
		return obj;
	}
	var newObj={};
	for(var attr in obj){
		newObj[attr]=deepCopy(obj[attr]);
	}
	return newObj;
}

//随机取数函数封装，从1~max中选择num个数
function randNum(max,num){
	var arr=[];
	var res=[];
	for(var i=1;i<=max;i++){
		arr.push(i);
	}
	for(var i=0;i<num;i++){
		res.push(arr.splice(Math.floor(Math.random()*arr.length),1));
	}
	return res;
}

//选中文字函数封装，返回值是选中的文本字符串
function selectText(){
	if(document.selection){ //ie下
		return document.selection.createRange().text;
	}else{
		//标准下
		return window.getSelection().toString();
	}
}

//ajax函数封装
function ajax(method,url,data,callback){
	try{
		var xhr=new XMLHttpRequest();
	}catch(e){
		var xhr=new ActiveXObject('Microsoft.XMLHTTP');
	}
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4 && xhr.status==200){
			callback(xhr.responseText);
		}
	}
	if(method.toLowerCase()==='get'){
		xhr.open('get',url+'?'+data,true);
		xhr.send();
	}else{
		xhr.open('post',url,true);
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		xhr.send(data);
	}


}

//匀速运动框架的封装，需要getStyle()
function linearMoveFn(obj,attrJson,speed,callback){
		clearInterval(obj.timer);
		var startAttr={};
		obj.timer=setInterval(function(){
			var flag=true;
			for(var attr in attrJson){					
				if(attr=='opacity'){
					if(Math.round(getStyle(obj,attr)*100)!=attrJson[attr]*100){
						flag=false;
						if(startAttr[attr]==undefined){
							startAttr[attr]=Math.round(getStyle(obj,attr)*100);
							speed=attrJson[attr]*100>startAttr[attr]?speed:speed*-1;
					}
						var curOpacity=Math.round(getStyle(obj,attr)*100);
						obj.style[attr]=(curOpacity+speed)/100;
						obj.style.filter='alpha('+(curOpacity+speed)+')';
					}
				}else{	
					if(parseInt(getStyle(obj,attr))!=attrJson[attr]){
						flag=false;
						if(startAttr[attr]==undefined){
							startAttr[attr]=parseInt(getStyle(obj,attr));
							speed=attrJson[attr]>startAttr[attr]?speed:speed*-1;
						}
						obj.style[attr]=parseInt(getStyle(obj,attr))+speed+'px';
					}
				}
				if(flag){
					clearInterval(obj.timer);
					callback && callback.call(obj);
				}
			}
		},30);
}

//缓动框架封装
function easeMoveFn(obj,attrJson,callback){
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var flag=true;
		for(var attr in attrJson){					
			if(attr=='opacity'){
				if(Math.round(getStyle(obj,attr)*100)!=attrJson[attr]*100){
					flag=false;
					var curOpacity=Math.round(getStyle(obj,attr)*100);
					var speed=attrJson[attr]*100>curOpacity?Math.ceil((attrJson[attr]*100-curOpacity)/8):Math.floor((attrJson[attr]*100-curOpacity)/8);
					obj.style[attr]=(curOpacity+speed)/100;
					obj.style.filter='alpha('+(curOpacity+speed)+')';
				}
			}else{	
				if(parseInt(getStyle(obj,attr))!=attrJson[attr]){
					flag=false;
					var current=parseInt(getStyle(obj,attr));
					var speed=attrJson[attr]>current?Math.ceil((attrJson[attr]-current)/8):Math.floor((attrJson[attr]-current)/8);
					obj.style[attr]=current+speed+'px';
				}
			}
			if(flag){
				clearInterval(obj.timer);
				callback && callback.call(obj);
			}
		}
	},30);
}