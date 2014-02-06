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
			var tempmax = thread.occupiedLeft.sort().pop() + 20;
			if(tempmax > maxLength){
				maxLength = tempmax;
			}
		}
	});
	console.log(maxLength);
	return (maxLength-120)/20;
}

var getMinFreeLeft = function(targetids, wantedLeft, wantedWidth) {
	var minFree = 120;
	$.each(targetids, function (i, targetid) {
		var threadObj = jQuery.parseJSON(threadLeftObjs);
		$.each(threadObj.obj, function (k, thread) {
			if(thread.threadid == targetid){
				var tempLeft = wantedLeft;
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

var threadTaskObjs = '{"threads":[],"resources":[],"tasks":[],"container":{}}';
//'{"threads":[{"id":"thread0-x","name":"Thread 0","order":0},{"id":"thread1","name":"Thread 1","order":1}],
//"resources":[{"componentid":"core","instanceid":"core","order":0,"description":""},{"componentid":"vmem_fft","instanceid":"vmem0","order":1,"description":""}],
//"tasks":[{"id":"thread0-x-task0","name":"t3","class":"plan thread0-x-task0xxx","width":"80px","prolog-width":"20px","left":"120px","color":"rgb(241, 196, 15)",
//"task-resources":[{"class":"task thread0-x-task0t3","resource-instanceid":"core","title":"","prolog-left":"0px"},{"class":"thread0-x-task0xxx","resource-instanceid":"vmem0","title":"vmem_fft","prolog-left":"20px"}]
//}], "container":{"width":"1170px","clock":15}}'
var saveAll = function(){
	saveThreads();
	saveResources();
	saveTasks();
	saveContainer();
}

var saveThreads = function(){
	var objs = jQuery.parseJSON(threadTaskObjs);
	$('.thread-rows .threadrow').each(function(i){
		var that = this;
		var temp = $.grep(objs.threads,function(n,j){
			return n.id == $(that).children('.thread').attr('id');
		});
		if(temp.length==0){
			objs.threads.push(
				{
					id:$(that).children('.thread').attr('id'),
					name:$(that).children('.rowtitle').text(),
					order:i
				});
		}
	})
	threadTaskObjs = JSON.stringify(objs)
}

var saveResources = function(){
	var objs = jQuery.parseJSON(threadTaskObjs);
	$.each(jQuery.parseJSON(Resources), function(i, resource){
		var temp = $.grep(objs.resources,function(n,j){
			return n.instanceid == resource.instanceid;
		});
		if(temp.length == 0){
			objs.resources.push(
				{
					componentid:resource.componentid,
					instanceid:resource.instanceid,
					order:i,
					description:resource.description
				});
		}
	})
	threadTaskObjs = JSON.stringify(objs)
}

var saveTasks = function(){
	var objs = jQuery.parseJSON(threadTaskObjs);
	$('.plan').each(function(i){
		var that = this;
		var temp = $.grep(objs.tasks,function(n,j){
			return n.id == that.id;
		});
		var allClass = $(that).attr('class').split(' ');
		var className = allClass[allClass.length-1];
		var taskresources = [];
		$('.instances .'+className).each(function(k){
			taskresources.push({
				class:$(this).attr('class'),
				'resource-instanceid':$(this).text(),
				title:$(this).attr('data-original-title'),
				'prolog-left': $(this).attr('prolog-left')
			})
		})
		if(temp.length==0){
			objs.tasks.push(
				{
					id: that.id,
					name:$(that).text(),
					class:$(that).attr('class'),
					width:$(that).css('width'),
					left:$(that).css('left'),
					'prolog-width':$(that).attr('prolog-width'),
					color:$(that).css('color'),
					'task-resources':taskresources
				});
		}
	})
	threadTaskObjs = JSON.stringify(objs)
}

var saveContainer = function(){
	var objs = jQuery.parseJSON(threadTaskObjs);
	objs.container.clock = $('#threadLength').text();
	objs.container.width = $('.container').css('width');
	threadTaskObjs = JSON.stringify(objs)
}

var output = $('output')[0];

const MIME_TYPE = 'text/plain';

var cleanUp = function(a) {
	a.textContent = 'Downloaded';
	a.dataset.disabled = true;

	// Need a small delay for the revokeObjectURL to work properly.
	setTimeout(function() {
	window.URL.revokeObjectURL(a.href);
	}, 1500);
};

var downloadFile = function() {
	saveAll();
	window.URL = window.webkitURL || window.URL;

	var prevLink = output.querySelector('a');
	if (prevLink) {
	window.URL.revokeObjectURL(prevLink.href);
	output.innerHTML = '';
	}

	var bb = new Blob([threadTaskObjs], {type: MIME_TYPE});

	var a = document.createElement('a');
	a.download = $('#file-name').val();
	a.href = window.URL.createObjectURL(bb);
	a.textContent = 'Download ready';

	a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
	a.draggable = true; // Don't really need, but good practice.
	a.classList.add('dragout');

	output.appendChild(a);

	a.onclick = function(e) {
		if ('disabled' in this.dataset) {
		  return false;
		}

		//cleanUp(this);
	};
};