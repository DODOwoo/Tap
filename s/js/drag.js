
var handleStart = function (event) {
	var style = window.getComputedStyle(event.target, null);
		
	var allClass = $('#'+event.target.id).attr('class').split(' ');
	var className = allClass[allClass.length-1];

	updateAllFreeLeft(className);
	initPageX = event.pageX;
	initLeft = parseInt($('#'+event.target.id).css('left').replace('px',''));
	event.dataTransfer.setData('selectorClass', className); 
};
var initPageX = 0;
var initLeft = 120;

var handleDragOver = function (event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	var selectors = document.querySelectorAll('.'+event.dataTransfer.getData('selectorClass'));
	forEach(selectors, function ($dm) {
		if(!$($dm).is('[draggable]'))
		{
	    	$dm.parentNode.appendChild($dm);
			$dm.style.left = (event.pageX-initPageX)+ initLeft + 'px'; //(event.offsetX + 120 - $dm.offsetWidth/2) + 'px';
			$dm.style.top = '6px'; //(event.offsetY) + 'px';
		}
	})
	return false;
};

var handleDrop = function (event) {
	if (event.stopPropagation) {
		event.stopPropagation();
	}
	var selectors = document.querySelectorAll('.'+event.dataTransfer.getData('selectorClass'));
	var isfree = isAllFree(event.dataTransfer.getData('selectorClass'));
	
	var originLeft;
	forEach(selectors, function ($dm) {
		if(!isfree && $($dm).is('[draggable]'))
		{
			originLeft = $dm.style.left;
		}
		$dm.parentNode.appendChild($dm);
		//$dm.style.left = (event.offsetX + 120 - $dm.offsetWidth/2) + 'px';
		//console.log(event.offsetX - $dm.offsetWidth/2+120, (Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120))
		$dm.style.left = isfree? (Math.round((event.pageX-initPageX+ initLeft)/20)*20) + 'px' : originLeft;
		//isfree? (Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120) + 'px' : originLeft;
		$dm.style.top = '6px'; //(event.offsetY) + 'px';
		updateOccupiedLeft($dm.parentNode.id,parseInt($dm.style.left.replace('px','')),$dm.offsetWidth);
	})
	//updateAllOccupiedLeft(event.dataTransfer.getData('selectorClass'));
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