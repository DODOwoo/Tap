var backgroundcolors = ['#1ABC9C','#16A085','#2ECC71','#27AE60','#3498DB','#2980B9','#9B59B6','#8E44AD','#34495E','#2C3E50','#F1C40F','#F39C12','#E67E22','#D35400','#E74C3C','#C0392B','#ECF0F1','#BDC3C7','#95A5A6','#7F8C8D'];
var titleLeft = 180;
var maxruleLength = 0;
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

var selectedColorIndex = [];
var getRandomColor = function(){
	if(selectedColorIndex.length === 20){
		selectedColorIndex = [];
	}
	for(i=Math.round(Math.random()*20); jQuery.inArray(i,selectedColorIndex) > -1; i = Math.round(Math.random()*20)){
	}
	selectedColorIndex.push(i);
	return backgroundcolors[i];
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
	var maxLength = titleLeft;
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
	var maxClock = (maxLength - titleLeft)/20;
	while(maxClock > maxruleLength){
		enlargeContainer();
	}
	return maxClock;
}
 
var canPutHere = function(newOccupied){
	var isfree = true;
	$.each(newOccupied, function (index, value) {
		isfree = isFree(value.parentId, value.newLeft, value.newWidth);
		if(!isfree){
			return false;
		}
	});
	return isfree;
}

var getMinFreeLeft = function(newOccupied,wantedLeft) {
	var margin = 0;
	var lastOccupied = newOccupied;
	for (; !canPutHere(lastOccupied);) {
		margin+=20;
		lastOccupied = marginOccupied(lastOccupied, 20);
	}
	return wantedLeft + margin;
}

var marginOccupied = function(tempOccupited, margin){
	var tempObj = [];
	$.each(tempOccupited, function(i, temp){
		tempObj.push({parentId:temp.parentId, newLeft:temp.newLeft + margin, newWidth: temp.newWidth})
	})
	return tempObj;
}

var threadLeftObjs = '{"obj":[]}';// '{"obj":[{"threadid":"thread0","occupiedLeft":[120,140,160]},{"threadid":"thread1","occupiedLeft":[120,140,160]} ]}';
var isAllFree = function(classname) {
	var selectors2 = $('.'+ classname);
	var isfree = true;
	selectors2.each(function () {
		var prologLeft = 0;
		if($(this).attr('prolog-left')){
			prologLeft = convertToInt($(this).attr('prolog-left'));
		}
		isfree = isFree($(this)[0].parentNode.id, Math.round((event.pageX-initPageX+ initLeft)/20)*20 + prologLeft,$(this)[0].offsetWidth);
		if(!isfree){
			return false;
		}
	});
	return isfree;
}
var isFree = function(threadid, currentLeft, currentwidth){
	if(currentLeft < titleLeft){
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
				if(jQuery.inArray(i,thread.occupiedLeft)===-1){
					thread.occupiedLeft.push(i);
				}
			}
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
				thread.occupiedLeft = jQuery.grep(thread.occupiedLeft,function(n){
					return n != i;
				});
			}
		}
	})
	threadLeftObjs = JSON.stringify(threadObj);
}

var resetThreadModal = function(){
	$("#thread-name").val('');
}

var resetTaskModal = function(){
	$(".task-name").val('');
    $(".task-comp-length").val('');
    $(".task-prolog-length").val('');
	$.each($('.select-resources .checkbox'), function(i, value){
		$(value).removeClass('checked');
	})
}

var enlargeContainer = function(){
	console.log('btn-enlarge click,container width', $('.container').css('width'));
	var newwidth = convertToInt($('.container').css('width')) + 1000;
	loadContainerWidth(newwidth);
}