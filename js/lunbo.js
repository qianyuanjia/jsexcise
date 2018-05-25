let picNum=$('.pics>li').length;
$('.pics').width((picNum+1)*430);
$('.pics>li:first').clone(true).appendTo('.pics');
let n=0;
setInterval(() => {
	n++;
	$('.pics').animate({'margin-left':-430*n},300,function(){
		if(n===picNum){
			n=0;
			$('.pics').css('margin-left',0);
		}
	});
},2000);