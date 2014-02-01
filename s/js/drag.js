var forEach = function (context, fn) {
		[].forEach.call(context, fn)
	}

var handleStart = function (event) {
	var style = window.getComputedStyle(event.target, null);
		
	var allClass = $('#'+event.target.id).attr('class').split(' ');
	var className = allClass[allClass.length-1];
	//console.log('selectorClass',className,allClass);
	/*var selectors = document.querySelectorAll('.'+ className);
	forEach(selectors, function ($dm) {
		//isFree($dm.parentNode.id,Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120,$dm.offsetWidth);
		//console.log($dm, $dm.parentNode, $dm.parentNode.id);
		updateFreeLeft($dm.parentNode.id,parseInt($dm.style.left.replace('px','')),$dm.offsetWidth);
	})*/
	updateAllFreeLeft(className);
	event.dataTransfer.setData('selectorClass', className); 
};

var handleDragOver = function (event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	var selectors = document.querySelectorAll('.'+event.dataTransfer.getData('selectorClass'));
	forEach(selectors, function ($dm) {
		if(!$($dm).is('[draggable]'))
		{
			//$($dm).parents('.threadrow')[0].appendChild($dm);
	    	$dm.parentNode.appendChild($dm);
			$dm.style.left = (event.offsetX + 120 - $dm.offsetWidth/2) + 'px';
			$dm.style.top = '6px'; //(event.offsetY) + 'px';
		}
	})
	return false;
};

var handleDrop = function (event) {
	if (event.stopPropagation) {
		event.stopPropagation();
	}
	//console.log('selectorClass',event.dataTransfer.getData('selectorClass'));
	var selectors = document.querySelectorAll('.'+event.dataTransfer.getData('selectorClass'));
	//console.log('selectors:',selectors, $('.'+event.dataTransfer.getData('selectorClass')));
	//var selectors2 = $('.'+event.dataTransfer.getData('selectorClass'));
	var isfree = isAllFree(event.dataTransfer.getData('selectorClass'));
	/*var isfree = true;
	forEach(selectors, function ($dm) {
		console.log($dm, $dm.parentNode);
		isfree = isFree($dm.parentNode.id,Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120,$dm.offsetWidth);
		if(!isfree){
			return false;
		}
	})*/
	
	var originLeft;
	forEach(selectors, function ($dm) {
		if(!isfree && $($dm).is('[draggable]'))
		{
			originLeft = $dm.style.left;
		}
		$dm.parentNode.appendChild($dm);
		//$dm.style.left = (event.offsetX + 120 - $dm.offsetWidth/2) + 'px';
		//console.log(event.offsetX - $dm.offsetWidth/2+120, (Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120))
		$dm.style.left = isfree? (Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120) + 'px' : originLeft;
		$dm.style.top = '6px'; //(event.offsetY) + 'px';
		updateOccupiedLeft($dm.parentNode.id,parseInt($dm.style.left.replace('px','')),$dm.offsetWidth);
	})
	//updateAllOccupiedLeft(event.dataTransfer.getData('selectorClass'));
	return false;
}	

function initdragevent()
{	
	var plans = document.querySelectorAll('.threadrow .plan');
	var lines = document.querySelectorAll('.threadrow');
	forEach(plans, function ($plan) {
		$plan.addEventListener('dragstart', handleStart, false);
	});
	forEach(lines, function ($line) {
		$line.addEventListener('dragover', handleDragOver, false);
		$line.addEventListener('drop', handleDrop, false);
	});

}
var threadLeftObjs = '{"obj":[]}';// '{"obj":[{"threadid":"thread0","occupiedLeft":[120,140,160]},{"threadid":"thread1","occupiedLeft":[120,140,160]} ]}';
var isAllFree = function(classname) {
	var selectors2 = $('.'+ classname);
	var isfree = true;
	selectors2.each(function () {
		console.log('isAllFree:',event,event.offsetX);
		isfree = isFree($(this)[0].parentNode.id,Math.round((event.offsetX - $(this)[0].offsetWidth/2)/20)*20+120,$(this)[0].offsetWidth);
		if(!isfree){
			return false;
		}
	});
	return isfree;
}
var isFree = function(threadid, currentLeft, currentwidth){
	var isfree = true;
	var threadObj = jQuery.parseJSON(threadLeftObjs);
	$.each(threadObj.obj, function (index, value) {
		if(value.threadid == threadid){
			for(var i = currentLeft; i <= currentLeft+currentwidth; i+=20){
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

var getMaxFree = function(targetids, wantedLeft, wantedWidth) {
	var maxFree = 120;
	$.each(targetids, function (i, targetid) {
		var threadObj = jQuery.parseJSON(threadLeftObjs);
		$.each(threadObj.obj, function (k, thread) {
			if(thread.threadid == targetid){
				var tempLeft = wantedLeft;
				for (var i = tempLeft; i <= tempLeft+wantedWidth; i+=20) {
					if(jQuery.inArray(i,thread.occupiedLeft)>-1){
						tempLeft = i+20;
					}
				}
				if(maxFree < tempLeft){
					maxFree = tempLeft;
				}
			}
		});
	});
	return maxFree;
}

var updateAllOccupiedLeft = function(classname) {
	var selectors = document.querySelectorAll('.'+ classname);
	forEach(selectors, function ($dm) {
		//isFree($dm.parentNode.id,Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120,$dm.offsetWidth);
		//console.log($dm, $dm.parentNode, $dm.parentNode.id);
		updateOccupiedLeft($dm.parentNode.id,parseInt($dm.style.left.replace('px','')),$dm.offsetWidth);
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

var updateAllFreeLeft = function(classname) {
	var selectors = document.querySelectorAll('.'+ classname);
	forEach(selectors, function ($dm) {
		updateFreeLeft($dm.parentNode.id,parseInt($dm.style.left.replace('px','')),$dm.offsetWidth);
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