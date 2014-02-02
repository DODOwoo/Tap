
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