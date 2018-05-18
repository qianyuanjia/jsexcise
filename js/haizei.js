window.onload=function(){
	var oPic=document.getElementById('pic');
	var oMark=document.getElementById('mark');
	var oShow=document.getElementById('show');
	var oSave=document.getElementById('save');
	oSave.onclick=function(){
		if(oShow.offsetWidth>0){
			saveFile(oShow.src,'裁剪图');
		}
		return false;
	}
	function saveFile(data,filename){
           var save_link=document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
           save_link.href=data;
           save_link.download=filename;
           var event=document.createEvent('MouseEvents');
           event.initMouseEvent('click',true,false,window,0,0,0,0,0,false,false,false,false,0,null);
           save_link.dispatchEvent(event);
	  };
	oPic.addEventListener('change',addFile,false);
	function addFile(){
		var file=this.files[0];
		var fr=new FileReader();
		fr.readAsDataURL(file);
		fr.onload=function(ev){
			var ev=ev || window.event;
			var oImg=new Image();
			oImg.onload=function(){
				if(document.getElementsByTagName('canvas').length==0){	
					var oCan=document.createElement('canvas');
					document.body.insertBefore(oCan,oShow);
				}else{
					var oCan=document.getElementsByTagName('canvas')[0];
				}
				oCan.width=oImg.width;
				oCan.height=oImg.height;
				var oCtx=oCan.getContext('2d');
				oCtx.drawImage(oImg,0,0);
				oCan.onmousedown=function(ev){
					var ev=ev || window.event;
					var disX=ev.clientX;
					var disY=ev.clientY;
					document.onmousemove=function(ev){
						var ev=ev || window.event;
						var iWidth=Math.abs(ev.clientX-disX);
						var iHeight=Math.abs(ev.clientY-disY);
						var iLeft=Math.min(ev.clientX,disX);
						var iTop=Math.min(ev.clientY,disY);
						if(ev.clientX>oCan.offsetLeft+oCan.offsetWidth){
							iWidth=oCan.offsetLeft+oCan.offsetWidth-disX;
						}
						if(ev.clientY>oCan.offsetTop+oCan.offsetHeight){
							iHeight=oCan.offsetTop+oCan.offsetHeight-disY;
						}
						if(ev.clientX<oCan.offsetLeft){
							iWidth=disX-oCan.offsetLeft;
						}
						if(ev.clientY<oCan.offsetTop){
							iHeight=disY-oCan.offsetTop;
						}
						oMark.style.width=iWidth+'px';
						oMark.style.height=iHeight+'px';
						oMark.style.left=iLeft+'px';
						oMark.style.top=iTop+'px';
						oMark.style.display='block';

						if(iWidth>0 && iHeight>0){
							var oImgData=oCtx.getImageData(iLeft-oCan.offsetLeft,iTop-oCan.offsetTop,iWidth,iHeight);
							var newCan=document.createElement('canvas');
							var newCtx=newCan.getContext('2d');
							newCan.width=oImgData.width;
							newCan.height=oImgData.height;
							newCtx.putImageData(oImgData,0,0);
							oShow.src=newCan.toDataURL(file.type);
							oShow.style.display="inline-block";
						}
					}
					document.onmouseup=function(){
						document.onmousemove=null;
						document.onmouseup=null;
						oMark.onmousedown=function(ev){
							var ev=ev || window.event;
							var _this=this;
							var disX=ev.clientX-this.offsetLeft;
							var disY=ev.clientY-this.offsetTop;
							document.onmousemove=function(ev){
								var ev= ev || window.event;
								var iLeft=ev.clientX-disX;
								var iTop=ev.clientY-disY;
								if(iLeft<oCan.offsetLeft){
									iLeft=oCan.offsetLeft;
								}
								if(iLeft+_this.offsetWidth>oCan.offsetLeft+oCan.offsetWidth){
									iLeft=oCan.offsetLeft+oCan.offsetWidth-_this.offsetWidth;
								}
								if(iTop<oCan.offsetTop){
									iTop=oCan.offsetTop;
								}
								if(iTop+_this.offsetHeight>oCan.offsetTop+oCan.offsetHeight){
									iTop=oCan.offsetTop+oCan.offsetHeight-_this.offsetHeight;
								}
								_this.style.left=iLeft+'px';
								_this.style.top=iTop+'px';

								var newCan=document.createElement('canvas');
								var newCtx=newCan.getContext('2d');
								newCan.width=_this.offsetWidth;
								newCan.height=_this.offsetHeight;
								var oImgData=oCtx.getImageData(_this.offsetLeft-oCan.offsetLeft,_this.offsetTop-oCan.offsetTop,_this.offsetWidth,_this.offsetHeight);
								newCtx.putImageData(oImgData,0,0);
								oShow.src=newCan.toDataURL(file.type);
							}
							document.onmouseup=function(){
								document.onmousemove=document.onmouseup=null;
							}
							return false;
						}
					}
					return false;
				}
			}
			oImg.src=ev.target.result;
		}
	}
}