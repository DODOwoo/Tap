
var dragClass = '';
var handleStart = function (event) {
	var style = window.getComputedStyle(event.target, null);
		
	var allClass = $('#'+event.target.id).attr('class').split(' ');
	var className = allClass[allClass.length-1];

	updateAllFreeLeft(className);
	initPageX = event.pageX;
	initLeft = convertToInt($('#'+event.target.id).css('left'));
	event.dataTransfer.effectAllowed = 'move';
	//event.dataTransfer.setData('selectorClass', className);
	dragClass = className;
	return true;
};
var initPageX = 0;
var initLeft = titleLeft;

var handleDragOver = function (event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	var selectors = document.querySelectorAll('.'+ dragClass); //event.dataTransfer.getData('selectorClass'));
	forEach(selectors, function ($dm) {
		if(!$($dm).is('[draggable]'))
		{
	    	$dm.parentNode.appendChild($dm);
	    	var prologwidth = convertToInt($($dm).attr('prolog-left'));
			$dm.style.left = (event.pageX-initPageX) + prologwidth + initLeft + 'px';
			$dm.style.top = '6px'; //(event.offsetY) + 'px';
		}
	})
	return false;
};

var handleDrop = function (event) {
	if (event.stopPropagation) {
		event.stopPropagation();
	}
	var selectors = document.querySelectorAll('.'+ dragClass);
	var tempObjs = []
	forEach(selectors, function ($dm) {
		var prologwidth = 0;
		if($($dm).is('[prolog-left]')){
			prologwidth = convertToInt($($dm).attr('prolog-left'));
		}
		console.log('dropParent',$dm.parentNode,$dm.offsetWidth)
		tempObjs.push({parentId:$dm.parentNode.id ,newLeft:convertToClock(event.pageX-initPageX + prologwidth + initLeft)*20,newWidth:$dm.offsetWidth})
	})
	var isfree = canPutHere(tempObjs)

	var originLeft;
	forEach(selectors, function ($dm) {
		if(!isfree && $($dm).is('[draggable]'))
		{
			originLeft = $dm.style.left;
		}
		$dm.parentNode.appendChild($dm);

		var prologwidth = 0;
		if($($dm).is('[prolog-left]')){
			prologwidth = convertToInt($($dm).attr('prolog-left'));
		}
		$dm.style.left = isfree? convertToWidth(convertToClock(event.pageX-initPageX + prologwidth + initLeft)) : (convertToInt(originLeft) + prologwidth)+'px';
		$dm.style.top = '6px';
		updateOccupiedLeft($dm.parentNode.id,convertToInt($dm.style.left),$dm.offsetWidth);
	})
	$('#threadLength').text(getMaxLength());
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