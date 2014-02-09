var forEach = function (context, fn) {
		[].forEach.call(context, fn)
}

var convertToInt = function(width_str){
	return parseInt(width_str.replace('px',''));
}

var convertToClock = function(width_int){
	return Math.round(width_int/20);
}

var convertToWidth = function(clock){
	return clock * 20 + 'px';
}

var getMixPlanColor = function(color, width){
	var str = 'background: '+ color +';'
    str += 'background: -moz-linear-gradient(left,  #CCFACC '+ width +', '+ color +' 0);'
    str += 'background: -webkit-gradient(linear, left top, right top, color-stop('+ width +'px, #CCFACC), color-stop(0,'+ color +'));'
    str += 'background: -webkit-linear-gradient(left,  #CCFACC '+ width +'px,'+ color +' 0);'
    str += 'background: -o-linear-gradient(left,  #CCFACC '+ width +'px,'+ color +' 0);'
    str += 'background: -ms-linear-gradient(left,  #CCFACC '+ width +'px,'+ color +' 0);'
    str += 'background: linear-gradient(to right,  #CCFACC '+ width +'px,'+ color +' 0);'
    str += 'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=\'#CCFACC\', endColorstr=\''+ color +'\',GradientType=1 );'
    return str;
}

var getMaxLength = function() {
	var maxLength = 120;
	var threadObj = jQuery.parseJSON(threadLeftObjs);
	$.each(threadObj.obj, function (k, thread) {
		if(thread.occupiedLeft.length > 0){
			thread.occupiedLeft.sort(function ascending( a, b ) {
			    return a - b;
			})
			var tempmax = thread.occupiedLeft.pop() + 20;
			if(tempmax > maxLength){
				maxLength = tempmax;
			}
		}
	});
	console.log(maxLength);
	return (maxLength-120)/20;
}

var getMinFreeLeft = function(targetids, wantedLeft, wantedWidth) {
	var minFree = wantedLeft;
	$.each(targetids, function (i, targetid) {
		var threadObj = jQuery.parseJSON(threadLeftObjs);
		$.each(threadObj.obj, function (k, thread) {
			if(thread.threadid == targetid){
				var tempLeft = minFree;
				for (var i = tempLeft; i < tempLeft+wantedWidth; i+=20) {
					if(jQuery.inArray(i,thread.occupiedLeft)>-1){
						tempLeft = i+20;
					}
				}
				if(minFree < tempLeft){
					minFree = tempLeft;
				}
			}
		});
	});
	return minFree;
}

var threadLeftObjs = '{"obj":[]}';// '{"obj":[{"threadid":"thread0","occupiedLeft":[120,140,160]},{"threadid":"thread1","occupiedLeft":[120,140,160]} ]}';
var isAllFree = function(classname) {
	var selectors2 = $('.'+ classname);
	var isfree = true;
	selectors2.each(function () {
		console.log('isAllFree:',event,event.offsetX);
		isfree = isFree($(this)[0].parentNode.id, Math.round((event.pageX-initPageX+ initLeft)/20)*20,$(this)[0].offsetWidth);
		if(!isfree){
			return false;
		}
	});
	return isfree;
}
var isFree = function(threadid, currentLeft, currentwidth){
	if(currentLeft < 120){
		return false;
	}
	var isfree = true;
	var threadObj = jQuery.parseJSON(threadLeftObjs);
	$.each(threadObj.obj, function (index, value) {
		if(value.threadid == threadid){
			for(var i = currentLeft; i < currentLeft+currentwidth; i+=20){
				if(jQuery.inArray(i,value.occupiedLeft)>-1){
					console.log('alreay has task here',value.threadid, i,jQuery.inArray(i,value.occupiedLeft));
					isfree = false;
					break;
				}
			}
			if(!isfree){
				return isfree;
			}
		}
	});
	return isfree;
}

var updateAllOccupiedLeft = function(classname) {
	var selectors = document.querySelectorAll('.'+ classname);
	forEach(selectors, function ($dm) {
		//isFree($dm.parentNode.id,Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120,$dm.offsetWidth);
		//console.log($dm, $dm.parentNode, $dm.parentNode.id);
		updateOccupiedLeft($dm.parentNode.id,convertToInt($dm.style.left),$dm.offsetWidth);
	})
	console.log('updateAllOccupiedLeft:',threadLeftObjs);
}
var updateOccupiedLeft = function(threadid, occupiedLeft, currentwidth) {
	var threadObj = jQuery.parseJSON(threadLeftObjs);
	var isThreadOccuied = false;
	forEach(threadObj.obj, function(thread){
		if(thread.threadid == threadid){
			isThreadOccuied = true;
			for(var i = occupiedLeft; i < occupiedLeft+currentwidth; i+=20){
				//console.log(thread.threadid, i, jQuery.inArray(i,thread.threadid));
				if(jQuery.inArray(i,thread.occupiedLeft)===-1){
					thread.occupiedLeft.push(i);
				}
				//console.log('in thread '+threadid+' occupiedLeft',thread.occupiedLeft);
			}
			//console.log('in threadObj:',threadObj)
		}
	})
	if(!isThreadOccuied){
		var newOccupiedThread = {};
		newOccupiedThread.threadid = threadid;
		newOccupiedThread.occupiedLeft = [];
		for(var i = occupiedLeft; i < occupiedLeft + currentwidth; i+=20){
			newOccupiedThread.occupiedLeft.push(i);
		}
		threadObj.obj.push(newOccupiedThread);
		//console.log('not in threadObj:',threadObj);
	}
	threadLeftObjs = JSON.stringify(threadObj);
	console.log('updateOccupiedLeft:',threadLeftObjs);
}

var resetOccupiedLeft = function () {
	threadLeftObjs = '{"obj":[]}';
}

var updateAllFreeLeft = function(classname) {
	var selectors = document.querySelectorAll('.'+ classname);
	forEach(selectors, function ($dm) {
		updateFreeLeft($dm.parentNode.id,convertToInt($dm.style.left),$dm.offsetWidth);
	})
	console.log('updateAllFreeLeft:',threadLeftObjs);
}
var updateFreeLeft = function(threadid, freeLeft, currentwidth) {
	var threadObj = jQuery.parseJSON(threadLeftObjs);
	forEach(threadObj.obj, function(thread){
		if(thread.threadid == threadid){
			for(var i = freeLeft; i < freeLeft+currentwidth; i+=20){
				//console.log('updateFreeLeft:',thread.threadid, i, jQuery.inArray(i,thread.occupiedLeft));
				thread.occupiedLeft = jQuery.grep(thread.occupiedLeft,function(n){
					return n != i;
				});
				//console.log('updateFreeLeft after remove occupiedLeft',thread.occupiedLeft);
			}
			//console.log('in threadObj:',threadObj)
		}
	})
	threadLeftObjs = JSON.stringify(threadObj);
	//console.log('updateFreeLeft:',threadLeftObjs);
}