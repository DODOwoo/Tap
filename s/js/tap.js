var forEach = function (context, fn) {
		[].forEach.call(context, fn)
	}

var handleStart = function (event) {
	var style = window.getComputedStyle(event.target, null);
		
	var allClass = $('#'+event.target.id).attr('class').split(' ');
	var className = allClass[allClass.length-1];
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

	var selectors = document.querySelectorAll('.'+event.dataTransfer.getData('selectorClass'));
	forEach(selectors, function ($dm) {
		$dm.parentNode.appendChild($dm);
		//$dm.style.left = (event.offsetX + 120 - $dm.offsetWidth/2) + 'px';
		console.log(event.offsetX - $dm.offsetWidth/2+120, (Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120))
		$dm.style.left = (Math.round((event.offsetX - $dm.offsetWidth/2)/20)*20+120) + 'px';
		$dm.style.top = '6px'; //(event.offsetY) + 'px';
	})
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